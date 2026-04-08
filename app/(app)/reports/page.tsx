"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
;
type Scores = {
  overall: number;
  confidence: number;
  communication: number;
  body: number;
  content: number;
};

type Interview = {
  id: string;
  title: string;
  date: string;
  role: string;
  mode: string;
  difficulty: string;
  scores?: Scores;
};

export default function ReportsPage() {
  const [data, setData] = useState<Interview[]>([]);
  const chartData = data
  .filter((i) => i.scores && typeof i.scores.overall === "number")
  .map((i) => ({
    date: i.date || "N/A",
    overall: i.scores?.overall ?? 0,
    confidence: i.scores?.confidence ?? 0,
    content: i.scores?.content ?? 0,
  }));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchAll = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:8000/interviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      setData(json || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return <div className="text-gray-400">Loading interviews...</div>;
  }

  if (!data.length) {
    return <div className="text-gray-400">No interviews found.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Interview History</h1>
{chartData.length > 0 && (
  <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
    <h2 className="font-semibold mb-4">Performance Trend</h2>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="overall" stroke="#3b82f6" strokeWidth={2} />
          <Line type="monotone" dataKey="confidence" stroke="#22c55e" strokeWidth={2} />
          <Line type="monotone" dataKey="content" stroke="#f59e0b" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
)}
      <div className="space-y-3">
        {data.map((i) => (
          <Link
            key={i.id}
            href={`/results?id=${i.id}`}
            className="block bg-white/5 border border-white/10 rounded-xl p-4 hover:border-blue-500/50 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{i.title || "Mock Interview"}</div>
                <div className="text-sm text-gray-400">
                  {i.date} · {i.role} · {i.difficulty}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-400">Overall</div>
                <div className="text-2xl font-bold text-blue-400">
                  {i.scores?.overall ?? "-"}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}