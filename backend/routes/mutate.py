from fastapi import APIRouter

router = APIRouter(prefix="/mutate", tags=["mutate"])

@router.post("/generate")
def generate_variants():
    return {"status": "not implemented"}
