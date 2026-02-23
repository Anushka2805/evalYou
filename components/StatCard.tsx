import { ReactNode } from "react";

export default function StatCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-blue-400">{value}</div>
        {trend && <div className="text-green-400 text-sm">{trend}</div>}
      </div>
    </div>
  );
}