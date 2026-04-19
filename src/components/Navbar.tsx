"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gamepad2, Newspaper, Cpu } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.logoUrl) setLogoUrl(data.logoUrl);
      });
  }, []);

  const navItems = [
    { name: "Free Games", icon: <Gamepad2 size={18} />, href: "/category/free-games" },
    { name: "Games News", icon: <Newspaper size={18} />, href: "/category/tech-news" },
    { name: "PC Tips", icon: <Cpu size={18} />, href: "/category/pc-tips" },
  ];

  return (
    <nav className="flex items-center gap-1 sm:gap-2 px-1">
      {/* Profile Avatar / Logo with Hover Glow */}
      <Link 
        href="/" 
        className="w-10 h-10 rounded-full border border-foreground/10 p-0.5 overflow-hidden flex-shrink-0 transition-all bg-foreground/5 hover:scale-110 hover:border-[#00f2ff] hover:shadow-[0_0_15px_#00f2ff] group/logo"
      >
        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover transition-transform group-hover/logo:scale-110" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#00f2ff] to-[#ff00ff] opacity-80" />
          )}
        </div>
      </Link>

      <div className="h-6 w-[1px] bg-foreground/10 mx-2 hidden sm:block" />

      {/* Navigation Links */}
      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-300 group ${
                isActive 
                  ? "bg-foreground/10 text-foreground shadow-[0_5px_15px_rgba(0,0,0,0.1)] border border-foreground/5" 
                  : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <span className={`${isActive ? "text-[#00f2ff]" : "text-foreground/40 group-hover:text-[#00f2ff]"} transition-colors drop-shadow-[0_0_5px_currentColor]`}>
                {item.icon}
              </span>
              <span className={`text-[11px] font-black uppercase tracking-[0.15em] font-[var(--font-space)] ${isActive ? 'text-foreground' : 'text-foreground/70 group-hover:text-foreground'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
