from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from datetime import datetime
from .database import Base

class PaperBet(Base):
    __tablename__ = "paper_bets"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    game = Column(String, index=True)
    selection = Column(String)
    odds = Column(Integer)
    stake = Column(Float)
    result = Column(String, nullable=True)  # Win, Loss, Push, or None
    profit = Column(Float, nullable=True)
    notes = Column(String, nullable=True)
    is_paper = Column(Boolean, default=True)

class GameAnalysis(Base):
    __tablename__ = "game_analyses"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    game_id = Column(String, index=True)
    home_team = Column(String)
    away_team = Column(String)
    status = Column(String)  # BET CANDIDATE, WATCH, PASS, INSUFFICIENT DATA
    estimated_probability = Column(Float, nullable=True)
    market_implied_probability = Column(Float, nullable=True)
    edge = Column(Float, nullable=True)
    notes = Column(String, nullable=True)
    