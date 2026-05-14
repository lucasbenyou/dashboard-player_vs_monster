from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from services.auth import get_current_user_id
from services.categories import infos

router = APIRouter()


@router.get("/categories")
def get_categories(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return infos(user_id, db)
