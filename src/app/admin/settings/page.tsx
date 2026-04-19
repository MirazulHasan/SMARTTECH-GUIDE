"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Info, Image as ImageIcon, Camera } from "lucide-react";
import { toast } from "sonner";
import LogoEditor from "@/components/admin/LogoEditor";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    heroTitle: "",
    heroSubtitle: "",
    tickerItems: "",
    logoUrl: "",
    footerText: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [logoEditor, setLogoEditor] = useState(false);
  const [tempLogo, setTempLogo] = useState("");

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempLogo(reader.result as string);
        setLogoEditor(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoSave = async (croppedBlob: Blob) => {
    setLoading(true);
    setLogoEditor(false);
    try {
      const uploadData = new FormData();
      uploadData.append("file", croppedBlob);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const { url } = await res.json();
      setFormData({ ...formData, logoUrl: url });
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload logo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setFormData({
          heroTitle: data.heroTitle || "",
          heroSubtitle: data.heroSubtitle || "",
          tickerItems: data.tickerItems || "",
          logoUrl: data.logoUrl || "",
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
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving settings");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-40 animate-pulse text-[#64748b]">Loading configuration...</div>;

  return (
    <div className="space-y-10">
      {logoEditor && (
        <LogoEditor
          image={tempLogo}
          onCancel={() => setLogoEditor(false)}
          onSave={handleLogoSave}
        />
      )}
      <div>
        <h1 className="text-3xl font-bold font-[var(--font-space)] tracking-tight mb-1">
          Site <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-[#64748b] text-sm">Configure the look and feel of your tech hub landing page.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-3xl p-10 space-y-8 max-w-4xl border-white/5">
        {/* Profile Photo Section (Image 1 Style) */}
        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-[#a855f7] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            <h2 className="text-3xl font-bold text-white font-[var(--font-space)]">
              Profile <span className="gradient-text">Photo</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 items-center">
            {/* Avatar Display */}
            <div className="relative group mx-auto lg:mx-0">
              <div className="w-44 h-44 rounded-full p-[3px] bg-gradient-to-tr from-[#a855f7] via-[#d946ef] to-[#a855f7] shadow-[0_0_50px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_60px_rgba(168,85,247,0.3)] transition-all duration-500">
                <div className="w-full h-full rounded-full bg-[#0a0f1e] overflow-hidden flex items-center justify-center relative border-4 border-[#0a0f1e]">
                  {formData.logoUrl ? (
                    <img 
                      src={formData.logoUrl} 
                      alt="Logo" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-white/10" />
                  )}
                </div>
              </div>
              
              {/* Camera Button */}
              <label className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-[#a855f7] to-[#d946ef] border-4 border-[#0a0f1e] flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer z-10">
                <Camera className="w-5 h-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoSelect} />
              </label>
            </div>

            {/* Upload Area */}
            <div 
              onClick={() => document.getElementById('logo-upload-box')?.click()}
              className="h-44 rounded-[32px] border-2 border-dashed border-white/5 hover:border-[#a855f7]/50 bg-white/[0.02] hover:bg-[#a855f7]/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <ImageIcon className="w-7 h-7 text-[#a855f7]" />
              </div>
              
              <div className="text-center space-y-0.5">
                <p className="text-lg font-bold text-white">Upload Avatar</p>
                <p className="text-[9px] font-bold text-[#64748b] uppercase tracking-[.25em]">max 10 MB</p>
              </div>
              
              <input 
                id="logo-upload-box" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleLogoSelect} 
              />
            </div>
          </div>
        </div>
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
