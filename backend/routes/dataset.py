from fastapi import APIRouter

router = APIRouter(prefix="/dataset", tags=["dataset"])

@router.post("/upload")
def upload_dataset():
    return {"status": "not implemented"}
