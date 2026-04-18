"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Image as ImageIcon, X, Loader2, ChevronDown, Check } from "lucide-react";

interface PostEditorProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function PostEditor({ initialData, isEdit }: PostEditorProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    coverImage: initialData?.coverImage || "",
    categoryId: initialData?.categoryId || "",
    published: initialData?.published || false,
    featured: initialData?.featured || false,
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCats = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    };
    fetchCats();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();
      setFormData({ ...formData, coverImage: result.url });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/posts/${initialData.id}` : "/api/posts";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/posts");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 pb-32">
      {/* Primary Content Editor */}
      <div className="lg:col-span-2 space-y-8">
        <div className="glass p-8 rounded-3xl space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#64748b] px-1 uppercase tracking-widest">Post Title</label>
            <input 
              type="text" 
              className="w-full bg-[#1e293b]/20 border border-white/5 rounded-2xl py-4 px-6 text-xl font-bold outline-none focus:border-[#00d4ff] transition-all"
              placeholder="The Future of Smart Tech Guide..."
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium text-[#64748b] px-1 uppercase tracking-widest">Short Excerpt</label>
             <textarea 
               className="w-full bg-[#1e293b]/20 border border-white/5 rounded-2xl py-4 px-6 text-sm outline-none focus:border-[#00d4ff] transition-all h-24 resize-none"
               placeholder="A brief summary for category grids and search results..."
               required
               value={formData.excerpt}
               onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
             />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium text-[#64748b] px-1 uppercase tracking-widest">Post Content</label>
             <div className="min-h-[500px] bg-[#1e293b]/20 border border-white/5 rounded-3xl overflow-hidden flex flex-col focus-within:border-[#00d4ff] transition-all">
                <textarea 
                  className="flex-grow p-8 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed"
                  placeholder="Write your article content here..."
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
             </div>
          </div>
        </div>
      </div>

      {/* Editor Sidebar */}
      <div className="space-y-8">
        {/* Publish/Status Card */}
        <div className="glass p-8 rounded-3xl space-y-6">
          <h3 className="font-bold border-b border-white/5 pb-4 mb-2">Visibility & Status</h3>
          
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer select-none"
               onClick={() => setFormData({ ...formData, published: !formData.published })}>
            <div className="flex flex-col">
              <span className="font-bold text-sm">Published</span>
              <span className="text-[10px] text-[#64748b] uppercase tracking-widest">Visible to public</span>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-all ${formData.published ? 'bg-[#00d4ff]' : 'bg-gray-600'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.published ? 'left-7' : 'left-1'}`} />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer select-none"
               onClick={() => setFormData({ ...formData, featured: !formData.featured })}>
            <div className="flex flex-col">
              <span className="font-bold text-sm">Featured Post</span>
              <span className="text-[10px] text-[#64748b] uppercase tracking-widest">Pinned to hero</span>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-all ${formData.featured ? 'bg-[#ffa500]' : 'bg-gray-600'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.featured ? 'left-7' : 'left-1'}`} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#00d4ff] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#00c4ef] transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(0,212,255,0.3)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isEdit ? "Update Article" : "Publish Now"}
          </button>
        </div>

        {/* Category Pick Card */}
        <div className="glass p-8 rounded-3xl space-y-6">
           <h3 className="font-bold border-b border-white/5 pb-4 mb-2">Category</h3>
           <div className="relative group">
              <select 
                className="w-full appearance-none bg-[#1e293b]/20 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all cursor-pointer"
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                 <option value="" disabled className="bg-[#0a0f1e]">Select category</option>
                 {categories.map(cat => (
                   <option key={cat.id} value={cat.id} className="bg-[#0a0f1e] text-white py-2">{cat.name}</option>
                 ))}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] pointer-events-none group-focus-within:text-[#00d4ff]" />
           </div>
        </div>

        {/* Cover Image Upload Card */}
        <div className="glass p-8 rounded-3xl space-y-6">
           <h3 className="font-bold border-b border-white/5 pb-4 mb-2">Cover Image</h3>
           
           <div className="relative group cursor-pointer aspect-[16/10] bg-[#1e293b]/20 border-2 border-dashed border-white/5 rounded-2xl overflow-hidden hover:border-[#00d4ff33] transition-all text-center flex flex-col items-center justify-center">
              {formData.coverImage ? (
                <>
                  <img src={formData.coverImage} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button type="button" onClick={() => setFormData({ ...formData, coverImage: "" })} className="w-10 h-10 rounded-full bg-red-500/80 flex items-center justify-center"><X className="w-5 h-5" /></button>
                  </div>
                </>
              ) : (
                <div className="p-10">
                   {uploading ? (
                     <Loader2 className="w-10 h-10 animate-spin text-[#00d4ff] mx-auto" />
                   ) : (
                    <>
                      <ImageIcon className="w-10 h-10 text-[#64748b] mx-auto mb-4" />
                      <p className="text-sm font-medium text-[#64748b] leading-tight">Drag and drop or<br /><span className="text-[#00d4ff] underline">click to upload</span> cover image</p>
                    </>
                   )}
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleUpload}
                disabled={uploading}
              />
           </div>
           {formData.coverImage && (
             <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-green-400">
                <Check className="w-3 h-3" /> Image uploaded successfully
             </div>
           )}
        </div>
      </div>
    </form>
  );
}
