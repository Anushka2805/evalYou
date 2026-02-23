"use client";
import StatCard from "@/components/StatCard";
import { TrendingUp, Mic, MessageCircle, Clock } from "lucide-react";
import { useInterviewStore } from "@/store/useInterviewStore";
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

export default function Dashboard() {
  const { interviews } = useInterviewStore();
  const latest = interviews[0];

  const avg = (key: keyof (typeof latest)["scores"]) =>
    Math.round(
      interviews.reduce((a, b) => a + b.scores[key], 0) / interviews.length
    );

  const confidenceData = interviews
    .slice()
    .reverse()
    .map((i, idx) => ({
      name: `I${idx + 1}`,
      value: i.scores.confidence,
    }));

  const fillerData = interviews.map((i, idx) => ({
    name: `I${idx + 1}`,
    fillers: Math.max(0, 15 - Math.floor(i.scores.confidence / 7)),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Anushka</h1>
          <p className="text-gray-400">
            You’ve completed {interviews.length} interviews.
          </p>
        </div>
        <a href="/new-interview" className="bg-blue-600 px-4 py-2 rounded-lg">
          + New Interview
        </a>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<TrendingUp size={16} />} label="Overall (Avg)" value={avg("overall")} />
        <StatCard icon={<Mic size={16} />} label="Confidence (Avg)" value={avg("confidence")} />
        <StatCard icon={<MessageCircle size={16} />} label="Communication (Avg)" value={avg("communication")} />
        <StatCard icon={<Clock size={16} />} label="Last Interview" value={latest.scores.overall} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Confidence Over Time</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={confidenceData}>
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
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