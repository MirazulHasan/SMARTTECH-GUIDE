"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Gamepad2, Newspaper, Cpu, Download, Lightbulb, Monitor, Code, Zap, Rocket, ChevronDown, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Newspaper");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");

  const iconOptions = [
    { name: "Newspaper", icon: <Newspaper /> },
    { name: "Gamepad2", icon: <Gamepad2 /> },
    { name: "Cpu", icon: <Cpu /> },
    { name: "Download", icon: <Download /> },
    { name: "Lightbulb", icon: <Lightbulb /> },
    { name: "Monitor", icon: <Monitor /> },
    { name: "Code", icon: <Code /> },
    { name: "Zap", icon: <Zap /> },
    { name: "Rocket", icon: <Rocket /> },
  ];

  const fetchCats = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    try {
      await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify({ name: newName, icon: selectedIcon }),
      });
      setNewName("");
      fetchCats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    toast(`Delete "${name}"?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            const res = await fetch(`/api/categories/${id}`, {
              method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
              toast.error(data.error || "Failed to delete category");
              return;
            }
            toast.success("Category deleted");
            fetchCats();
          } catch (err) {
            console.error(err);
            toast.error("An error occurred");
          }
        }
      },
      cancel: {
        label: "Cancel",
        onClick: () => {}
      }
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name: editName, icon: editIcon }),
      });
      setEditingId(null);
      fetchCats();
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (cat: any) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditIcon(cat.icon || "Newspaper");
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const getCategoryIcon = (name: string, iconName?: string) => {
    // If we have a stored icon name, use it
    if (iconName) {
      const Option = iconOptions.find(o => o.name === iconName);
      if (Option) return <div className="w-5 h-5">{Option.icon}</div>;
    }

    // Fallback to name-based logic
    const n = name.toLowerCase();
    if (n.includes('game')) return <Gamepad2 className="w-5 h-5" />;
    if (n.includes('news')) return <Newspaper className="w-5 h-5" />;
    if (n.includes('software') || n.includes('download')) return <Download className="w-5 h-5" />;
    if (n.includes('tip') || n.includes('pc') || n.includes('tech')) return <Cpu className="w-5 h-5" />;
    return <Lightbulb className="w-5 h-5" />;
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-[var(--font-space)] tracking-tight mb-1">
          Blog <span className="gradient-text">Categories</span>
        </h1>
        <p className="text-[#64748b] text-sm">Organize your tech news and guides into topics.</p>
      </div>

      <form onSubmit={handleAdd} className="grid md:grid-cols-[1fr_200px_auto] gap-4 items-end bg-white/[0.02] p-8 rounded-[32px] border border-white/5">
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] px-1">Category Name</label>
          <input 
            type="text" 
            placeholder="New category name..." 
            className="w-full bg-[#1e293b]/20 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] px-1">Choose Icon</label>
          <div className="relative">
            <select 
              value={selectedIcon}
              onChange={(e) => setSelectedIcon(e.target.value)}
              className="w-full bg-[#1e293b]/20 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all appearance-none cursor-pointer"
            >
              {iconOptions.map(opt => (
                <option key={opt.name} value={opt.name} className="bg-[#1a1c23]">{opt.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <button type="submit" className="h-14 bg-[#00d4ff] text-black font-bold px-10 rounded-2xl hover:bg-[#00c4ef] transition-all transform hover:-translate-y-1 shadow-[0_0_15px_rgba(0,212,255,0.3)] flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="glass rounded-3xl overflow-hidden border-white/5">
         <div className="p-8 space-y-4">
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#64748b]" />
            ) : categories.length === 0 ? (
              <p className="text-center text-[#64748b]">No categories yet.</p>
            ) : (
               categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.01] border border-white/5 hover:border-[#00d4ff33] transition-all group">
                   {editingId === cat.id ? (
                     <div className="flex-1 grid md:grid-cols-[1fr_200px_auto] gap-4 items-end pr-4">
                        <input 
                          className="w-full bg-[#1e293b]/50 border border-[#00d4ff33] rounded-xl py-3 px-5 outline-none text-white"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                        <div className="relative">
                          <select 
                            value={editIcon}
                            onChange={(e) => setEditIcon(e.target.value)}
                            className="w-full bg-[#1e293b]/50 border border-[#00d4ff33] rounded-xl py-3 px-5 outline-none appearance-none cursor-pointer text-white"
                          >
                            {iconOptions.map(opt => (
                              <option key={opt.name} value={opt.name} className="bg-[#1a1c23]">{opt.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => handleUpdate(cat.id)} className="bg-[#10b981] text-black px-4 py-3 rounded-xl font-bold hover:bg-[#059669]">Save</button>
                           <button onClick={cancelEditing} className="bg-white/5 text-white px-4 py-3 rounded-xl font-bold hover:bg-white/10">Cancel</button>
                        </div>
                     </div>
                   ) : (
                     <>
                        <div className="flex items-center gap-6">
                           <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#00d4ff] group-hover:bg-[#00d4ff] group-hover:text-black transition-all">
                             {getCategoryIcon(cat.name, cat.icon)}
                           </div>
                           <div>
                              <div className="font-bold text-lg">{cat.name}</div>
                              <div className="text-[10px] uppercase font-mono text-[#64748b] tracking-widest">{cat.slug} — {cat._count.posts} posts</div>
                           </div>
                        </div>
                        <div className="flex gap-3">
                           <button 
                             onClick={() => startEditing(cat)}
                             className="text-[10px] font-bold text-[#00d4ff] bg-[#00d4ff10] px-4 py-2 rounded-lg border border-[#00d4ff20] hover:bg-[#00d4ff20] transition-all uppercase tracking-widest"
                           >
                              Edit
                           </button>
                           <button 
                              onClick={() => handleDelete(cat.id, cat.name)}
                              className="w-11 h-11 rounded-2xl bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-white transition-all flex items-center justify-center shrink-0 border border-red-400/20 shadow-lg shadow-red-400/5 items-center justify-center"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                     </>
                   )}
                </div>
              ))
            )}
         </div>
      </div>
    </div>
  );
}
