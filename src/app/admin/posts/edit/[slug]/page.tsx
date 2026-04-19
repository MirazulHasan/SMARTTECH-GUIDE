"use client";

import PostEditor from "@/components/admin/PostEditor";
import { useEffect, useState, use } from "react";
import { Loader2 } from "lucide-react";

export default function EditPostBySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/by-slug/${slug}`);
        if (!res.ok) throw new Error("Failed to load article");
        const data = await res.json();
        setPost(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 animate-spin text-[#00d4ff] mb-6" />
        <p className="text-[#64748b]">Syncing with system database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="text-red-500 font-bold mb-4">Error: {error}</div>
        <p className="text-[#64748b]">The article might have been moved or deleted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold font-[var(--font-space)] tracking-tight mb-1">
          Edit <span className="gradient-text">Article</span>
        </h1>
        <p className="text-[#64748b] text-sm italic uppercase tracking-widest text-[10px]">Reference: {slug}</p>
      </div>

      <PostEditor initialData={post} isEdit />
    </div>
  );
}
