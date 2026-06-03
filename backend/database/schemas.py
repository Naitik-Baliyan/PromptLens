from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PromptTemplateBase(BaseModel):
    name: str
    content: str

class PromptTemplateCreate(PromptTemplateBase):
    pass

class PromptTemplate(PromptTemplateBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
