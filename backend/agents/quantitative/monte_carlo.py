import random
from agents.quantitative.probability_model import estimate_probability

def run_simulation(home_team: str, away_team: str, simulations: int = 10000):
    """
    Improved Monte Carlo simulation.
    - Uses baseline expected points
    - Adds home-field advantage
    - Uses more realistic variance
    - Tracks score distributions
    """
    base = estimate_probability(home_team, away_team)
    if base.get("status") != "BASELINE MODEL":
        return base

    # Add modest home-field advantage (~2.5 points)
    home_exp = base["expected_home_points"] + 2.5
    away_exp = base["expected_away_points"]

    home_wins = 0
    away_wins = 0
    ties = 0
    home_scores = []
    away_scores = []
    margins = []

    for _ in range(simulations):
        # More realistic variance (college football scoring is volatile)
        home_score = max(0, int(random.gauss(home_exp, 11.5)))
        away_score = max(0, int(random.gauss(away_exp, 11.5)))

        home_scores.append(home_score)
        away_scores.append(away_score)
        margins.append(home_score - away_score)

        if home_score > away_score:
            home_wins += 1
        elif away_score > home_score:
            away_wins += 1
        else:
            ties += 1

    # Simple distribution insights
    avg_margin = sum(margins) / simulations
    close_games = sum(1 for m in margins if abs(m) <= 7) / simulations

    return {
        "agent": "Monte Carlo Simulation Engine",
        "home_team": home_team,
        "away_team": away_team,
        "simulations": simulations,
        "status": "SIMULATION COMPLETE",
        "home_win_probability": round(home_wins / simulations, 3),
        "away_win_probability": round(away_wins / simulations, 3),
        "tie_probability": round(ties / simulations, 3),
        "average_home_score": round(sum(home_scores) / simulations, 1),
        "average_away_score": round(sum(away_scores) / simulations, 1),
        "average_margin": round(avg_margin, 1),
        "close_game_probability": round(close_games, 3),
        "home_field_advantage_applied": 2.5,
        "notes": "Improved Monte Carlo with home-field advantage and realistic variance. Baseline model only — not production-grade.",
        "source": "Baseline probability model + enhanced simulation"
    }
