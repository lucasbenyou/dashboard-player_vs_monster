from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class CategorieModel(Base):
    __tablename__ = "categories_progression"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("utilisateurs.id"), nullable=False)
    type_effort = Column(String, nullable=False)  # physique | mental
    taches_completees = Column(Integer, nullable=False, default=0)

    utilisateur = relationship("UserModel", back_populates="categories")
