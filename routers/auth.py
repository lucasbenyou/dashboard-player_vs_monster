from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import UserModel
from services.auth import InscriptionData, ConnexionData, inscrire, connecter, get_current_user_id
from services.niveaux import infos_niveau

router = APIRouter()


@router.post("/inscription")
def inscription(data: InscriptionData, db: Session = Depends(get_db)):
    try:
        return inscrire(data, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/connexion")
def connexion(data: ConnexionData, db: Session = Depends(get_db)):
    try:
        token = connecter(data, db)
        return {"access_token": token, "token_type": "bearer"}
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.get("/profil")
def profil(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    user = db.get(UserModel, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return {"nom": user.nom, **infos_niveau(user.taches_completees)}
