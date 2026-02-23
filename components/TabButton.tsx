"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 rounded-lg border text-sm flex items-center gap-2 transition ${
        active
          ? "bg-white text-black border-white"
          : "bg-transparent text-gray-300 border-white/10 hover:bg-white/5"
      }`}
    >
      {icon}
      {label}
      {active && (
        <motion.span
          layoutId="tab"
          className="absolute inset-0 rounded-lg"
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        />
      )}
    </button>
  );
}