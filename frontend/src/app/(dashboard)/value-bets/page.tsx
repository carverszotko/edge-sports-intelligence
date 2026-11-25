"use client";

import { useEffect, useState } from "react";

export default function ValueBets() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    const load = async () => {
      const results = [];
      for (const m of matchups) {
        try {
          const res = await fetch(
            `http://127.0.0.1:8000/api/value?home_team=${m.home}&away_team=${m.away}&odds=${m.odds}&year=2026`
          );
          const data = await res.json();
          if (data.status === "VALUE") {
            results.push({
              matchup: `${m.away} @ ${m.home}`,
              bet: `${m.home} Moneyline`,
              odds: m.odds,
              ...data,
            });
          }
        } catch (e) {
          // skip
        }
      }
      setOpportunities(results);
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Value Bets</h1>
      <p className="text-sm text-gray-400 mb-6">Model-identified edges</p>

      {loading ? (
        <p>Analyzing...</p>
      ) : opportunities.length === 0 ? (
        <p className="text-gray-500">No value bets found in the current sample.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {opportunities.map((opp: any, i: number) => (
            <div key={i} className="border border-green-600 bg-green-950/20 rounded p-4">
              <div className="font-semibold">{opp.matchup}</div>
              <div className="text-sm mt-1">
                {opp.bet} ({opp.odds > 0 ? "+" : ""}{opp.odds})
              </div>
              <div className="text-sm mt-2">
                Edge: <span className="text-green-400">{(opp.edge * 100).toFixed(1)}%</span>
              </div>
              <div className="text-sm">
                Model Probability: {(opp.estimated_probability * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 mt-2">{opp.notes}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
