"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/interviews");
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