from agents.game_intelligence.statistics_analyst import analyze_statistics
from agents.game_intelligence.environment_analyst import analyze_environment
from agents.live_game.live_game_state import scan_live_games
from agents.live_game.comeback_hunter import analyze_comeback
from agents.market_intelligence.odds_scanner import scan_odds
from agents.market_intelligence.value_hunter import find_value
from agents.quantitative.probability_model import estimate_probability
from agents.quantitative.monte_carlo import run_simulation
from agents.quantitative.expected_value import calculate_edge
from agents.risk_quality.devils_advocate import challenge_opportunity
from agents.risk_quality.risk_manager import check_risk

def run_orchestrator(home_team: str, away_team: str, year: int = 2024):
    """
    Full Orchestrator — calls key agents from every group.
    """
    report = {
        "orchestrator": "EDGE Orchestrator",
        "game": f"{away_team} @ {home_team}",
        "year": year,
        "agents": {}
    }

    # Game Intelligence
    report["agents"]["statistics"] = analyze_statistics(home_team, away_team)
    report["agents"]["environment"] = analyze_environment(home_team, away_team)

    # Live Game
    report["agents"]["live_scanner"] = scan_live_games(year)
    report["agents"]["comeback"] = analyze_comeback(home_team, away_team)

    # Market Intelligence
    report["agents"]["odds"] = scan_odds()
    report["agents"]["value"] = find_value(home_team, away_team)

    # Quantitative
    report["agents"]["probability"] = estimate_probability(home_team, away_team, year)
    report["agents"]["monte_carlo"] = run_simulation(home_team, away_team)
    report["agents"]["expected_value"] = calculate_edge(0)

    # Risk & Quality
    report["agents"]["devils_advocate"] = challenge_opportunity(home_team, away_team)
    report["agents"]["risk"] = check_risk()

    report["summary"] = "Full orchestrator run complete. All major agent groups represented."
    return report
