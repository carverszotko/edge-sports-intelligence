"use client";

import { useEffect, useState } from "react";

export default function Report() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("http://127.0.0.1:8000/api/report")
      .then(res => res.json())
      .then(data => {
        setReport(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Odds Report</h1>
      <p className="text-sm text-gray-400 mb-6">Latest findings from the Odds Monitor</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="border border-gray-700 rounded p-4">
          <div className="text-xs text-gray-500 mb-2">
            Updated: {report?.updated || "Never"}
          </div>
          <div className="whitespace-pre-wrap text-sm">
            {report?.content || "No report yet."}
          </div>
        </div>
      )}
    </div>
  );
}
