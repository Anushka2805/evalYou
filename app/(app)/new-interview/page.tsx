"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewInterview() {
  const router = useRouter();

  const [role, setRole] = useState("Software Engineer");
  const [mode, setMode] = useState<"Friendly" | "Neutral" | "Stress">("Neutral");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");

  const start = async () => {
    try {
      const res = await fetch("http://localhost:8000/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          mode,
          difficulty,
        }),
      });

      const data = await res.json();

      // store questions
      localStorage.setItem("interview_questions", JSON.stringify(data.questions));

      const params = new URLSearchParams({
        role,
        mode,
        difficulty,
      });

      router.push(`/interview?${params.toString()}`);

    } catch (err) {
      console.error("Question generation failed", err);
    }
  };
  return (
    <div className="flex justify-center">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-xl">
        <h1 className="text-xl font-semibold mb-4">New Mock Interview</h1>

        <div className="space-y-4">
          {/* Role */}
          <select
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Software Engineer</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>Data Analyst</option>
          </select>

          {/* Mode */}
          <div className="grid grid-cols-3 gap-3">
            {(["Friendly", "Neutral", "Stress"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`border rounded-lg p-3 text-center transition ${mode === m
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/10 hover:border-blue-500/50"
                  }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Difficulty */}
          <div className="grid grid-cols-3 gap-3">
            {(["Easy", "Medium", "Hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`border rounded-lg p-3 text-center transition ${difficulty === d
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/10 hover:border-blue-500/50"
                  }`}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={start}
            className="w-full bg-blue-600 hover:bg-blue-500 transition py-3 rounded-lg"
          >
            Start Interview ▶
          </button>
        </div>
      </div>
    </div>
  );
}