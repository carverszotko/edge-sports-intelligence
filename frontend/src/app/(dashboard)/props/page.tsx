"use client";

import { useState } from "react";

export default function Props() {
  const [player, setPlayer] = useState("");
  const [propType, setPropType] = useState("passing_yards");
  const [line, setLine] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!player || !line) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/prop?player=${encodeURIComponent(player)}&prop_type=${propType}&line=${line}`
      );
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: "Failed to analyze prop" });
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Props</h1>
      <p className="text-sm text-gray-400 mb-6">Player and game prop analysis</p>

      <div className="space-y-3 max-w-md mb-6">
        <input
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
          placeholder="Player name"
          className="w-full border border-gray-600 bg-gray-800 p-2 rounded"
        />
        <select
          value={propType}
          onChange={(e) => setPropType(e.target.value)}
          className="w-full border border-gray-600 bg-gray-800 p-2 rounded"
        >
          <option value="passing_yards">Passing Yards</option>
          <option value="rushing_yards">Rushing Yards</option>
          <option value="receiving_yards">Receiving Yards</option>
          <option value="receptions">Receptions</option>
          <option value="touchdowns">Touchdowns</option>
        </select>
        <input
          type="number"
          value={line}
          onChange={(e) => setLine(e.target.value)}
          placeholder="Line"
          className="w-full border border-gray-600 bg-gray-800 p-2 rounded"
        />
        <button
          onClick={analyze}
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Prop"}
        </button>
      </div>

      {result && !result.error && (
        <div className="border border-gray-700 rounded p-4 text-sm max-w-md">
          <div className="font-medium">{result.player}</div>
          <div>{result.prop_type} — {result.line}</div>
          <div className="mt-2">Status: {result.status}</div>
          <div className="text-xs text-gray-500 mt-2">{result.notes}</div>
        </div>
      )}

      {result?.error && <p className="text-red-400">{result.error}</p>}
    </div>
  );
}
