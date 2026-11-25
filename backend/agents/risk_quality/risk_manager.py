def check_risk(stake: float = 0, bankroll: float = 1000, sport: str = "college_football"):
    """
    Bankroll & Risk Manager.
    Enforces conservative deterministic rules.
    AI agents cannot override these.
    """
    max_stake_pct = 0.02  # 2% max per bet
    max_daily_pct = 0.05  # 5% max daily exposure
    recommended = round(bankroll * max_stake_pct, 2)

    approved = stake <= recommended and stake > 0
    status = "APPROVED" if approved else "REJECTED" if stake > recommended else "NO STAKE"

    return {
        "agent": "Bankroll & Risk Manager",
        "sport": sport,
        "status": status,
        "bankroll": bankroll,
        "requested_stake": stake,
        "recommended_stake": recommended,
        "max_stake_percent": max_stake_pct,
        "max_daily_percent": max_daily_pct,
        "notes": "Conservative fixed-fractional rules. AI cannot override. Paper trading only.",
        "source": "Deterministic risk rules"
    }
