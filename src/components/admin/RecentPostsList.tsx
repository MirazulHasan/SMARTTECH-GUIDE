"use client";

import { FileText, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RecentPostsListProps {
  initialPosts: any[];
}

export default function RecentPostsList({ initialPosts }: RecentPostsListProps) {
  const router = useRouter();

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, "");
  };

  const handleDelete = async (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm(`Are you sure you want to delete "${stripHtml(title)}"?`)) {
      try {
        const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        if (res.ok) {
          router.refresh();
        } else {
          alert("Failed to delete the article.");
        }
      } catch (err) {
        alert("An error occurred while deleting.");
      }
    }
  };

  return (
    <div className="space-y-4">
      {initialPosts.length > 0 ? (
        initialPosts.map((post) => (
          <Link 
            key={post.id} 
            href={`/admin/posts/edit/${post.slug}`}
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-xl bg-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5">
              {post.coverImage ? (
                <img src={post.coverImage} className="w-full h-full object-cover" alt={stripHtml(post.title)} />
              ) : (
                <FileText className="w-6 h-6 text-[#64748b]" />
              )}
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-base group-hover:text-[#00d4ff] transition-colors line-clamp-1">
                {stripHtml(post.title)}
              </h3>
              <p className="text-xs text-[#64748b] flex items-center gap-2">
                {post.category?.name || "Uncategorized"} • {new Date(post.createdAt).toLocaleDateString()}
                {post.featured && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 text-[9px] text-orange-400 font-bold border border-orange-500/20 uppercase tracking-tighter">
                    Featured
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
               <div className="p-2.5 rounded-xl bg-white/5 text-[#64748b] group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-all">
                  <Edit className="w-4 h-4" />
               </div>
               <button
                  onClick={(e) => handleDelete(e, post.id, post.title)}
                  className="p-2.5 rounded-xl bg-white/5 text-[#64748b] hover:bg-red-500/20 hover:text-red-400 transition-all"
               >
                  <Trash2 className="w-4 h-4" />
               </button>
            </div>
          </Link>
        ))
      ) : (
        <div className="py-12 text-center text-[#64748b]">
          No posts found. Create your first one!
        </div>
      )}
    </div>
  );
}
