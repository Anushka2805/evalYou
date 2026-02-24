"use client";
import { useEffect, useMemo, useState } from "react";
import StatCard from "@/components/StatCard";
import { TrendingUp, Mic, MessageCircle, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
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

export default function Dashboard() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
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
        setInterviews(Array.isArray(json) ? json : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const valid = useMemo(
    () => interviews.filter((i) => i.scores && typeof i.scores.overall === "number"),
    [interviews]
  );

  const latest = valid[0];

  const avg = (key: keyof Scores) => {
    if (!valid.length) return 0;
    const sum = valid.reduce((a, b) => a + (b.scores?.[key] ?? 0), 0);
    return Math.round(sum / valid.length);
  };

  const confidenceData = valid
    .slice()
    .reverse()
    .map((i, idx) => ({
      name: `I${idx + 1}`,
      value: i.scores?.confidence ?? 0,
    }));

  const fillerData = valid.map((i, idx) => ({
    name: `I${idx + 1}`,
    fillers: Math.max(0, 15 - Math.floor((i.scores?.confidence ?? 0) / 7)),
  }));

  if (loading) {
    return <div className="text-gray-400">Loading dashboard...</div>;
  }

  // if (!valid.length) {
  //   return (
  //     <div>
  //       <h1 className="text-2xl font-bold mb-2">Welcome back 👋</h1>
  //       <p className="text-gray-400 mb-6">No interviews yet. Start your first one!</p>
  //       <Link href="/new-interview" className="bg-blue-600 px-4 py-2 rounded-lg">
  //         + New Interview
  //       </Link>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Anushka</h1>
          <p className="text-gray-400">
            You’ve completed {valid.length} interviews.
          </p>
        </div>
        <Link href="/new-interview" className="bg-blue-600 px-4 py-2 rounded-lg">
          + New Interview
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<TrendingUp size={16} />} label="Overall (Avg)" value={avg("overall")} />
        <StatCard icon={<Mic size={16} />} label="Confidence (Avg)" value={avg("confidence")} />
        <StatCard
          icon={<MessageCircle size={16} />}
          label="Communication (Avg)"
          value={avg("communication")}
        />
        <StatCard
          icon={<Clock size={16} />}
          label="Last Interview"
          value={latest?.scores?.overall ?? 0}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Confidence Over Time</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={confidenceData}>
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Filler Words (Estimated)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fillerData}>
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Bar dataKey="fillers" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}