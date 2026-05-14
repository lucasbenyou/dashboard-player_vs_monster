from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship

from database import Base


class CompetenceModel(Base):
    __tablename__ = "competences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("utilisateurs.id"), unique=True, nullable=False)

    intel   = Column(Integer, nullable=False, default=1)
    force   = Column(Integer, nullable=False, default=1)
    defense = Column(Integer, nullable=False, default=1)
    vie     = Column(Integer, nullable=False, default=1)
    magie   = Column(Integer, nullable=False, default=1)

    points_disponibles = Column(Integer, nullable=False, default=0)

    utilisateur = relationship("UserModel", back_populates="competences")
