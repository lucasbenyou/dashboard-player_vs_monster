from fastapi import APIRouter, Depends

from services.auth import get_current_user_id
from services.ia import DevinageRequest, deviner

router = APIRouter()


@router.post("/deviner-categorie")
def deviner_categorie(_: int = Depends(get_current_user_id), body: DevinageRequest = ...):
    categorie = deviner(body.titre, body.description)
    return {"categorie": categorie}
