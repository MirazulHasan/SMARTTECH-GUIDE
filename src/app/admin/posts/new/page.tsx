import PostEditor from "@/components/admin/PostEditor";

export default function NewPostPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold font-[var(--font-space)] tracking-tight mb-1">
          Create <span className="gradient-text">New Article</span>
        </h1>
        <p className="text-[#64748b] text-sm">Write your latest tech news, free game alert or PC tip.</p>
      </div>

      <PostEditor />
    </div>
  );
}
