"use client";

import { useEffect, useState } from "react";

export default function AgentCenter() {
  const [agents, setAgents] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/agents")
      .then(res => res.json())
      .then(data => {
        setAgents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Agent Center</h1>
      <p className="text-sm text-gray-400 mb-6">Specialized analysis system</p>

      {loading ? (
        <p>Loading...</p>
      ) : agents ? (
        <div className="space-y-4 max-w-lg">
          <div className="border border-gray-700 rounded p-4">
            <div className="text-sm text-gray-400">Active Agents</div>
            <div className="text-2xl font-semibold">{agents.total}</div>
          </div>
          <div className="border border-gray-700 rounded p-4 text-sm">
            <div className="font-medium mb-2">Status</div>
            <div>System operational</div>
            <div className="text-xs text-gray-500 mt-2">
              Multi-agent architecture with quantitative models, risk controls, and performance tracking.
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Could not load agent status.</p>
      )}
    </div>
  );
}
