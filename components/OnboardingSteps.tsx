"use client";
import { motion } from "framer-motion";

export default function OnboardingSteps({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {[1, 2, 3].map((n) => {
        const active = n <= current;
        return (
          <div key={n} className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: active ? 1 : 0.8, opacity: active ? 1 : 0.4 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                active
                  ? "bg-blue-600 border-blue-500"
                  : "border-white/20 text-gray-400"
              }`}
            >
              {n}
            </motion.div>
            {n !== 3 && <div className="w-12 h-px bg-white/20" />}
          </div>
        );
      })}
    </div>
  );
}