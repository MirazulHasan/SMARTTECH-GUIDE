"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Info } from "lucide-react";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    heroTitle: "",
    heroSubtitle: "",
    tickerItems: "",
    footerText: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setFormData({
          heroTitle: data.heroTitle || "",
          heroSubtitle: data.heroSubtitle || "",
          tickerItems: data.tickerItems || "",
          footerText: data.footerText || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      alert("Settings saved successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-40 animate-pulse text-[#64748b]">Loading configuration...</div>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold font-[var(--font-space)] tracking-tight mb-1">
          Site <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-[#64748b] text-sm">Configure the look and feel of your tech hub landing page.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-3xl p-10 space-y-8 max-w-4xl border-white/5">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#64748b] px-1 uppercase tracking-widest">Hero Title</label>
            <input 
              className="w-full bg-[#1e293b]/20 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all"
              value={formData.heroTitle}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              placeholder="Your Ultimate Tech Hub..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#64748b] px-1 uppercase tracking-widest">Hero Subtitle</label>
            <input 
              className="w-full bg-[#1e293b]/20 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all"
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              placeholder="Discover free games, software drop..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#64748b] px-1 uppercase tracking-widest">Ticker Items (JSON)</label>
          <div className="p-4 rounded-xl bg-[#00d4ff0a] border border-[#00d4ff1a] flex gap-3 mb-2">
             <Info className="w-4 h-4 text-[#00d4ff] shrink-0 translate-y-0.5" />
             <p className="text-[10px] text-[#00d4ff] uppercase font-bold tracking-widest">Must be an array of strings like ["Link 1", "Link 2"]</p>
          </div>
          <textarea 
            className="w-full bg-[#1e293b]/20 border border-white/5 rounded-2xl py-4 px-6 font-mono text-xs outline-none focus:border-[#00d4ff] transition-all h-32 resize-none"
            value={formData.tickerItems}
            onChange={(e) => setFormData({ ...formData, tickerItems: e.target.value })}
            placeholder='["\ud83c\udfae Epic Games giveaway...", "\ud83d\udcbb Windows 11 updates..."]'
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#64748b] px-1 uppercase tracking-widest">Footer Text</label>
          <input 
            className="w-full bg-[#1e293b]/20 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all"
            value={formData.footerText}
            onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
            placeholder="© 2025 SmartTech Guide. All rights reserved."
          />
        </div>

        <div className="pt-4 flex justify-end">
           <button 
             type="submit" 
             disabled={loading}
             className="bg-[#00d4ff] text-black font-bold px-12 py-4 rounded-2xl flex items-center gap-2 hover:bg-[#00c4ef] transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(0,212,255,0.3)] disabled:opacity-50"
           >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Configuration
           </button>
        </div>
      </form>
    </div>
  );
}
