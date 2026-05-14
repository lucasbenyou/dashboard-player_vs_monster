from typing import Literal
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from models import TacheModel, UserModel, CompetenceModel
from services.niveaux import niveau_actuel
from services.competences import POINTS_PAR_NIVEAU
from services import categories as cat_service

MAX_SOUS_TACHES = 5
MAX_PROFONDEUR = 2
TYPES_EFFORT = Literal["physique", "mental", "psychologique"]


class TacheCreate(BaseModel):
    titre: str = Field(min_length=1)
    description: str | None = None
    categorie: TYPES_EFFORT | None = None
    parent_id: int | None = None


def _est_complete(tache: TacheModel) -> bool:
    if not tache.sous_taches:
        return tache.terminee
    return all(_est_complete(st) for st in tache.sous_taches)


def _vers_dict(tache: TacheModel) -> dict:
    base = {
        "id":        tache.id,
        "titre":     tache.titre,
        "description": tache.description,
        "categorie": tache.categorie,
        "profondeur": tache.profondeur,
        "parent_id": tache.parent_id,
        "sous_taches": [_vers_dict(st) for st in tache.sous_taches],
    }
    if tache.sous_taches:
        completes = sum(1 for st in tache.sous_taches if _est_complete(st))
        base["progression"] = round(completes / len(tache.sous_taches) * 100)
    else:
        base["terminee"] = tache.terminee
    return base


class TacheService:
    def lister(self, db: Session, user_id: int) -> list:
        racines = (
            db.query(TacheModel)
            .filter(TacheModel.parent_id == None, TacheModel.user_id == user_id)
            .all()
        )
        return [_vers_dict(t) for t in racines]

    def ajouter(self, tache: TacheCreate, db: Session, user_id: int) -> dict:
        profondeur = 0
        if tache.parent_id is not None:
            parent = db.get(TacheModel, tache.parent_id)
            if not parent:
                raise ValueError("Tâche parente introuvable")
            if parent.user_id != user_id:
                raise PermissionError("Cette tâche ne vous appartient pas")
            if parent.profondeur >= MAX_PROFONDEUR:
                raise ValueError(f"Profondeur maximale de {MAX_PROFONDEUR + 1} niveaux atteinte")
            if len(parent.sous_taches) >= MAX_SOUS_TACHES:
                raise ValueError(f"Maximum de {MAX_SOUS_TACHES} sous-tâches par tâche atteint")
            profondeur = parent.profondeur + 1

        nouvelle = TacheModel(
            titre=tache.titre,
            description=tache.description,
            categorie=tache.categorie,
            profondeur=profondeur,
            parent_id=tache.parent_id,
            user_id=user_id,
        )
        db.add(nouvelle)
        db.commit()
        db.refresh(nouvelle)
        return _vers_dict(nouvelle)

    def terminer(self, tache_id: int, db: Session, user_id: int) -> dict:
        t = db.get(TacheModel, tache_id)
        if not t:
            raise LookupError("Tâche introuvable")
        if t.user_id != user_id:
            raise PermissionError("Cette tâche ne vous appartient pas")
        if t.terminee:
            raise ValueError("Cette tâche est déjà terminée")
        if t.sous_taches:
            raise ValueError("Seules les tâches sans sous-tâches peuvent être marquées terminées")

        t.terminee = True

        # Progression niveau global
        user = db.get(UserModel, user_id)
        ancien_niveau = niveau_actuel(user.taches_completees)
        user.taches_completees += 1
        nouveau_niveau = niveau_actuel(user.taches_completees)
        if nouveau_niveau > ancien_niveau:
            comp = db.query(CompetenceModel).filter(CompetenceModel.user_id == user_id).first()
            if comp:
                comp.points_disponibles += POINTS_PAR_NIVEAU * (nouveau_niveau - ancien_niveau)

        # Progression catégorie (applique les bonus de stats directement)
        if t.categorie:
            cat_service.completer_tache(user_id, t.categorie, db)

        db.commit()
        db.refresh(t)
        return _vers_dict(t)

    def supprimer(self, tache_id: int, db: Session, user_id: int) -> bool:
        t = db.get(TacheModel, tache_id)
        if not t:
            return False
        if t.user_id != user_id:
            raise PermissionError("Cette tâche ne vous appartient pas")
        db.delete(t)
        db.commit()
        return True
