def american_to_implied(odds: int) -> float:
    """Convert American odds to implied probability"""
    if odds > 0:
        return 100 / (odds + 100)
    else:
        return abs(odds) / (abs(odds) + 100)

def calculate_edge(odds: int, estimated_probability: float = None):
    """
    Calculate expected value and edge.
    Requires an independent probability estimate.
    """
    if estimated_probability is None:
        return {
            "agent": "Expected Value & Edge Calculator",
            "status": "INSUFFICIENT DATA",
            "notes": "Requires an independent probability estimate. No edge calculated.",
            "source": "Pending probability input"
        }

    implied = american_to_implied(odds)
    edge = estimated_probability - implied
    fair_odds = int((estimated_probability / (1 - estimated_probability)) * -100) if estimated_probability > 0.5 else int((1 - estimated_probability) / estimated_probability * 100)

    status = "VALUE" if edge > 0.03 else "NO VALUE" if edge < -0.02 else "NEUTRAL"

    return {
        "agent": "Expected Value & Edge Calculator",
        "status": status,
        "american_odds": odds,
        "implied_probability": round(implied, 3),
        "estimated_probability": round(estimated_probability, 3),
        "edge": round(edge, 3),
        "fair_odds": fair_odds,
        "notes": "Edge calculated against independent probability model. Conservative threshold applied.",
        "source": "Deterministic calculation"
    }
