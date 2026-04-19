"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gamepad2, Newspaper, Cpu, Download, Lightbulb, Monitor } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSplash } from "@/context/SplashContext";

export default function Navbar() {
  const pathname = usePathname();
  const { triggerSplash } = useSplash();
  const [logoUrl, setLogoUrl] = useState("");
  const [navItems, setNavItems] = useState<any[]>([]);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Settings
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.logoUrl) setLogoUrl(data.logoUrl);
      });

    // Fetch Categories
    fetch("/api/categories")
      .then(res => res.json())
      .then(cats => {
        const getIcon = (name: string, iconName?: string) => {
          // Priority to stored icon
          if (iconName === "Gamepad2") return <Gamepad2 size={18} />;
          if (iconName === "Newspaper") return <Newspaper size={18} />;
          if (iconName === "Cpu") return <Cpu size={18} />;
          if (iconName === "Download") return <Download size={18} />;
          if (iconName === "Lightbulb") return <Lightbulb size={18} />;
          if (iconName === "Monitor") return <Monitor size={18} />;
          
          // Fallback to name-based
          const n = name.toLowerCase();
          if (n.includes('game')) return <Gamepad2 size={18} />;
          if (n.includes('news')) return <Newspaper size={18} />;
          if (n.includes('tip') || n.includes('pc') || n.includes('tech') || n.includes('software')) return <Cpu size={18} />;
          return <Newspaper size={18} />;
        };

        const topCats = cats.slice(0, 4).map((c: any) => ({
          name: c.name,
          icon: getIcon(c.name, c.icon),
          href: `/category/${c.slug}`
        }));
        setNavItems(topCats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <nav className="flex items-center gap-1 sm:gap-2 px-1">
      {/* Profile Avatar / Logo with Hover Glow */}
      <Link 
        href="/" 
        onClick={triggerSplash}
        className="w-10 h-10 rounded-full border border-foreground/10 p-0.5 overflow-hidden flex-shrink-0 transition-all bg-foreground/5 hover:scale-110 hover:border-[#00f2ff] hover:shadow-[0_0_15px_#00f2ff] group/logo"
      >
        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
          {logoUrl && !imageError ? (
            <img 
              src={logoUrl} 
              alt="Logo" 
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform group-hover/logo:scale-110" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#00f2ff] to-[#ff00ff] opacity-80" />
          )}
        </div>
      </Link>

      <div className="h-6 w-[1px] bg-foreground/10 mx-2 hidden sm:block" />

      {/* Navigation Links */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-foreground/5 animate-pulse min-w-[100px]">
              <div className="w-4 h-4 rounded-full bg-foreground/10" />
              <div className="w-10 h-2 bg-foreground/10" />
            </div>
          ))
        ) : (
          navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-300 group flex-shrink-0 ${
                  isActive 
                    ? "bg-foreground/10 text-foreground shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-foreground/5" 
                    : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                <span className={`${isActive ? "text-[#00f2ff]" : "text-foreground/40 group-hover:text-[#a855f7]"} transition-colors drop-shadow-[0_0_5px_currentColor]`}>
                  {item.icon}
                </span>
                <span className={`text-[11px] font-black uppercase tracking-[0.15em] font-[var(--font-space)] ${isActive ? 'text-foreground' : 'text-foreground/70 group-hover:text-foreground'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })
        )}
      </div>
    </nav>
  );
}
