"use client";
import { useRouter } from "next/navigation";
import { useInterviewStore } from "@/store/useInterviewStore";

export default function NewInterview() {
  const router = useRouter();
  const addInterview = useInterviewStore((s) => s.addInterview);

  const start = () => {
    const id = Date.now().toString();
    addInterview({
      id,
      title: "New Mock Interview",
      date: new Date().toISOString().slice(0, 10),
      role: "Software Engineer",
      mode: "Neutral",
      difficulty: "Medium",
      scores: {
        overall: Math.floor(60 + Math.random() * 30),
        confidence: Math.floor(60 + Math.random() * 30),
        communication: Math.floor(60 + Math.random() * 30),
        body: Math.floor(60 + Math.random() * 30),
        content: Math.floor(60 + Math.random() * 30),
      },
    });
router.push("/interview");  };

  return (
    <div className="flex justify-center">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-xl">
        <h1 className="text-xl font-semibold mb-4">New Mock Interview</h1>

        <div className="space-y-4">
          <select className="w-full bg-black/40 border border-white/10 rounded-lg p-3">
            <option>Software Engineer</option>
          </select>

          <div className="grid grid-cols-3 gap-3">
            {["Friendly", "Neutral", "Stress"].map((m) => (
              <div key={m} className="border border-white/10 rounded-lg p-3 text-center">
                {m}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["Easy", "Medium", "Hard"].map((d) => (
              <div key={d} className="border border-white/10 rounded-lg p-3 text-center">
                {d}
              </div>
            ))}
          </div>

          <button onClick={start} className="w-full bg-blue-600 py-3 rounded-lg">
            Start Interview ▶
          </button>
        </div>
      </div>
    </div>
  );
}