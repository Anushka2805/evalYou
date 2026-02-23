"use client";
import { useInterviewStore } from "@/store/useInterviewStore";
import { BarChart3, Mic, Eye, Brain } from "lucide-react";
import { useState } from "react";
import TabButton from "@/components/TabButton";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

export default function Results() {
  const { interviews, selectedId } = useInterviewStore();
  const data = interviews.find((i) => i.id === selectedId) || interviews[0];

  const [tab, setTab] = useState<"overview" | "voice" | "body" | "answers">("overview");

  const radarData = [
    { metric: "Confidence", value: data.scores.confidence },
    { metric: "Communication", value: data.scores.communication },
    { metric: "Body", value: data.scores.body },
    { metric: "Content", value: data.scores.content },
    { metric: "Overall", value: data.scores.overall },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        {data.title} — {data.date}
      </h1>
      <p className="text-gray-400 mb-6">
        {data.difficulty} · {data.mode}
      </p>

      <div className="flex gap-2 mb-6">
        <TabButton active={tab === "overview"} onClick={() => setTab("overview")} icon={<BarChart3 size={16} />} label="Overview" />
        <TabButton active={tab === "voice"} onClick={() => setTab("voice")} icon={<Mic size={16} />} label="Voice" />
        <TabButton active={tab === "body"} onClick={() => setTab("body")} icon={<Eye size={16} />} label="Body" />
        <TabButton active={tab === "answers"} onClick={() => setTab("answers")} icon={<Brain size={16} />} label="Answers" />
      </div>

      {tab === "overview" && (
        <>
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {Object.entries(data.scores).map(([k, v]) => (
              <div key={k} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <div className="text-gray-400 text-sm capitalize">{k}</div>
                <div className="text-3xl font-bold text-blue-400">{v}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Performance Radar</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {tab !== "overview" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          Detailed metrics for {tab} will appear here.
        </div>
      )}
    </div>
  );
}