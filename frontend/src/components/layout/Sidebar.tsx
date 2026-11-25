"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Radio,
  Search,
  TrendingUp,
  User,
  Layers,
  FlaskConical,
  Bot,
  ClipboardList,
  BarChart3,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Live Scanner", href: "/live-scanner", icon: Radio },
  { name: "Game Analysis", href: "/game-analysis", icon: Search },
  { name: "Value Bets", href: "/value-bets", icon: TrendingUp },
  { name: "Player & Game Props", href: "/props", icon: User },
  { name: "Parlay Lab", href: "/parlay-lab", icon: Layers },
  { name: "Simulation Lab", href: "/simulation-lab", icon: FlaskConical },
  { name: "Agent Center", href: "/agent-center", icon: Bot },
  { name: "Bet Tracker", href: "/bet-tracker", icon: ClipboardList },
  { name: "Performance", href: "/performance", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-black font-bold text-sm">E</span>
          </div>
          <div>
            <div className="font-semibold text-white text-sm tracking-tight">
              EDGE Sports
            </div>
            <div className="text-[11px] text-zinc-500 uppercase tracking-wider">
              Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-zinc-800">
        <div className="text-[11px] text-zinc-600 text-center">
          College Football • Paper Trading Only
        </div>
      </div>
    </aside>
  );
}