import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CategoryPostList from "@/components/CategoryPostList";

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
    <main className="min-h-screen bg-transparent text-foreground selection:bg-[#00d4ff33] relative pb-20">
      
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
          <CategoryPostList posts={category.posts} />
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
