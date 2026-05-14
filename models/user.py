from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class UserModel(Base):
    __tablename__ = "utilisateurs"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, unique=True, nullable=False)
    mot_de_passe_hash = Column(String, nullable=False)
    taches_completees = Column(Integer, nullable=False, default=0)

    taches      = relationship("TacheModel",      back_populates="utilisateur", cascade="all, delete-orphan")
    competences = relationship("CompetenceModel", back_populates="utilisateur", uselist=False, cascade="all, delete-orphan")
    categories  = relationship("CategorieModel",  back_populates="utilisateur", cascade="all, delete-orphan")
