def analyze_performance(paper_bets: list = None, sport: str = "college_football"):
    """
    Performance & Learning Analyst.
    Tracks ROI, win rate, and basic calibration.
    Suggests improvements but never changes models or risk rules.
    """
    if not paper_bets:
        return {
            "agent": "Performance & Learning Analyst",
            "sport": sport,
            "status": "INSUFFICIENT DATA",
            "total_bets": 0,
            "notes": "No paper bets logged yet. Ready to track ROI, win rate, calibration, and drawdown.",
            "source": "Paper betting records"
        }

    total = len(paper_bets)
    wins = sum(1 for b in paper_bets if getattr(b, "result", None) == "win")
    losses = sum(1 for b in paper_bets if getattr(b, "result", None) == "loss")
    pushes = total - wins - losses

    stake_total = sum(getattr(b, "stake", 0) for b in paper_bets)
    profit = sum(getattr(b, "profit", 0) for b in paper_bets)
    roi = (profit / stake_total) if stake_total > 0 else 0
    win_rate = wins / total if total > 0 else 0

    return {
        "agent": "Performance & Learning Analyst",
        "sport": sport,
        "status": "ANALYSIS COMPLETE",
        "total_bets": total,
        "wins": wins,
        "losses": losses,
        "pushes": pushes,
        "win_rate": round(win_rate, 3),
        "total_staked": round(stake_total, 2),
        "profit": round(profit, 2),
        "roi": round(roi, 3),
        "notes": "Performance review complete. Suggestions only — does not modify models or risk settings.",
        "source": "Paper betting records"
    }
