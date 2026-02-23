"use client";
import { Search, Filter } from "lucide-react";
import { useInterviewStore } from "@/store/useInterviewStore";
import { useRouter } from "next/navigation";

export default function Reports() {
  const { interviews, selectInterview } = useInterviewStore();
  const router = useRouter();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Interview Reports</h1>
      <p className="text-gray-400 mb-6">{interviews.length} total interviews</p>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3">
          <Search size={16} className="text-gray-400" />
          <input className="bg-transparent outline-none flex-1 py-2" placeholder="Search..." />
        </div>
        <button className="flex items-center gap-2 border border-white/10 rounded-lg px-4">
          <Filter size={16} /> Filters
        </button>
      </div>

      <div className="space-y-4">
        {interviews.map((i) => (
          <button
            key={i.id}
            onClick={() => {
              selectInterview(i.id);
              router.push("/results");
            }}
            className="w-full text-left bg-white/5 border border-white/10 rounded-xl p-4 hover:border-blue-500/40 transition"
          >
            <div className="flex justify-between">
              <span>{i.title}</span>
              <span className="text-green-400 text-sm">Analyzed</span>
            </div>
            <div className="text-sm text-gray-400">{i.date}</div>
          </button>
        ))}
      </div>
    </div>
  );
}