from fastapi import APIRouter

router = APIRouter(prefix="/autopsy", tags=["autopsy"])

@router.post("/analyze")
def analyze_prompt():
    return {"status": "not implemented"}
