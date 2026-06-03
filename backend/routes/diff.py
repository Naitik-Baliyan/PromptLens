from fastapi import APIRouter

router = APIRouter(prefix="/diff", tags=["diff"])

@router.post("/compare")
def compare_prompts():
    return {"status": "not implemented"}
