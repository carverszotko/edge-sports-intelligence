"use client";

import { useEffect, useState } from "react";

export default function GameAnalysis() {
  const [games, setGames] = useState<any[]>([]);
  const [liveGames, setLiveGames] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const loadGames = async () => {
    try {
      const [gamesRes, liveRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/games?year=2026"),
        fetch("http://127.0.0.1:8000/api/live?year=2026"),
      ]);
      const gamesData = await gamesRes.json();
      const liveData = await liveRes.json();

      setGames((gamesData.games || []).filter((g: any) => g.home_team && g.away_team).slice(0, 40));
      setLiveGames(liveData.games || []);
    } catch (e) {
      // ignore
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGames();
    const interval = setInterval(loadGames, 30000);
    return () => clearInterval(interval);
  }, []);

  const analyzeGame = async (game: any) => {
    setSelected(game);
    setAnalyzing(true);
    setAnalysis(null);

    try {
      const [probRes, simRes, valueRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/probability?home_team=${encodeURIComponent(game.home_team)}&away_team=${encodeURIComponent(game.away_team)}&year=2026`),
        fetch(`http://127.0.0.1:8000/api/simulate?home_team=${encodeURIComponent(game.home_team)}&away_team=${encodeURIComponent(game.away_team)}`),
        fetch(`http://127.0.0.1:8000/api/value?home_team=${encodeURIComponent(game.home_team)}&away_team=${encodeURIComponent(game.away_team)}&odds=-110&year=2026`),
      ]);

      const probability = await probRes.json();
      const simulation = await simRes.json();
      const value = await valueRes.json();

      setAnalysis({ probability, simulation, value });
    } catch (e) {
      setAnalysis({ error: "Could not complete analysis" });
    }
    setAnalyzing(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Game Analysis</h1>
      <p className="text-sm text-gray-400 mb-6">Live games and model edges</p>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-green-400">Live Games</h2>
        {liveGames.length > 0 ? (
          <div className="space-y-2">
            {liveGames.map((game: any, i: number) => (
              <button
                key={i}
                onClick={() => analyzeGame(game)}
                className="w-full text-left border border-green-700 rounded p-3 text-sm hover:bg-green-950/30"
              >
                <div className="font-medium">{game.away_team} @ {game.home_team}</div>
                <div>
                  {game.away_points != null ? game.away_points : "—"} - {game.home_points != null ? game.home_points : "—"} • {game.status}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No live games right now.</p>
        )}
      </div>

      {loading ? (
        <p>Loading games...</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            <h2 className="text-sm font-semibold text-gray-400">All Games</h2>
            {games.map((game: any) => (
              <button
                key={game.id}
                onClick={() => analyzeGame(game)}
                className={`w-full text-left border rounded p-3 text-sm ${
                  selected?.id === game.id ? "border-blue-500" : "border-gray-700"
                }`}
              >
                <div className="font-medium">{game.away_team} @ {game.home_team}</div>
                <div className="text-xs text-gray-400">
                  Week {game.week || "—"} • {game.completed ? "Final" : "Scheduled"}
                </div>
              </button>
            ))}
          </div>

          <div>
            {analyzing && <p>Running analysis...</p>}
            {analysis && !analysis.error && (
              <div className="border border-gray-700 rounded p-5 space-y-3 text-sm">
                <div className="font-semibold text-lg">
                  {selected?.away_team} @ {selected?.home_team}
                </div>
                {selected?.home_points != null && (
                  <div>Score: {selected.away_points} - {selected.home_points}</div>
                )}

                {analysis.value?.edge != null && (
                  <div className={`p-3 rounded ${analysis.value.edge > 0.03 ? "bg-green-950/40 border border-green-700" : "bg-gray-800"}`}>
                    <div className="font-medium">
                      {analysis.value.status === "VALUE" ? "Edge Found" : "No Significant Edge"}
                    </div>
                    <div>Edge vs -110: {(analysis.value.edge * 100).toFixed(1)}%</div>
                    <div>
                      Model favors {selected?.home_team} at {(analysis.probability?.estimated_home_win_probability * 100 || 0).toFixed(1)}%
                    </div>
                  </div>
                )}

                <div>Simulation Win %: {(analysis.simulation?.home_win_probability * 100 || 0).toFixed(1)}%</div>
                {analysis.simulation?.average_margin != null && (
                  <div>Projected Margin: {analysis.simulation.average_margin}</div>
                )}
              </div>
            )}
            {analysis?.error && <p className="text-red-400">{analysis.error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
