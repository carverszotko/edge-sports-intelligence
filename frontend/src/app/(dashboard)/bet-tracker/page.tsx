"use client";

import { useEffect, useState } from "react";

export default function BetTracker() {
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/paper-bets")
      .then(res => res.json())
      .then(data => {
        setBets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bet Tracker</h1>
      <p className="text-sm text-gray-400 mb-6">Paper trading history</p>

      {loading ? (
        <p>Loading...</p>
      ) : bets.length === 0 ? (
        <p className="text-gray-500">No paper bets logged yet.</p>
      ) : (
        <div className="space-y-3">
          {bets.map((bet: any) => (
            <div key={bet.id} className="border border-gray-700 rounded p-4 text-sm">
              <div className="font-medium">{bet.game}</div>
              <div className="text-gray-300">
                {bet.selection} @ {bet.odds > 0 ? "+" : ""}{bet.odds}
              </div>
              <div className="text-gray-400">Stake: ${bet.stake}</div>
              {bet.result && <div>Result: {bet.result}</div>}
              {bet.notes && <div className="text-xs text-gray-500 mt-1">{bet.notes}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}