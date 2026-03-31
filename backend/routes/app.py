from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()

@router.get("/data")
def get0data(json: dict):
    return {"message": f"You sent: {json}"}
    