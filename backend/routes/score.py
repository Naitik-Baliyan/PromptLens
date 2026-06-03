from fastapi import APIRouter

router = APIRouter(prefix="/score", tags=["score"])

@router.post("/evaluate")
def evaluate_prompt():
    return {"status": "not implemented"}
