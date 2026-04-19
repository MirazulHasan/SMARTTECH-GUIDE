"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Info, Image as ImageIcon, Camera, Layers, Newspaper, ChevronRight, Share2, Plus, X, Trash2, ChevronDown, Monitor } from "lucide-react";
import { toast } from "sonner";
import LogoEditor from "@/components/admin/LogoEditor";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    heroTitle: "",
    heroSubtitle: "",
    tickerItems: "",
    logoUrl: "",
    footerText: "",
    siteName: "SMART",
    siteTitle: "GUIDE",
    exploreTitle: "EXPLORE OUR GUIDES",
    exploreSubtitle: "Hand-picked categories to help you master your PC.",
    stayUpdatedTitle: "Stay Updated",
    stayUpdatedSubtitle: "Get the latest PC tips delivered to your inbox.",
    footerTitle: "SmartTech Guide",
    footerSubtitle: "Smart Tips, Better You.",
    socialLinkFacebook: "",
    heroStatusText: "",
    heroButton1Text: "",
    heroButton1Link: "",
    heroButton2Text: "",
    heroButton2Link: "",
    splashTopLeft: "SYS.VER.2.0.4 // BOOT_SEQ",
    splashTopRight: "AUTH: OVERRIDE_ACTV",
    splashBottomLeft: "CPU: OVERRIDE",
    splashBottomRight: "SEC: UNLOCKED",
    splashLogs: '[\n  "ESTABLISHING SECURE CONNECTION...",\n  "BYPASSING MAINFRAME FIREWALL...",\n  "DECRYPTING DATABASE OBJECTS...",\n  "MOUNTING USER INTERFACE...",\n  "SYSTEM READY."\n]',
    socialLinks: "[]",
  });
  const [socialLinks, setSocialLinks] = useState<{platform: string, url: string}[]>([]);
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
          siteName: data.siteName || "SMART",
          siteTitle: data.siteTitle || "GUIDE",
          exploreTitle: data.exploreTitle || "",
          exploreSubtitle: data.exploreSubtitle || "",
          stayUpdatedTitle: data.stayUpdatedTitle || "",
          stayUpdatedSubtitle: data.stayUpdatedSubtitle || "",
          footerTitle: data.footerTitle || "",
          footerSubtitle: data.footerSubtitle || "",
          socialLinkFacebook: data.socialLinkFacebook || "",
          heroStatusText: data.heroStatusText || "",
          heroButton1Text: data.heroButton1Text || "",
          heroButton1Link: data.heroButton1Link || "",
          heroButton2Text: data.heroButton2Text || "",
          heroButton2Link: data.heroButton2Link || "",
          splashTopLeft: data.splashTopLeft || "SYS.VER.2.0.4 // BOOT_SEQ",
          splashTopRight: data.splashTopRight || "AUTH: OVERRIDE_ACTV",
          splashBottomLeft: data.splashBottomLeft || "CPU: OVERRIDE",
          splashBottomRight: data.splashBottomRight || "SEC: UNLOCKED",
          splashLogs: data.splashLogs || '[\n  "ESTABLISHING SECURE CONNECTION...",\n  "BYPASSING MAINFRAME FIREWALL...",\n  "DECRYPTING DATABASE OBJECTS...",\n  "MOUNTING USER INTERFACE...",\n  "SYSTEM READY."\n]',
          socialLinks: data.socialLinks || "[]",
        });
        setSocialLinks(data.socialLinks ? JSON.parse(data.socialLinks) : []);
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
    const submissionData = {
      ...formData,
      socialLinks: JSON.stringify(socialLinks)
    };
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
      toast.success("Profile saved successfully!", {
        icon: "✓",
      });
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving settings");
    } finally {
      setLoading(false);
    }
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "Facebook", url: "" }]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
  };

  const clearAllSocialLinks = () => {
    setSocialLinks([]);
  };

  if (fetching) return <div className="flex justify-center py-40 animate-pulse text-muted-foreground">Loading configuration...</div>;

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
        <p className="text-muted-foreground text-sm">Configure the look and feel of your tech hub landing page.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-3xl p-10 space-y-8 max-w-4xl border-white/5">
        {/* Profile Photo Section (Image 1 Style) */}
        <div className="flex flex-col items-center justify-center space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-[#a855f7] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            <h2 className="text-3xl font-bold text-foreground font-[var(--font-space)]">
              Profile <span className="gradient-text">Photo</span>
            </h2>
          </div>
          
          <div className="relative group">
            {/* Avatar Display */}
            <div className="w-44 h-44 rounded-full p-[3px] bg-gradient-to-tr from-[#a855f7] via-[#d946ef] to-[#a855f7] shadow-[0_0_50px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_60px_rgba(168,85,247,0.3)] transition-all duration-500">
              <div className="w-full h-full rounded-full bg-[#0a0f1e] overflow-hidden flex items-center justify-center relative border-4 border-[#0a0f1e]">
                {formData.logoUrl ? (
                  <img 
                    src={formData.logoUrl} 
                    alt="Logo" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-foreground/10" />
                )}
              </div>
            </div>
            
            {/* Camera Button */}
            <label className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-[#a855f7] to-[#d946ef] border-4 border-[#0a0f1e] flex items-center justify-center text-foreground shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer z-10">
              <Camera className="w-5 h-5" />
              <input type="file" className="hidden" accept="image/*" onChange={handleLogoSelect} />
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 pt-6">
          <div className="flex items-center gap-3 mb-2 md:col-span-2">
            <Monitor className="w-5 h-5 text-[#a855f7]" />
            <h3 className="text-lg font-bold uppercase tracking-widest text-foreground">Identity Configuration</h3>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground px-1 uppercase tracking-widest">Main Brand Name</label>
            <input
              className="w-full bg-muted/10 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-[#a855f7] transition-all text-foreground"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              placeholder="SMART TECH"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground px-1 uppercase tracking-widest">Brand Tagline / Title</label>
            <input
              className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-4 px-6 outline-none focus:border-[#a855f7] transition-all text-foreground text-sm"
              value={formData.siteTitle}
              onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
              placeholder="GUIDE"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-2 md:col-span-2">
            <Layers className="w-5 h-5 text-[#00d4ff]" />
            <h3 className="text-lg font-bold uppercase tracking-widest text-foreground">Hero Section</h3>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground px-1 uppercase tracking-widest"> Hero Title </label>
            <input
              className="w-full bg-muted/10 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all text-foreground"
              value={formData.heroTitle}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              placeholder="Your Ultimate Tech Hub..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground px-1 uppercase tracking-widest">Hero Subtitle</label>
            <input
              className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all text-foreground text-sm"
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              placeholder="Discover free games, software drop..."
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-2 md:col-span-2">
            <Camera className="w-5 h-5 text-[#00d4ff]" />
            <h3 className="text-lg font-bold uppercase tracking-widest text-foreground">Hero HUD Configuration</h3>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground px-1 uppercase tracking-widest">Hero Status Bar Text</label>
            <input
              className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all text-foreground text-sm"
              value={formData.heroStatusText}
              onChange={(e) => setFormData({ ...formData, heroStatusText: e.target.value })}
              placeholder="# SYSTEM READY // SMART_TIPS_V2.0"
            />
          </div>
          <div className="space-y-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
            <p className="text-xs font-bold text-[#00d4ff] uppercase tracking-widest mb-2 px-1">Primary Button (Left)</p>
            <div className="space-y-2">
              <label className="text-[10px] font-medium text-muted-foreground px-1 uppercase tracking-widest">Button Text</label>
              <input
                className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-3 px-5 outline-none focus:border-[#00d4ff] transition-all text-foreground text-sm"
                value={formData.heroButton1Text}
                onChange={(e) => setFormData({ ...formData, heroButton1Text: e.target.value })}
                placeholder="INITIALIZE"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium text-muted-foreground px-1 uppercase tracking-widest">Button Link</label>
              <input
                className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-3 px-5 outline-none focus:border-[#00d4ff] transition-all text-foreground text-sm"
                value={formData.heroButton1Link}
                onChange={(e) => setFormData({ ...formData, heroButton1Link: e.target.value })}
                placeholder="#explore"
              />
            </div>
          </div>
          <div className="space-y-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
            <p className="text-xs font-bold text-[#ff00ff] uppercase tracking-widest mb-2 px-1">Secondary Button (Right)</p>
            <div className="space-y-2">
              <label className="text-[10px] font-medium text-muted-foreground px-1 uppercase tracking-widest">Button Text</label>
              <input
                className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-3 px-5 outline-none focus:border-[#00d4ff] transition-all text-foreground text-sm"
                value={formData.heroButton2Text}
                onChange={(e) => setFormData({ ...formData, heroButton2Text: e.target.value })}
                placeholder="CONNECT_NET"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium text-muted-foreground px-1 uppercase tracking-widest">Button Link</label>
              <input
                className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-3 px-5 outline-none focus:border-[#00d4ff] transition-all text-foreground text-sm"
                value={formData.heroButton2Link}
                onChange={(e) => setFormData({ ...formData, heroButton2Link: e.target.value })}
                placeholder="/category/free-games"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-2 md:col-span-2">
            <Layers className="w-5 h-5 text-[#ff00ff]" />
            <h3 className="text-lg font-bold uppercase tracking-widest text-foreground">Cyber Splash Screen</h3>
          </div>
          <div className="space-y-4 md:col-span-2 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
            <p className="text-xs font-bold text-[#ff00ff] uppercase tracking-widest mb-2 px-1">Corner Labels</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-muted-foreground px-1 uppercase tracking-widest">Top Left</label>
                <input
                  className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-3 px-5 outline-none focus:border-[#00d4ff] transition-all text-foreground text-sm"
                  value={formData.splashTopLeft}
                  onChange={(e) => setFormData({ ...formData, splashTopLeft: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-muted-foreground px-1 uppercase tracking-widest">Top Right</label>
                <input
                  className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-3 px-5 outline-none focus:border-[#00d4ff] transition-all text-foreground text-sm"
                  value={formData.splashTopRight}
                  onChange={(e) => setFormData({ ...formData, splashTopRight: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-muted-foreground px-1 uppercase tracking-widest">Bottom Left</label>
                <input
                  className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-3 px-5 outline-none focus:border-[#00d4ff] transition-all text-foreground text-sm"
                  value={formData.splashBottomLeft}
                  onChange={(e) => setFormData({ ...formData, splashBottomLeft: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-muted-foreground px-1 uppercase tracking-widest">Bottom Right</label>
                <input
                  className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-3 px-5 outline-none focus:border-[#00d4ff] transition-all text-foreground text-sm"
                  value={formData.splashBottomRight}
                  onChange={(e) => setFormData({ ...formData, splashBottomRight: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground px-1 uppercase tracking-widest">Hacker Logs Sequence (JSON Array)</label>
            <div className="p-4 rounded-xl bg-[#00d4ff0a] border border-[#00d4ff1a] flex gap-3 mb-2">
              <Info className="w-4 h-4 text-[#00d4ff] shrink-0 translate-y-0.5" />
              <p className="text-[10px] text-[#00d4ff] uppercase font-bold tracking-widest">Must be a valid JSON array of strings showing sequential boot messages.</p>
            </div>
            <textarea
              className="w-full bg-[#1e293b]/20 border border-white/5 rounded-2xl py-4 px-6 font-mono text-xs outline-none focus:border-[#00d4ff] transition-all h-40 resize-none text-[#ff00ff]"
              value={formData.splashLogs}
              onChange={(e) => setFormData({ ...formData, splashLogs: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground px-1 uppercase tracking-widest">Ticker Items (JSON)</label>
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

        <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-2 md:col-span-2">
            <Layers className="w-5 h-5 text-[#00d4ff]" />
            <h3 className="text-lg font-bold uppercase tracking-widest text-foreground">Categories Section</h3>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground px-1 uppercase tracking-widest">Section Title</label>
            <input
              className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all text-foreground text-sm"
              value={formData.exploreTitle}
              onChange={(e) => setFormData({ ...formData, exploreTitle: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground px-1 uppercase tracking-widest">Section Subtitle</label>
            <input
              className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all text-foreground text-sm"
              value={formData.exploreSubtitle}
              onChange={(e) => setFormData({ ...formData, exploreSubtitle: e.target.value })}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-2 md:col-span-2">
            <Newspaper className="w-5 h-5 text-[#ff00ff]" />
            <h3 className="text-lg font-bold uppercase tracking-widest text-foreground">Newsletter Section</h3>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground px-1 uppercase tracking-widest">Heading</label>
            <input
              className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all text-foreground text-sm"
              value={formData.stayUpdatedTitle}
              onChange={(e) => setFormData({ ...formData, stayUpdatedTitle: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground px-1 uppercase tracking-widest">Description</label>
            <input
              className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all text-foreground text-sm"
              value={formData.stayUpdatedSubtitle}
              onChange={(e) => setFormData({ ...formData, stayUpdatedSubtitle: e.target.value })}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-2 md:col-span-2">
            <ChevronRight className="w-5 h-5 text-[#00f2ff]" />
            <h3 className="text-lg font-bold uppercase tracking-widest text-foreground">Footer HUD Config</h3>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground px-1 uppercase tracking-widest">Footer Brand Name</label>
            <input
              className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all text-foreground text-sm"
              value={formData.footerTitle}
              onChange={(e) => setFormData({ ...formData, footerTitle: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground px-1 uppercase tracking-widest">Footer Subtitle</label>
            <input
              className="w-full bg-muted/10 border border-foreground/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all text-foreground text-sm"
              value={formData.footerSubtitle}
              onChange={(e) => setFormData({ ...formData, footerSubtitle: e.target.value })}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between gap-3 mb-2 md:col-span-2">
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-[#a855f7]" />
              <h3 className="text-lg font-bold uppercase tracking-widest text-foreground">Social Profiles</h3>
            </div>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={clearAllSocialLinks}
                className="text-[10px] font-bold text-red-400 bg-red-400/10 px-4 py-2 rounded-lg hover:bg-red-400/20 transition-all uppercase tracking-widest"
              >
                Clear All
              </button>
              <button 
                type="button" 
                onClick={addSocialLink}
                className="text-[10px] font-bold text-[#00d4ff] bg-[#00d4ff10] px-4 py-2 rounded-lg border border-[#00d4ff20] hover:bg-[#00d4ff20] transition-all flex items-center gap-2 uppercase tracking-widest"
              >
                <Plus className="w-3 h-3" /> Add Link
              </button>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            {socialLinks.map((link, index) => (
              <div key={index} className="group relative glass-card p-6 rounded-3xl border border-white/5 hover:border-[#a855f7]/30 transition-all bg-white/[0.01]">
                <div className="grid md:grid-cols-[200px_1fr] gap-6 items-end">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">Platform</label>
                    <div className="relative">
                      <select 
                        value={link.platform}
                        onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                        className="w-full bg-white/[0.03] dark:bg-black/20 border border-white/10 rounded-2xl py-3 px-5 outline-none focus:border-[#a855f7] transition-all text-foreground text-sm appearance-none cursor-pointer pr-10"
                      >
                        <option value="Facebook" className="bg-[#1a1c23] text-white">Facebook</option>
                        <option value="Twitter" className="bg-[#1a1c23] text-white">Twitter</option>
                        <option value="Instagram" className="bg-[#1a1c23] text-white">Instagram</option>
                        <option value="YouTube" className="bg-[#1a1c23] text-white">YouTube</option>
                        <option value="LinkedIn" className="bg-[#1a1c23] text-white">LinkedIn</option>
                        <option value="GitHub" className="bg-[#1a1c23] text-white">GitHub</option>
                        <option value="Discord" className="bg-[#1a1c23] text-white">Discord</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none transition-transform group-hover:text-[#a855f7]" />
                    </div>
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">URL</label>
                    <div className="flex gap-3">
                      <input
                        className="flex-1 bg-muted/10 border border-white/5 rounded-2xl py-3 px-5 outline-none focus:border-[#a855f7] transition-all text-foreground text-sm"
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                        placeholder="https://..."
                      />
                      <button 
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="w-11 h-11 rounded-2xl bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-white transition-all flex items-center justify-center shrink-0 border border-red-400/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {socialLinks.length === 0 && (
              <div className="py-12 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
                <Share2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No social profiles added yet.</p>
              </div>
            )}
          </div>
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
