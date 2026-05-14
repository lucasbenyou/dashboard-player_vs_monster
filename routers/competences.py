from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from services.auth import get_current_user_id
from services.competences import obtenir, ameliorer

router = APIRouter()


@router.get("/competences")
def get_competences(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    try:
        return obtenir(user_id, db)
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch("/competences/{stat}")
def ameliorer_stat(stat: str, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    try:
        return ameliorer(user_id, stat, db)
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
