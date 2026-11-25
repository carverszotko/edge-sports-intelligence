from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PaperBetCreate(BaseModel):
    game: str
    selection: str
    odds: int
    stake: float
    notes: Optional[str] = None

class PaperBetResponse(BaseModel):
    id: int
    created_at: datetime
    game: str
    selection: str
    odds: int
    stake: float
    result: Optional[str]
    profit: Optional[float]
    notes: Optional[str]
    is_paper: bool

    class Config:
        from_attributes = True
        