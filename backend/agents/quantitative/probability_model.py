import os
import requests
from dotenv import load_dotenv

load_dotenv()

def estimate_probability(home_team: str, away_team: str, year: int = 2024):
    api_key = os.getenv("CFBD_API_KEY")
    if not api_key:
        return {"error": "No CFBD API key"}

    headers = {"Authorization": f"Bearer {api_key}"}
    url = "https://api.collegefootballdata.com/games"
    params = {"year": year, "seasonType": "regular"}

    response = requests.get(url, headers=headers, params=params)
    if response.status_code != 200:
        return {"status": "INSUFFICIENT DATA", "estimated_probability": None}

    games = response.json()

    def team_averages(team):
        scored = []
        allowed = []
        for g in games:
            if not g.get("completed"):
                continue
            if g.get("homeTeam") == team:
                scored.append(g.get("homePoints") or 0)
                allowed.append(g.get("awayPoints") or 0)
            elif g.get("awayTeam") == team:
                scored.append(g.get("awayPoints") or 0)
                allowed.append(g.get("homePoints") or 0)
        if not scored:
            return None
        return {
            "points_for": sum(scored) / len(scored),
            "points_against": sum(allowed) / len(allowed),
            "games": len(scored)
        }

    home = team_averages(home_team)
    away = team_averages(away_team)

    if not home or not away:
        return {
            "agent": "Independent Probability Model",
            "status": "INSUFFICIENT DATA",
            "estimated_probability": None,
            "notes": "Not enough completed games found for one or both teams."
        }

    home_expected = (home["points_for"] + away["points_against"]) / 2
    away_expected = (away["points_for"] + home["points_against"]) / 2
    differential = home_expected - away_expected

    home_win_prob = 0.5 + (differential * 0.06)
    home_win_prob = max(0.05, min(0.95, home_win_prob))

    return {
        "agent": "Independent Probability Model",
        "home_team": home_team,
        "away_team": away_team,
        "status": "BASELINE MODEL",
        "estimated_home_win_probability": round(home_win_prob, 3),
        "estimated_away_win_probability": round(1 - home_win_prob, 3),
        "expected_home_points": round(home_expected, 1),
        "expected_away_points": round(away_expected, 1),
        "home_avg_points": round(home["points_for"], 1),
        "away_avg_points": round(away["points_for"], 1),
        "notes": "Baseline model using average points from completed games in CollegeFootballData.com. Does not use sportsbook odds.",
        "source": "CollegeFootballData.com games"
    }
