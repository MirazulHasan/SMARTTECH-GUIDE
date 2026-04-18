"use client";

import { useEffect, useState } from "react";
import { Settings, Moon, Sun, CloudSun } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

export default function SystemControls() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4 px-4 font-[var(--font-space)] text-xs font-bold text-white/70">
      {/* Time */}
      <div className="hidden lg:flex items-center gap-2 border-r border-white/10 pr-4 h-6">
        <span>{time}</span>
      </div>

      {/* Admin Button */}
      <Link
        href="/admin"
        className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white hover:opacity-90 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
      >
        <Settings size={14} className="animate-spin-slow" />
        <span className="text-xs font-bold uppercase tracking-widest font-[var(--font-space)]">Admin</span>
      </Link>
    </div>
  );
}
