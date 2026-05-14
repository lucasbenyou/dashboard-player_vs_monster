from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from services.auth import get_current_user_id
from services.taches import TacheCreate, TacheService

router = APIRouter()
service = TacheService()


@router.get("/taches")
def lister_taches(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return service.lister(db, user_id)


@router.post("/taches")
def ajouter_tache(tache: TacheCreate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    try:
        return service.ajouter(tache, db, user_id)
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/taches/{tache_id}/terminer")
def terminer_tache(tache_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    try:
        return service.terminer(tache_id, db, user_id)
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/taches/{tache_id}")
def supprimer_tache(tache_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    try:
        if not service.supprimer(tache_id, db, user_id):
            raise HTTPException(status_code=404, detail="Tâche introuvable")
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    return {"message": "Tâche supprimée"}
