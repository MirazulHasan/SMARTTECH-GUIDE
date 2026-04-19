import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TechBackground from "@/components/TechBackground";
import { Calendar, Tag, User, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { name: true } }
    }
  });

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white selection:bg-[#00d4ff33] relative pb-20">
      <TechBackground />
      
      {/* Article Header */}
      <div className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00d4ff08] rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#00d4ff] transition-colors mb-10 group">
             <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Guides
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-[#00d4ff15] text-[#00d4ff] text-xs font-bold uppercase tracking-widest rounded-full border border-[#00d4ff33]">
              {post.category?.name || "Uncategorized"}
            </span>
            <div className="flex items-center gap-2 text-[#64748b] text-sm">
               <Calendar className="w-4 h-4" />
               {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div 
            className="font-bold font-[var(--font-outfit)] leading-tight mb-8 [&_h1]:text-4xl md:[&_h1]:text-6xl [&_h2]:text-3xl [&_h3]:text-2xl"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />

          <div className="flex items-center gap-4 text-[#64748b]">
             <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <User className="w-5 h-5" />
             </div>
             <div className="text-sm font-medium">
                <p className="text-white">Written by {post.author.name}</p>
                <p>System Administrator</p>
             </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      {post.coverImage && (
        <div className="container mx-auto px-6 max-w-5xl mb-20">
           <div className="aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative group">
              <img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={post.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent opacity-60" />
           </div>
        </div>
      )}

      {/* HTML Content Container */}
      <div className="container mx-auto px-6 max-w-3xl">
         <div 
           className="post-content text-[#cacaca] text-lg leading-relaxed 
           [&_p]:mb-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-6
           [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-4
           [&_a]:text-[#00d4ff] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-white transition-colors
           [&_img]:rounded-3xl [&_img]:border [&_img]:border-white/10 [&_img]:my-8 [&_img]:w-full
           [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6
           [&_li]:mb-2 [&_li]:pl-1 [&_strong]:text-white [&_strong]:font-bold [&_i]:italic"
           dangerouslySetInnerHTML={{ __html: post.content }}
         />

         {/* Share / Tags section */}
         <div className="mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
               <Tag className="w-4 h-4 text-[#64748b]" />
               <span className="text-[#64748b] text-sm font-medium">{post.category?.name || "General"}</span>
            </div>
            <div className="text-[#64748b] text-[10px] uppercase font-bold tracking-tighter">
               DATA_REF: {post.id.toUpperCase()}
            </div>
         </div>
      </div>
    </main>
  );
}
