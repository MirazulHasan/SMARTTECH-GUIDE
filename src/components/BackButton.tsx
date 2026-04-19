"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()}
      className="flex items-center gap-2 px-5 py-2.5 bg-background/20 backdrop-blur-xl border border-white/10 rounded-full text-white/90 hover:text-white hover:border-white/40 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] group pointer-events-auto"
    >
      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] font-[var(--font-space)]">Return</span>
    </button>
  );
}
