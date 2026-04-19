import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TechBackground from "@/components/TechBackground";
import { ChevronRight, Calendar, Newspaper } from "lucide-react";
import Link from "next/link";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } }
      }
    }
  });

  if (!category) notFound();

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white selection:bg-[#00d4ff33] relative pb-20">
      <TechBackground />
      
      {/* Category Header */}
      <div className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00d4ff05] rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#00d4ff11] border border-[#00d4ff33] rounded-full text-[#00d4ff] text-xs font-bold uppercase tracking-[0.3em] mb-8">
             System_Category // {category.slug.replace(/-/g, '_').toUpperCase()}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-[var(--font-outfit)] tracking-tight">
             {category.name}
          </h1>
          <p className="max-w-xl mx-auto text-[#64748b] text-lg mt-6">
             Showing all premium guides and tech data for the <span className="text-white font-medium">{category.name}</span> sector.
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <section className="container mx-auto px-6 py-12 relative z-10">
        {category.posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.posts.map((post) => (
              <Link 
                href={`/blog/${post.slug}`} 
                key={post.id} 
                className="group glass rounded-3xl overflow-hidden hover:border-[#00d4ff55] transition-all duration-500 flex flex-col"
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
                    className="text-xl font-bold mb-3 group-hover:text-[#00d4ff] transition-colors line-clamp-2"
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
                     <div className="text-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Read <ChevronRight className="w-3 h-3" />
                     </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 glass rounded-3xl border-dashed border-white/10">
             <div className="text-[#64748b] text-sm uppercase tracking-[0.4em] font-bold">
                Buffer_Empty // No Articles Found
             </div>
             <p className="text-[#334155] mt-4">Check back soon for new guides in this category.</p>
          </div>
        )}
      </section>
    </main>
  );
}
