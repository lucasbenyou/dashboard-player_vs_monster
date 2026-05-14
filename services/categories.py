from sqlalchemy.orm import Session

from models import CategorieModel, CompetenceModel
from services.niveaux import SEUILS, MAX_NIVEAU, niveau_actuel

TYPES = ["physique", "mental"]

BONUS_SPECIFIQUE = {
    "physique": {"force": 2, "vie": 2},
    "mental":   {"intel": 2, "magie": 2},
}

ICONES = {
    "physique": "💪",
    "mental":   "🧠",
}


def creer_pour_utilisateur(user_id: int, db: Session) -> None:
    for t in TYPES:
        db.add(CategorieModel(user_id=user_id, type_effort=t))
    db.commit()


def completer_tache(user_id: int, type_effort: str, db: Session) -> None:
    if type_effort not in TYPES:
        return
    prog = db.query(CategorieModel).filter(
        CategorieModel.user_id == user_id,
        CategorieModel.type_effort == type_effort,
    ).first()
    if not prog:
        return

    ancien_niveau = niveau_actuel(prog.taches_completees)
    prog.taches_completees += 1
    nouveau_niveau = niveau_actuel(prog.taches_completees)

    if nouveau_niveau > ancien_niveau:
        comp = db.query(CompetenceModel).filter(CompetenceModel.user_id == user_id).first()
        if comp:
            niveaux = nouveau_niveau - ancien_niveau
            for stat, val in BONUS_SPECIFIQUE[type_effort].items():
                setattr(comp, stat, getattr(comp, stat) + val * niveaux)

    db.commit()


def _progression_niveau(taches_completees: int) -> dict:
    niv = niveau_actuel(taches_completees)
    if niv >= MAX_NIVEAU:
        return {"niveau": MAX_NIVEAU, "progression": 100,
                "taches_niveau": taches_completees - SEUILS[MAX_NIVEAU - 2],
                "taches_prochain": None}
    taches_dans = taches_completees - SEUILS[niv - 1]
    taches_pour = SEUILS[niv] - SEUILS[niv - 1]
    return {
        "niveau":          niv,
        "progression":     round(taches_dans / taches_pour * 100),
        "taches_niveau":   taches_dans,
        "taches_prochain": taches_pour,
    }


def infos(user_id: int, db: Session) -> list:
    progressions = db.query(CategorieModel).filter(CategorieModel.user_id == user_id).all()
    return [
        {"type": p.type_effort, "icone": ICONES[p.type_effort], **_progression_niveau(p.taches_completees)}
        for p in progressions
    ]
