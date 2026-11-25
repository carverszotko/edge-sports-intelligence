"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any>(null);
  const [loggedGames, setLoggedGames] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    // Load existing paper bets first
    try {
      const betsRes = await fetch("http://127.0.0.1:8000/api/paper-bets");
      const bets = await betsRes.json();
      const games = new Set<string>();
      if (Array.isArray(bets)) {
        bets.forEach((b: any) => {
          if (b.game) games.add(b.game);
        });
      }
      setLoggedGames(games);
    } catch (e) {
      // ignore
    }

    const matchups = [
      { home: "Alabama", away: "Georgia", odds: -150 },
      { home: "Ohio State", away: "Michigan", odds: -200 },
      { home: "Texas", away: "Oklahoma", odds: -130 },
      { home: "Oregon", away: "Washington", odds: -140 },
      { home: "Penn State", away: "Ohio State", odds: 120 },
      { home: "Notre Dame", away: "USC", odds: -110 },
      { home: "LSU", away: "Alabama", odds: 160 },
      { home: "Florida", away: "Georgia", odds: 180 },
      { home: "Clemson", away: "Florida State", odds: -120 },
      { home: "Miami", away: "Florida", odds: -110 },
    ];

    const results = [];
    for (const m of matchups) {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/value?home_team=${m.home}&away_team=${m.away}&odds=${m.odds}&year=2026`
        );
        const data = await res.json();
        if (data.status === "VALUE") {
          const gameName = `${m.away} @ ${m.home}`;
          results.push({
            gameName,
            matchup: gameName,
            bet: `${m.home} Moneyline`,
            odds: m.odds,
            home_team: m.home,
            away_team: m.away,
            ...data,
          });
        }
      } catch (e) {
        // skip
      }
    }
    setOpportunities(results);

    try {
      const perf = await fetch("http://127.0.0.1:8000/api/performance");
      setPerformance(await perf.json());
    } catch (e) {
      // ignore
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const logPaperBet = async (opp: any) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/paper-bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          home_team: opp.home_team,
          away_team: opp.away_team,
          bet_type: "moneyline",
          selection: opp.home_team,
          odds: opp.odds,
          stake: 20,
          estimated_probability: opp.estimated_probability,
          edge: opp.edge,
        }),
      });
      if (res.ok) {
        setMessage(`Logged: ${opp.matchup}`);
        loadData();
      } else {
        setMessage("Failed to log bet");
      }
    } catch (e) {
      setMessage("Error logging bet");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">EDGE Sports Intelligence</h1>
        <p className="text-sm text-gray-400">Value Opportunities — 2026 Season</p>
      </div>

      {message && <div className="text-sm text-green-400">{message}</div>}

      <section>
        <h2 className="text-lg font-semibold mb-3">Value Bets</h2>
        {loading ? (
          <p>Analyzing...</p>
        ) : opportunities.length === 0 ? (
          <p className="text-gray-500">No value bets found in the current sample.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {opportunities.map((opp: any) => {
              const isLogged = loggedGames.has(opp.gameName);
              return (
                <div key={opp.gameName} className="border border-green-600 bg-green-950/20 rounded p-4">
                  <div className="font-semibold">{opp.matchup}</div>
                  <div className="text-sm mt-1">
                    {opp.bet} ({opp.odds > 0 ? "+" : ""}{opp.odds})
                  </div>
                  <div className="text-sm mt-2">
                    Edge: <span className="text-green-400">{(opp.edge * 100).toFixed(1)}%</span>
                  </div>
                  <div className="text-sm">
                    Model: {(opp.estimated_probability * 100).toFixed(1)}%
                  </div>
                  <button
                    onClick={() => logPaperBet(opp)}
                    disabled={isLogged}
                    className={`mt-3 text-sm px-3 py-1 rounded ${
                      isLogged
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isLogged ? "Logged" : "Log as Paper Bet"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Paper Trading Performance</h2>
        {performance ? (
          <div className="border border-gray-700 rounded p-4 text-sm">
            <div>Total Bets: {performance.total_bets || 0}</div>
            <div>Win Rate: {performance.win_rate ? (performance.win_rate * 100).toFixed(1) + "%" : "—"}</div>
            <div>ROI: {performance.roi ? (performance.roi * 100).toFixed(1) + "%" : "—"}</div>
            <div className="text-xs text-gray-500 mt-2">{performance.notes}</div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No paper bets logged yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Labs</h2>
        <div className="grid gap-3 md:grid-cols-3 text-sm">
          <div className="border border-gray-700 rounded p-4">
            <div className="font-medium">Parlay Lab</div>
            <div className="text-gray-400 text-xs mt-1">Build and evaluate parlays</div>
          </div>
          <div className="border border-gray-700 rounded p-4">
            <div className="font-medium">Simulation Lab</div>
            <div className="text-gray-400 text-xs mt-1">Run Monte Carlo simulations</div>
          </div>
          <div className="border border-gray-700 rounded p-4">
            <div className="font-medium">Agent Center</div>
            <div className="text-gray-400 text-xs mt-1">View all agents</div>
          </div>
        </div>
      </section>

      <p className="text-xs text-gray-500">
        Paper trading only. Recommendations are model-based.
      </p>
    </div>
  );
}
