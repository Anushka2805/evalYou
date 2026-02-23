"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart3, Mic, Eye, Brain } from "lucide-react";
import TabButton from "@/components/TabButton";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

type Scores = {
  overall: number;
  confidence: number;
  communication: number;
  body: number;
  content: number;
};

type VoiceMetrics = {
  wpm: number;
  fillers: number;
  pauses: number;
  confidence: number;
};

type Interview = {
  id: string;
  title: string;
  date: string;
  role: string;
  mode: string;
  difficulty: string;
  scores: Scores;
  transcript?: string;
  voice_metrics?: VoiceMetrics;
};

export default function Results() {
  const params = useSearchParams();
  const id = params.get("id");

  const [data, setData] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "voice" | "body" | "answers">("overview");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const res = await fetch(`http://127.0.0.1:8000/results/${id}`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-gray-400">Loading results...</div>;
  }

  if (!data) {
    return <div className="text-red-400">No data found.</div>;
  }

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
        <TabButton
          active={tab === "overview"}
          onClick={() => setTab("overview")}
          icon={<BarChart3 size={16} />}
          label="Overview"
        />
        <TabButton
          active={tab === "voice"}
          onClick={() => setTab("voice")}
          icon={<Mic size={16} />}
          label="Voice"
        />
        <TabButton
          active={tab === "body"}
          onClick={() => setTab("body")}
          icon={<Eye size={16} />}
          label="Body"
        />
        <TabButton
          active={tab === "answers"}
          onClick={() => setTab("answers")}
          icon={<Brain size={16} />}
          label="Answers"
        />
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
      {tab === "voice" && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
            <div className="text-gray-400 text-sm">WPM</div>
            <div className="text-3xl font-bold text-blue-400">
              {data.voice_metrics?.wpm ?? "-"}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
            <div className="text-gray-400 text-sm">Fillers</div>
            <div className="text-3xl font-bold text-blue-400">
              {data.voice_metrics?.fillers ?? "-"}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
            <div className="text-gray-400 text-sm">Pauses</div>
            <div className="text-3xl font-bold text-blue-400">
              {data.voice_metrics?.pauses ?? "-"}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
            <div className="text-gray-400 text-sm">Voice Confidence</div>
            <div className="text-3xl font-bold text-blue-400">
              {data.voice_metrics?.confidence ?? "-"}
            </div>
          </div>

          {data.transcript && (
            <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="text-gray-400 text-sm mb-2">Transcript</div>
              <p className="text-sm leading-relaxed">{data.transcript}</p>
            </div>
          )}
        </div>
      )}

      {tab === "body" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          Body language metrics will appear here.
        </div>
      )}

      {tab === "answers" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          Answer quality analysis will appear here.
        </div>
      )}
    </div>
  );
}