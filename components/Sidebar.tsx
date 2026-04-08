"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Plus, Bot, FileText, Settings } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/new-interview", label: "New Interview", icon: Plus },
  { href: "/coach", label: "AI Coach", icon: Bot },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/10 p-4 flex flex-col justify-between">
      <div>
        <div className="text-xl font-bold mb-8">
          Eval<span className="text-blue-500">You</span>.ai
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-gray-400 hover:bg-white/5"
                  }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

      </div>

      <div className="border-t border-white/10 pt-4 text-sm text-gray-400">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold">
            A
          </div>
          <div>
            <div className="text-white">User</div>
            <div className="text-xs">user@gmail.com</div>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/auth/signin";
          }}
          className="mt-4 text-red-400 hover:text-red-300"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}