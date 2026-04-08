"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AnalyzingPage() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");

  useEffect(() => {
    if (!id) return;

    const t = setTimeout(() => {
      router.push(`/results?id=${id}`);
    }, 2500); // 2.5 sec fake analyzing

    return () => clearTimeout(t);
  }, [id, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
      <h2 className="text-xl font-semibold mb-2">Analyzing your interview...</h2>
      <p className="text-gray-400">
        Our AI is reviewing your performance. This will take a moment.
      </p>
    </div>
  );
}