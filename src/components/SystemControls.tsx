"use client";

import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
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
    <div className="flex items-center gap-4 px-4 font-[var(--font-space)] text-xs font-bold text-foreground">
      {/* Time */}
      <div className="hidden lg:flex items-center gap-2 border-r border-foreground/10 pr-4 h-6 opacity-70">
        <span>{time}</span>
      </div>

      {/* Admin Button with Glow */}
      <Link
        href="/admin"
        className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7),0_0_40px_rgba(236,72,153,0.3)] group relative overflow-hidden"
      >
        <Settings size={14} className="animate-spin-slow group-hover:rotate-180 transition-transform duration-1000" />
        <span className="text-xs font-black uppercase tracking-widest font-[var(--font-space)]">Admin</span>
        
        {/* Subtle Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </Link>
    </div>
  );
}
