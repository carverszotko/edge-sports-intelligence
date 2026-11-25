from agents.quantitative.probability_model import estimate_probability
from agents.quantitative.expected_value import calculate_edge

def find_favorite_value(home_team: str, away_team: str, odds: int = -200, year: int = 2024, sport: str = "college_football"):
    """
    Favorite Value Finder.
    Looks specifically at favorites and compares market odds to independent probability.
    """
    prob = estimate_probability(home_team, away_team, year)
    if prob.get("status") != "BASELINE MODEL":
        return {**prob, "sport": sport}

    home_prob = prob["estimated_home_win_probability"]
    result = calculate_edge(odds, home_prob)
    result["agent"] = "Favorite Value Finder"
    result["sport"] = sport
    result["notes"] = "Analyzes favorites only. Never describes a favorite as guaranteed. Uses independent probability model."
    return result
