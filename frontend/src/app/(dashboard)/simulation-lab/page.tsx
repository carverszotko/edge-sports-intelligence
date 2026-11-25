"use client";

import { useState } from "react";

const teams = [
  "Alabama", "Arizona", "Arizona State", "Arkansas", "Auburn",
  "Baylor", "Boston College", "BYU", "California", "Clemson",
  "Colorado", "Duke", "Florida", "Florida State", "Georgia",
  "Georgia Tech", "Illinois", "Indiana", "Iowa", "Iowa State",
  "Kansas", "Kansas State", "Kentucky", "LSU", "Louisville",
  "Maryland", "Miami", "Michigan", "Michigan State", "Minnesota",
  "Mississippi State", "Missouri", "Nebraska", "North Carolina",
  "NC State", "Northwestern", "Notre Dame", "Ohio State", "Oklahoma",
  "Oklahoma State", "Ole Miss", "Oregon", "Oregon State", "Penn State",
  "Pittsburgh", "Purdue", "Rutgers", "South Carolina", "Stanford",
  "Syracuse", "TCU", "Tennessee", "Texas", "Texas A&M",
  "Texas Tech", "UCLA", "USC", "Utah", "Vanderbilt",
  "Virginia", "Virginia Tech", "Wake Forest", "Washington",
  "Washington State", "West Virginia", "Wisconsin"
].sort();

const weatherOptions = [
  { label: "Clear", value: "clear", adjustment: 0 },
  { label: "Rain", value: "rain", adjustment: -2.5 },
  { label: "Cold", value: "cold", adjustment: -1.5 },
  { label: "Windy", value: "windy", adjustment: -1.0 },
  { label: "Rain + Wind", value: "rain_wind", adjustment: -3.5 },
  { label: "Cold + Wind", value: "cold_wind", adjustment: -2.5 },
];

export default function SimulationLab() {
  const [home, setHome] = useState("Alabama");
  const [away, setAway] = useState("Georgia");
  const [homeSearch, setHomeSearch] = useState("Alabama");
  const [awaySearch, setAwaySearch] = useState("Georgia");
  const [showHome, setShowHome] = useState(false);
  const [showAway, setShowAway] = useState(false);
  const [weather, setWeather] = useState("clear");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const filteredHome = teams.filter(t => t.toLowerCase().includes(homeSearch.toLowerCase()));
  const filteredAway = teams.filter(t => t.toLowerCase().includes(awaySearch.toLowerCase()));

  const selectHome = (team: string) => {
    setHome(team);
    setHomeSearch(team);
    setShowHome(false);
  };

  const selectAway = (team: string) => {
    setAway(team);
    setAwaySearch(team);
    setShowAway(false);
  };

  const runSim = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/simulate?home_team=${home}&away_team=${away}&simulations=10000`
      );
      const data = await res.json();

      // Apply simple weather adjustment to expected scores
      const adj = weatherOptions.find(w => w.value === weather)?.adjustment || 0;
      if (data.average_home_score) {
        data.average_home_score = Math.max(0, data.average_home_score + adj);
        data.average_away_score = Math.max(0, data.average_away_score + adj);
      }
      data.weather = weather;
      setResult(data);
    } catch (e) {
      setResult({ error: "Failed to run simulation" });
    }
    setLoading(false);
  };

  const homeWinPct = result?.home_win_probability ? result.home_win_probability * 100 : 0;
  const awayWinPct = result?.away_win_probability ? result.away_win_probability * 100 : 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Simulation Lab</h1>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <label className="text-sm text-gray-400">Home Team</label>
          <input
            value={homeSearch}
            onChange={(e) => { setHomeSearch(e.target.value); setShowHome(true); }}
            onFocus={() => setShowHome(true)}
            placeholder="Search teams..."
            className="w-full border border-gray-600 bg-gray-800 p-2 rounded mt-1"
          />
          {showHome && (
            <div className="absolute z-10 w-full bg-gray-900 border border-gray-700 rounded mt-1 max-h-48 overflow-y-auto">
              {filteredHome.map(t => (
                <div key={t} onClick={() => selectHome(t)} className="p-2 hover:bg-gray-700 cursor-pointer text-sm">
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="text-sm text-gray-400">Away Team</label>
          <input
            value={awaySearch}
            onChange={(e) => { setAwaySearch(e.target.value); setShowAway(true); }}
            onFocus={() => setShowAway(true)}
            placeholder="Search teams..."
            className="w-full border border-gray-600 bg-gray-800 p-2 rounded mt-1"
          />
          {showAway && (
            <div className="absolute z-10 w-full bg-gray-900 border border-gray-700 rounded mt-1 max-h-48 overflow-y-auto">
              {filteredAway.map(t => (
                <div key={t} onClick={() => selectAway(t)} className="p-2 hover:bg-gray-700 cursor-pointer text-sm">
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm text-gray-400">Weather</label>
        <select
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
          className="w-full border border-gray-600 bg-gray-800 p-2 rounded mt-1"
        >
          {weatherOptions.map(w => (
            <option key={w.value} value={w.value}>{w.label}</option>
          ))}
        </select>
      </div>

      <button
        onClick={runSim}
        disabled={loading}
        className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50 mb-6"
      >
        {loading ? "Running..." : "Run Simulation"}
      </button>

      {result && !result.error && (
        <div className="border border-gray-700 rounded p-4">
          <div className="text-sm text-gray-400 mb-2">Weather: {result.weather}</div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{home}</span>
              <span>{away}</span>
            </div>
            <div className="h-6 bg-gray-800 rounded overflow-hidden flex">
              <div className="bg-blue-500 h-full" style={{ width: `${homeWinPct}%` }} />
              <div className="bg-red-500 h-full" style={{ width: `${awayWinPct}%` }} />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>{homeWinPct.toFixed(1)}%</span>
              <span>{awayWinPct.toFixed(1)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Avg Home Score: {result.average_home_score?.toFixed(1)}</div>
            <div>Avg Away Score: {result.average_away_score?.toFixed(1)}</div>
            <div>Avg Margin: {result.average_margin}</div>
            <div>Close Games: {(result.close_game_probability * 100).toFixed(1)}%</div>
          </div>
          <div className="text-xs text-gray-500 mt-3">{result.notes}</div>
        </div>
      )}

      {result?.error && <p className="text-red-400">{result.error}</p>}
    </div>
  );
}
