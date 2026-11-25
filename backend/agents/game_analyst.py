import os
import requests
from dotenv import load_dotenv

load_dotenv()

def analyze_game(home_team: str, away_team: str, year: int = 2024, week: int = None):
    """
    Simple Game Analyst agent.
    Pulls real game data and returns a clear summary.
    Does not invent probabilities or edges yet.
    """
    api_key = os.getenv("CFBD_API_KEY")
    if not api_key:
        return {"error": "No CFBD API key"}

    headers = {"Authorization": f"Bearer {api_key}"}
    url = "https://api.collegefootballdata.com/games"
    params = {"year": year, "seasonType": "regular", "team": home_team}
    if week:
        params["week"] = week

    response = requests.get(url, headers=headers, params=params)
    if response.status_code != 200:
        return {"error": "Failed to fetch game data"}

    games = response.json()
    target = None
    for g in games:
        if g.get("homeTeam") == home_team and g.get("awayTeam") == away_team:
            target = g
            break

    if not target:
        return {"error": f"Game not found: {away_team} @ {home_team}"}

    analysis = {
        "agent": "Game Analyst",
        "status": "BET CANDIDATE" if target.get("completed") else "WATCH",
        "game": f"{away_team} @ {home_team}",
        "date": target.get("startDate"),
        "week": target.get("week"),
        "venue": target.get("venue"),
        "home_points": target.get("homePoints"),
        "away_points": target.get("awayPoints"),
        "completed": target.get("completed", False),
        "notes": "Analysis based on real CollegeFootballData.com game record. No probability model applied yet.",
        "source": "CollegeFootballData.com"
    }
    return analysis
