import os
import requests
from datetime import datetime, timedelta, timezone

def scan_live_games(year: int = 2026):
    api_key = os.getenv("CFBD_API_KEY")
    if not api_key:
        return {
            "agent": "Live Game Scanner",
            "year": year,
            "status": "NO API KEY",
            "games": [],
            "notes": "CFBD API key not configured."
        }

    headers = {"Authorization": f"Bearer {api_key}"}
    url = "https://api.collegefootballdata.com/games"
    params = {"year": year, "seasonType": "regular"}

    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        if response.status_code != 200:
            return {"agent": "Live Game Scanner", "year": year, "status": "ERROR", "games": []}

        games = response.json()
        live = []
        now = datetime.now(timezone.utc)

        for g in games:
            if not g.get("homeTeam") or not g.get("awayTeam"):
                continue
            if g.get("completed"):
                continue

            start = g.get("startDate")
            if not start:
                continue

            try:
                start_dt = datetime.fromisoformat(start.replace("Z", "+00:00"))
            except:
                continue

            # Games that started in the last 5 hours
            if now - timedelta(hours=5) <= start_dt <= now + timedelta(minutes=30):
                live.append({
                    "id": g.get("id"),
                    "home_team": g.get("homeTeam"),
                    "away_team": g.get("awayTeam"),
                    "home_points": g.get("homePoints"),
                    "away_points": g.get("awayPoints"),
                    "status": "Live" if g.get("homePoints") is not None else "Starting",
                    "start_date": start,
                    "week": g.get("week"),
                    "venue": g.get("venue")
                })

        return {
            "agent": "Live Game Scanner",
            "year": year,
            "status": "SCAN COMPLETE",
            "count": len(live),
            "games": live,
            "notes": "Currently in-progress games."
        }
    except Exception as e:
        return {"agent": "Live Game Scanner", "year": year, "status": "ERROR", "games": [], "notes": str(e)}
    