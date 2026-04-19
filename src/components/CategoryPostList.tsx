"use client";

import { usePost } from "@/context/PostContext";
import { Newspaper, Calendar, ChevronRight } from "lucide-react";

export default function CategoryPostList({ posts }: { posts: any[] }) {
  const { openPost } = usePost();

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <div 
          onClick={() => openPost(post.slug)} 
          key={post.id} 
          className="group glass rounded-3xl overflow-hidden hover:border-[#00f2ff55] transition-all duration-500 flex flex-col cursor-pointer"
        >
          <div className="aspect-[16/10] bg-[#0a0f1e] overflow-hidden relative">
            {post.coverImage ? (
              <img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#334155]">
                 <Newspaper className="w-12 h-12" />
              </div>
            )}
          </div>
          
          <div className="p-8 flex flex-col flex-grow">
            <div 
              className="text-xl font-bold mb-3 group-hover:text-[#00f2ff] transition-colors line-clamp-2"
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
            <p className="text-[#64748b] text-sm leading-relaxed mb-6 line-clamp-3">
              {post.excerpt || (post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content)}
            </p>
            
            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#334155] uppercase tracking-widest">
               <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.createdAt).toLocaleDateString()}
               </div>
               <div className="text-[#00f2ff] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Read <ChevronRight className="w-3 h-3" />
               </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
