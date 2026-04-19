import { FileText, Users, Eye, TrendingUp, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  // Fetch stats and actual data
  const [postCount, categoryCount, recentPosts, categoriesWithCount] = await Promise.all([
    prisma.post.count(),
    prisma.category.count(),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { category: true }
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })
  ]);

  // Calculate real distribution percentages
  const distribution = categoriesWithCount.map(cat => ({
    label: cat.name,
    percentage: postCount > 0 ? Math.round((cat._count.posts / postCount) * 100) : 0
  })).sort((a, b) => b.percentage - a.percentage);

  const stats = [
    { name: "Total Posts", value: postCount.toString(), icon: <FileText className="w-5 h-5" />, color: "bg-blue-500/10 text-blue-400" },
    { name: "Blog Views", value: "0", icon: <Eye className="w-5 h-5" />, color: "bg-purple-500/10 text-purple-400" },
    { name: "Categories", value: categoryCount.toString(), icon: <TrendingUp className="w-5 h-5" />, color: "bg-[#00d4ff10] text-[#00d4ff]" },
    { name: "Subscribers", value: "0", icon: <Users className="w-5 h-5" />, color: "bg-pink-500/10 text-pink-400" },
  ];

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, "");
  };

  return (
    <div className="flex flex-col gap-10 text-foreground transition-colors duration-300">
      {/* Header */}
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

      {/* Stats Grid */}
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
        {/* Recent Posts Table */}
        <div className="lg:col-span-2 glass rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Recent Posts</h2>
            <Link href="/admin/posts" className="text-[#00d4ff] text-sm font-semibold hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/admin/posts/${post.id}`}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-xl bg-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {post.coverImage ? (
                      <img src={post.coverImage} className="w-full h-full object-cover" alt={stripHtml(post.title)} />
                    ) : (
                      <FileText className="w-6 h-6 text-[#64748b]" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-base group-hover:text-[#00d4ff] transition-colors line-clamp-1">{stripHtml(post.title)}</h3>
                    <p className="text-xs text-[#64748b]">{post.category?.name || "Uncategorized"} • {new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                     <div className="p-2.5 rounded-xl bg-white/5 text-[#64748b] group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-all">
                        <Edit className="w-4 h-4" />
                     </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-[#64748b]">No posts found. Create your first one!</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-8 text-center uppercase tracking-widest text-[#64748b] text-sm">Post Distribution</h2>
          <div className="space-y-6">
            {distribution.length > 0 ? (
              distribution.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{cat.label}</span>
                    <span className="text-[#64748b]">{cat.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00d4ff] to-[#ffa500] rounded-full transition-all duration-1000" 
                      style={{ width: `${cat.percentage}%` }} 
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-[#64748b] text-sm">Add categories to see stats</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
