"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Analyzing() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.push("/results");
    }, 2500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <h2 className="text-xl font-semibold">Analyzing your interview...</h2>
      <p className="text-gray-400">Our AI is reviewing your performance.</p>
    </div>
  );
}