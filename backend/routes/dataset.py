from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/dataset", tags=["dataset"])

@router.post("/upload")
def upload_dataset():
    # TODO: Implement bulk dataset testing (see roadmap)
    raise HTTPException(status_code=501, detail="Bulk dataset testing is not yet implemented.")
