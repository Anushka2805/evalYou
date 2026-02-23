import { Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-14 border-b border-white/10 flex items-center justify-between px-6">
      <div className="text-gray-400">Dashboard</div>
      <div className="flex items-center gap-4">
        <Bell className="text-gray-400" size={18} />
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </header>
  );
}