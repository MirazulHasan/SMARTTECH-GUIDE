"use client";

import Link from "next/link";
import { Monitor, Gamepad2, DownloadCloud, Newspaper, Cpu, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [activeItem, setActiveItem] = useState("Games");

  const navItems = [
    { name: "Games", icon: <Gamepad2 size={16} />, href: "/category/games" },
    { name: "Software", icon: <DownloadCloud size={16} />, href: "/category/software" },
    { name: "News", icon: <Newspaper size={16} />, href: "/category/news" },
    { name: "PC Tips", icon: <Cpu size={16} />, href: "/category/pc-tips" },
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-4 px-2">
      {/* Profile Avatar */}
      <div className="w-10 h-10 rounded-full border-2 border-[#ff00ff] p-0.5 overflow-hidden flex-shrink-0">
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#00d4ff] to-[#a855f7] flex items-center justify-center">
          <Monitor className="text-white w-5 h-5" />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setActiveItem(item.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 group ${
              activeItem === item.name 
                ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className={`${activeItem === item.name ? "text-[#00f2ff]" : "text-white/40 group-hover:text-[#00f2ff]"} transition-colors`}>
              {item.icon}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest font-[var(--font-space)]">
              {item.name}
            </span>
          </Link>
        ))}

        {/* More Dropdown Placeholder */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all">
          <span className="text-xs font-bold uppercase tracking-widest font-[var(--font-space)]">More</span>
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
}
