"use client";

import { useEffect, useState } from "react";

export default function Performance() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/performance")
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Performance</h1>
      <p className="text-sm text-gray-400 mb-6">Paper trading results</p>

      {loading ? (
        <p>Loading...</p>
      ) : data ? (
        <div className="border border-gray-700 rounded p-6 space-y-3 text-sm max-w-md">
          <div className="flex justify-between">
            <span>Total Bets</span>
            <span>{data.total_bets || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Wins</span>
            <span>{data.wins || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Losses</span>
            <span>{data.losses || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Win Rate</span>
            <span>{data.win_rate ? (data.win_rate * 100).toFixed(1) + "%" : "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Staked</span>
            <span>${data.total_staked || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Profit</span>
            <span className={data.profit >= 0 ? "text-green-400" : "text-red-400"}>
              ${data.profit || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span>ROI</span>
            <span className={data.roi >= 0 ? "text-green-400" : "text-red-400"}>
              {data.roi ? (data.roi * 100).toFixed(1) + "%" : "—"}
            </span>
          </div>
          <p className="text-xs text-gray-500 pt-3">{data.notes}</p>
        </div>
      ) : (
        <p className="text-gray-500">No performance data available.</p>
      )}
    </div>
  );
}
