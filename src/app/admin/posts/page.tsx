"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash, Search, ExternalLink, Loader2, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PostListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
     if (!confirm("Are you sure you want to delete this post?")) return;
     try {
       await fetch(`/api/posts/${id}`, { method: "DELETE" });
       setPosts(posts.filter(p => p.id !== id));
     } catch (err) {
       console.error(err);
     }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-[var(--font-space)] tracking-tight mb-1">
             Manage Blog <span className="gradient-text">Posts</span>
          </h1>
          <p className="text-[#64748b] text-sm">Create, edit, and publish your latest tech news and guides.</p>
        </div>
        <Link href="/admin/posts/new" className="flex items-center gap-2 bg-[#00d4ff] text-black px-6 py-2.5 rounded-xl font-bold hover:bg-[#00c4ef] transition-all transform hover:-translate-y-0.5 shadow-[0_0_15px_rgba(0,212,255,0.3)]">
          <Plus className="w-5 h-5" />
          Create New Post
        </Link>
      </div>

      {/* Filters/Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative group w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] group-focus-within:text-[#00d4ff] transition-colors" />
          <input 
            type="text" 
            placeholder="Search by title or category..." 
            className="w-full bg-[#1e293b]/20 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="h-full bg-white/5 border border-white/5 px-6 py-3 rounded-2xl text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="glass rounded-3xl overflow-hidden border-white/5 shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                     <th className="px-6 py-5 text-sm font-bold uppercase tracking-widest text-[#64748b]">Post</th>
                     <th className="px-6 py-5 text-sm font-bold uppercase tracking-widest text-[#64748b]">Category</th>
                     <th className="px-6 py-5 text-sm font-bold uppercase tracking-widest text-[#64748b]">Status</th>
                     <th className="px-6 py-5 text-sm font-bold uppercase tracking-widest text-[#64748b] text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center">
                        <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#64748b] mb-4" />
                        <span className="text-[#64748b]">Loading your blog articles...</span>
                      </td>
                    </tr>
                  ) : filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center">
                        <p className="text-[#64748b]">No posts found matching your current filter.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                         <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                               <div className="w-16 h-16 rounded-xl bg-[#0a0f1e] overflow-hidden flex-shrink-0 border border-white/5">
                                  <img 
                                    src={post.coverImage || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80"} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                    alt="" 
                                  />
                               </div>
                               <div>
                                  <div className="font-bold text-lg mb-0.5 max-w-xs truncate">{post.title}</div>
                                  <div className="text-[#64748b] text-xs font-mono">{post.slug}</div>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-5">
                            <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-bold text-[#64748b] border border-white/5">
                                {post.category?.name || "Uncategorized"}
                            </span>
                         </td>
                         <td className="px-6 py-5">
                            {post.published ? (
                               <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00d4ff] bg-[#00d4ff10] px-3 py-1 rounded-full">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" /> Published
                               </span>
                            ) : (
                               <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Draft
                               </span>
                            )}
                         </td>
                         <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2 px-1">
                               <button 
                                 onClick={() => router.push(`/admin/posts/${post.id}`)}
                                 className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#64748b] hover:text-[#00d4ff] hover:bg-[#00d4ff10] hover:border-[#00d4ff33] transition-all"
                               >
                                  <Edit className="w-4 h-4" />
                               </button>
                               <Link 
                                 href={`/blog/${post.slug}`} 
                                 target="_blank"
                                 className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#64748b] hover:text-purple-400 hover:bg-purple-400/10 hover:border-purple-400/33 transition-all"
                               >
                                  <ExternalLink className="w-4 h-4" />
                               </Link>
                               <button 
                                 onClick={() => handleDelete(post.id)}
                                 className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#64748b] hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/33 transition-all"
                               >
                                  <Trash className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
