"use client";

import PostEditor from "@/components/admin/PostEditor";
import { useEffect, useState, use } from "react";
import { Loader2 } from "lucide-react";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 animate-spin text-[#00d4ff] mb-6" />
        <p className="text-[#64748b]">Loading your article for editing...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold font-[var(--font-space)] tracking-tight mb-1">
          Edit <span className="gradient-text">Article</span>
        </h1>
        <p className="text-[#64748b] text-sm">Update your tech news, free game alert or PC tip details.</p>
      </div>

      <PostEditor initialData={post} isEdit />
    </div>
  );
}
