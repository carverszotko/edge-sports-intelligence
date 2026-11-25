def evaluate_parlay(legs: list, sport: str = "college_football"):
    """
    Parlay & Correlation Evaluator.
    Accepts a list of legs. Each leg should have odds and estimated_probability.
    Structured so sport-specific correlation rules can be added later.
    """
    if not legs or len(legs) < 2:
        return {
            "agent": "Parlay & Correlation Evaluator",
            "sport": sport,
            "status": "PASS",
            "notes": "Need at least 2 legs to evaluate a parlay."
        }

    combined_prob = 1.0
    combined_decimal = 1.0
    edges = []

    for leg in legs:
        odds = leg.get("odds", -110)
        est_prob = leg.get("estimated_probability")
        if est_prob is None:
            return {
                "agent": "Parlay & Correlation Evaluator",
                "sport": sport,
                "status": "INSUFFICIENT DATA",
                "notes": "All legs need an estimated probability."
            }

        # Decimal odds
        if odds > 0:
            decimal = (odds / 100) + 1
        else:
            decimal = (100 / abs(odds)) + 1

        combined_decimal *= decimal
        combined_prob *= est_prob
        edges.append(est_prob - (1 / decimal))

    avg_edge = sum(edges) / len(edges)
    status = "PARLAY CANDIDATE" if avg_edge > 0.02 else "NOT WORTH COMBINING"

    return {
        "agent": "Parlay & Correlation Evaluator",
        "sport": sport,
        "status": status,
        "legs": len(legs),
        "combined_probability": round(combined_prob, 4),
        "combined_decimal_odds": round(combined_decimal, 2),
        "average_edge": round(avg_edge, 3),
        "notes": "Assumes independence for now. Sport-specific correlation rules can be added later. Does not invent probabilities.",
        "source": "Deterministic calculation"
    }
