import bcrypt
import re
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.orm import Session

from models import UserModel
from services.competences import creer as creer_competences
from services.categories import creer_pour_utilisateur as creer_categories

SECRET_KEY = "dev-secret-key-change-in-production"
ALGORITHM = "HS256"
EXPIRE_MINUTES = 60 * 24

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="connexion")


class InscriptionData(BaseModel):
    nom: str = Field(min_length=6)
    mot_de_passe: str = Field(min_length=8)

    @field_validator("mot_de_passe")
    @classmethod
    def valider_complexite(cls, v: str) -> str:
        if not re.search(r"[a-z]", v):
            raise ValueError("Le mot de passe doit contenir au moins une minuscule (a-z)")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Le mot de passe doit contenir au moins une majuscule (A-Z)")
        if not re.search(r"[0-9]", v):
            raise ValueError("Le mot de passe doit contenir au moins un chiffre (0-9)")
        if not re.search(r"[!@#$%^&*()\-_=+\[\]{};:'\",.<>?/\\|~`]", v):
            raise ValueError("Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*...)")
        return v


class ConnexionData(BaseModel):
    nom: str
    mot_de_passe: str


def _hacher(mot_de_passe: str) -> str:
    return bcrypt.hashpw(mot_de_passe.encode(), bcrypt.gensalt()).decode()


def _verifier(mot_de_passe: str, hash: str) -> bool:
    return bcrypt.checkpw(mot_de_passe.encode(), hash.encode())


def inscrire(data: InscriptionData, db: Session) -> dict:
    if db.query(UserModel).filter(UserModel.nom == data.nom).first():
        raise ValueError("Ce nom d'utilisateur est déjà pris")
    user = UserModel(nom=data.nom, mot_de_passe_hash=_hacher(data.mot_de_passe))
    db.add(user)
    db.commit()
    db.refresh(user)
    creer_competences(user.id, db)
    creer_categories(user.id, db)
    return {"id": user.id, "nom": user.nom}


def connecter(data: ConnexionData, db: Session) -> str:
    user = db.query(UserModel).filter(UserModel.nom == data.nom).first()
    if not user or not _verifier(data.mot_de_passe, user.mot_de_passe_hash):
        raise ValueError("Identifiants incorrects")
    expire = datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_MINUTES)
    return jwt.encode({"sub": str(user.id), "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user_id(token: str = Depends(oauth2_scheme)) -> int:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")
