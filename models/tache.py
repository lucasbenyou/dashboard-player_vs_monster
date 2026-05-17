from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class TacheModel(Base):
    __tablename__ = "taches"

    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String, nullable=False)
    description = Column(String, nullable=True)
    terminee = Column(Boolean, nullable=False, default=False)
    categorie = Column(String, nullable=True)
    date_limite = Column(String, nullable=True)  # ISO 8601 datetime string
    profondeur = Column(Integer, nullable=False, default=0)
    parent_id = Column(Integer, ForeignKey("taches.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("utilisateurs.id"), nullable=False)

    sous_taches = relationship(
        "TacheModel",
        back_populates="parent",
        cascade="all, delete-orphan",
    )
    parent = relationship("TacheModel", back_populates="sous_taches", remote_side=[id])
    utilisateur = relationship("UserModel", back_populates="taches")
