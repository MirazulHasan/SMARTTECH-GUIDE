"use client";

import { useEffect, useState } from "react";
import { Plus, Trash, Loader2 } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");

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
        body: JSON.stringify({ name: newName }),
      });
      setNewName("");
      fetchCats();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold font-[var(--font-space)] tracking-tight mb-1">
          Blog <span className="gradient-text">Categories</span>
        </h1>
        <p className="text-[#64748b] text-sm">Organize your tech news and guides into topics.</p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-4">
        <input 
          type="text" 
          placeholder="New category name..." 
          className="flex-grow bg-[#1e293b]/20 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" className="bg-[#00d4ff] text-black font-bold px-8 rounded-2xl hover:bg-[#00c4ef] transition-all transform hover:-translate-y-1 shadow-[0_0_15px_rgba(0,212,255,0.3)]">
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
                <div key={cat.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                   <div>
                      <div className="font-bold">{cat.name}</div>
                      <div className="text-[10px] uppercase font-mono text-[#64748b]">{cat.slug} — {cat._count.posts} posts</div>
                   </div>
                   <button className="text-red-400 opacity-50 hover:opacity-100 transition-opacity p-2">
                      <Trash className="w-4 h-4" />
                   </button>
                </div>
              ))
            )}
         </div>
      </div>
    </div>
  );
}
