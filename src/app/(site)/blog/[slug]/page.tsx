import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Calendar, Tag, User, ChevronLeft } from "lucide-react";
import BackButton from "@/components/BackButton";

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
    <main className="min-h-screen bg-transparent text-foreground relative">
      {/* Persistent Floating Back Button */}
      <div className="fixed top-8 left-8 z-[5000]">
        <BackButton />
      </div>

      <div 
        className="w-full min-h-screen"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </main>
  );
}
