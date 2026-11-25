import os
import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from .database import get_db
from . import models, schemas
from agents.game_analyst import analyze_game
from agents.orchestrator import run_orchestrator
from agents.quantitative.monte_carlo import run_simulation
from agents.quantitative.probability_model import estimate_probability
from agents.quantitative.expected_value import calculate_edge
from agents.quantitative.parlay_evaluator import evaluate_parlay
from agents.live_game.live_game_state import scan_live_games
from agents.game_intelligence.statistics_analyst import analyze_statistics
from agents.game_intelligence.environment_analyst import analyze_environment
from agents.game_intelligence.tactical_analyst import analyze_tactics
from agents.market_intelligence.odds_scanner import scan_odds
from agents.market_intelligence.value_hunter import find_value
from agents.market_intelligence.favorite_finder import find_favorite_value
from agents.market_intelligence.props_analyst import analyze_prop
from agents.risk_quality.devils_advocate import challenge_opportunity
from agents.risk_quality.risk_manager import check_risk
from agents.risk_quality.performance_analyst import analyze_performance

router = APIRouter()

# Simple in-memory store for the latest report
latest_report = {"updated": None, "content": "No report yet."}

@router.get("/paper-bets", response_model=List[schemas.PaperBetResponse])
def get_paper_bets(db: Session = Depends(get_db)):
    return db.query(models.PaperBet).order_by(models.PaperBet.created_at.desc()).all()

@router.post("/paper-bets")
def create_paper_bet(bet: dict, db: Session = Depends(get_db)):
    risk = check_risk(stake=bet.get("stake", 0))
    if risk["status"] == "REJECTED":
        raise HTTPException(status_code=400, detail="Stake exceeds risk limits")

    game_name = f"{bet.get('away_team', '')} @ {bet.get('home_team', '')}"
    db_bet = models.PaperBet(
        game=game_name,
        selection=bet.get("selection") or bet.get("home_team"),
        odds=bet.get("odds"),
        stake=bet.get("stake", 20),
        notes=f"Edge: {bet.get('edge')}, Prob: {bet.get('estimated_probability')}",
        is_paper=True,
    )
    db.add(db_bet)
    db.commit()
    db.refresh(db_bet)
    return {"status": "logged", "id": db_bet.id}

@router.get("/paper-bets/{bet_id}", response_model=schemas.PaperBetResponse)
def get_paper_bet(bet_id: int, db: Session = Depends(get_db)):
    bet = db.query(models.PaperBet).filter(models.PaperBet.id == bet_id).first()
    if not bet:
        raise HTTPException(status_code=404, detail="Paper bet not found")
    return bet

@router.post("/report")
def post_report(data: dict):
    """Receive a report from the Odds Monitor bot or other sources"""
    global latest_report
    latest_report = {
        "updated": datetime.utcnow().isoformat(),
        "content": data.get("content", ""),
        "source": data.get("source", "unknown")
    }
    return {"status": "received"}

@router.get("/report")
def get_report():
    """Get the latest report"""
    return latest_report

@router.get("/games")
def get_games(year: int = 2026, week: Optional[int] = None, sport: str = "college_football"):
    api_key = os.getenv("CFBD_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="CFBD API key not configured")

    headers = {"Authorization": f"Bearer {api_key}"}
    url = "https://api.collegefootballdata.com/games"
    params = {"year": year, "seasonType": "regular"}
    if week:
        params["week"] = week

    response = requests.get(url, headers=headers, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch games from CFBD")

    games = response.json()
    cleaned = []
    for g in games:
        if g.get("homeTeam") and g.get("awayTeam"):
            cleaned.append({
                "id": g.get("id"),
                "home_team": g.get("homeTeam"),
                "away_team": g.get("awayTeam"),
                "start_date": g.get("startDate"),
                "week": g.get("week"),
                "season": g.get("season"),
                "venue": g.get("venue"),
                "home_points": g.get("homePoints"),
                "away_points": g.get("awayPoints"),
                "completed": g.get("completed", False),
                "sport": sport
            })

    return {
        "source": "CollegeFootballData.com",
        "sport": sport,
        "year": year,
        "week": week,
        "count": len(cleaned),
        "games": cleaned
    }

@router.get("/weather")
def get_weather(lat: float = 40.0, lon: float = -75.0):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,wind_speed_10m,precipitation,weather_code",
        "hourly": "temperature_2m,precipitation_probability,wind_speed_10m",
        "forecast_days": 1
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Weather fetch failed")
    return {"source": "Open-Meteo", "data": response.json()}

@router.get("/odds")
def get_odds(sport: str = "college_football"):
    api_key = os.getenv("THERUNDOWN_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="TheRundown API key not configured")

    date = (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d")
    headers = {"X-TheRundown-Key": api_key}
    url = f"https://therundown.io/api/v2/sports/1/events/{date}"
    params = {"market_ids": "1"}

    response = requests.get(url, headers=headers, params=params)
    if response.status_code != 200:
        return {
            "source": "TheRundown",
            "sport": sport,
            "status": "limited",
            "note": "Free tier restricted. No current odds available.",
            "events": []
        }

    data = response.json()
    events = []
    for event in data.get("events", [])[:20]:
        teams = event.get("teams_normalized", [])
        home = teams[0].get("name", "Home") if teams else "Home"
        away = teams[1].get("name", "Away") if len(teams) > 1 else "Away"
        events.append({
            "event_id": event.get("event_id"),
            "home_team": home,
            "away_team": away,
            "start_time": event.get("event_date"),
            "moneyline": event.get("markets", {}).get("1", {})
        })

    return {
        "source": "TheRundown",
        "sport": sport,
        "date": date,
        "count": len(events),
        "events": events,
        "note": "Free tier — last 7 days only"
    }

@router.get("/analyze")
def analyze(home_team: str, away_team: str, year: int = 2026, week: Optional[int] = None, sport: str = "college_football"):
    result = analyze_game(home_team, away_team, year, week)
    result["sport"] = sport
    return result

@router.get("/orchestrate")
def orchestrate(home_team: str, away_team: str, year: int = 2026, sport: str = "college_football"):
    result = run_orchestrator(home_team, away_team, year)
    result["sport"] = sport
    return result

@router.get("/agents")
def list_agents():
    return {
        "total": 21,
        "status": "operational",
        "note": "Specialized analysis system active."
    }

@router.get("/simulate")
def simulate(home_team: str, away_team: str, simulations: int = 10000, sport: str = "college_football"):
    result = run_simulation(home_team, away_team, simulations)
    result["sport"] = sport
    return result

@router.get("/probability")
def probability(home_team: str, away_team: str, year: int = 2026, sport: str = "college_football"):
    result = estimate_probability(home_team, away_team, year)
    result["sport"] = sport
    return result

@router.get("/value")
def value_bet(home_team: str, away_team: str, odds: int = -110, year: int = 2026, sport: str = "college_football"):
    prob_result = estimate_probability(home_team, away_team, year)
    if prob_result.get("status") != "BASELINE MODEL":
        return prob_result
    home_prob = prob_result["estimated_home_win_probability"]
    result = calculate_edge(odds, home_prob)
    result["sport"] = sport
    return result

@router.get("/favorite")
def favorite(home_team: str, away_team: str, odds: int = -200, year: int = 2026, sport: str = "college_football"):
    return find_favorite_value(home_team, away_team, odds, year, sport)

@router.get("/prop")
def prop(player: str, prop_type: str, line: float, odds: int = -110, sport: str = "college_football"):
    return analyze_prop(player, prop_type, line, odds, sport)

@router.get("/parlay")
def parlay(sport: str = "college_football"):
    example_legs = [
        {"odds": -150, "estimated_probability": 0.66},
        {"odds": -110, "estimated_probability": 0.55}
    ]
    return evaluate_parlay(example_legs, sport)

@router.get("/performance")
def performance(sport: str = "college_football", db: Session = Depends(get_db)):
    bets = db.query(models.PaperBet).all()
    return analyze_performance(bets, sport)

@router.get("/health/models")
def health_models():
    prob = estimate_probability("Alabama", "Georgia")
    sim = run_simulation("Alabama", "Georgia", 100)
    return {
        "probability_model": "ok" if prob.get("status") == "BASELINE MODEL" else "issue",
        "monte_carlo": "ok" if sim.get("status") == "SIMULATION COMPLETE" else "issue",
        "status": "healthy"
    }

@router.get("/live")
def live_scanner(year: int = 2026, sport: str = "college_football"):
    result = scan_live_games(year)
    result["sport"] = sport
    return result

@router.get("/status")
def system_status():
    return {
        "status": "online",
        "mode": "reporting",
        "sport": "college_football",
        "data_sources": ["CollegeFootballData.com", "Open-Meteo", "TheRundown"],
        "models": "baseline + monte_carlo",
        "agents": 21,
        "orchestrator": "active"
    }

@router.get("/agent/{agent_name}")
def run_single_agent(agent_name: str, home_team: str = "Alabama", away_team: str = "Georgia"):
    agents_map = {
        "statistics": analyze_statistics,
        "environment": analyze_environment,
        "tactical": analyze_tactics,
        "odds": scan_odds,
        "value": find_value,
        "devils_advocate": challenge_opportunity,
        "risk": check_risk,
        "probability": estimate_probability,
        "simulate": run_simulation,
    }
    if agent_name not in agents_map:
        raise HTTPException(status_code=404, detail="Agent not found")
    func = agents_map[agent_name]
    if agent_name in ["odds", "risk"]:
        return func()
    return func(home_team, away_team)
