import { FileText, Users, Eye, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [postCount, categoryCount] = await Promise.all([
    prisma.post.count(),
    prisma.category.count(),
  ]);

  const stats = [
    { name: "Total Posts", value: postCount.toString(), icon: <FileText className="w-5 h-5" />, color: "bg-blue-500/10 text-blue-400" },
    { name: "Blog Views", value: "24.5k", icon: <Eye className="w-5 h-5" />, color: "bg-purple-500/10 text-purple-400" },
    { name: "Categories", value: categoryCount.toString(), icon: <TrendingUp className="w-5 h-5" />, color: "bg-[#00d4ff10] text-[#00d4ff]" },
    { name: "Subscribers", value: "528", icon: <Users className="w-5 h-5" />, color: "bg-pink-500/10 text-pink-400" },
  ];

  return (
    <div className="flex flex-col gap-10 text-foreground transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-[var(--font-space)] tracking-tight mb-1">
            Dashboard
          </h1>
          <p className="text-[#64748b] text-sm">Welcome back, Administrator.</p>
        </div>
        <Link href="/admin/posts/new" className="flex items-center gap-2 bg-[#00d4ff] text-black px-6 py-2.5 rounded-xl font-bold hover:bg-[#00c4ef] transition-all transform hover:-translate-y-0.5 shadow-[0_0_15px_rgba(0,212,255,0.3)]">
          <Plus className="w-5 h-5" />
          Create New Post
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass p-8 rounded-3xl group hover:border-[#00d4ff33] transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all ${stat.color} group-hover:scale-110`}>
              {stat.icon}
            </div>
            <div className="text-[#64748b] text-sm font-medium mb-1 uppercase tracking-wider">{stat.name}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Posts Table Shell */}
        <div className="lg:col-span-2 glass rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Recent Posts</h2>
            <Link href="/admin/posts" className="text-[#00d4ff] text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((post) => (
              <div key={post} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                <div className="w-16 h-16 rounded-xl bg-white/5 flex-shrink-0 animate-pulse overflow-hidden bg-gradient-to-br from-white/5 to-white/10" />
                <div className="flex-grow">
                  <div className="h-4 w-3/4 bg-white/5 rounded mb-2 group-hover:bg-white/10 transition-colors" />
                  <div className="h-3 w-1/4 bg-white/5 rounded group-hover:bg-white/10 transition-colors" />
                </div>
                <div className="flex gap-2">
                   <div className="w-8 h-8 rounded-lg bg-white/5" />
                   <div className="w-8 h-8 rounded-lg bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories / Quick Stats */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-8 text-center uppercase tracking-widest text-[#64748b] text-sm">Post Distribution</h2>
          <div className="space-y-6">
            {[
              { label: "Tech News", percentage: 45 },
              { label: "Free Games", percentage: 25 },
              { label: "Free Software", percentage: 20 },
              { label: "PC Tips", percentage: 10 },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>{cat.label}</span>
                  <span className="text-[#64748b]">{cat.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00d4ff] to-[#ffa500] rounded-full" style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
