from sqlalchemy.orm import Session

from models import CompetenceModel

STATS = ["intel", "force", "defense", "vie", "magie"]
POINTS_PAR_NIVEAU = 5


def creer(user_id: int, db: Session) -> CompetenceModel:
    comp = CompetenceModel(user_id=user_id)
    db.add(comp)
    db.commit()
    return comp


def vers_dict(comp: CompetenceModel) -> dict:
    return {
        "intel":              comp.intel,
        "force":              comp.force,
        "defense":            comp.defense,
        "vie":                comp.vie,
        "magie":              comp.magie,
        "points_disponibles": comp.points_disponibles,
    }


def obtenir(user_id: int, db: Session) -> dict:
    comp = db.query(CompetenceModel).filter(CompetenceModel.user_id == user_id).first()
    if not comp:
        raise LookupError("Compétences introuvables")
    return vers_dict(comp)


def ameliorer(user_id: int, stat: str, db: Session) -> dict:
    if stat not in STATS:
        raise ValueError(f"Stat inconnue : {stat}")
    comp = db.query(CompetenceModel).filter(CompetenceModel.user_id == user_id).first()
    if not comp:
        raise LookupError("Compétences introuvables")
    if comp.points_disponibles <= 0:
        raise ValueError("Aucun point disponible")
    setattr(comp, stat, getattr(comp, stat) + 1)
    comp.points_disponibles -= 1
    db.commit()
    db.refresh(comp)
    return vers_dict(comp)
