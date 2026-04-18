import Link from "next/link";
import { LayoutDashboard, FileText, Settings, LogOut, Home, Layers } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground transition-all duration-300">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-glass-border flex flex-col p-6 glass sticky top-0 h-screen">
        <div className="flex items-center justify-between mb-10 px-2 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00d4ff] to-[#ffa500] flex items-center justify-center font-bold text-black text-xl">
               S
             </div>
             <span className="font-bold text-lg font-[var(--font-space)] tracking-tight">
               Smart<span className="text-[#00d4ff]">Tech</span>
             </span>
          </div>
        </div>

        <div className="mb-8 px-2">
           <ThemeToggle />
        </div>

        <nav className="flex-grow flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <LayoutDashboard className="w-5 h-5 text-[#64748b] group-hover:text-[#00d4ff]" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/posts" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <FileText className="w-5 h-5 text-[#64748b] group-hover:text-[#00d4ff]" />
            <span className="font-medium">Blog Posts</span>
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <Layers className="w-5 h-5 text-[#64748b] group-hover:text-[#00d4ff]" />
            <span className="font-medium">Categories</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <Settings className="w-5 h-5 text-[#64748b] group-hover:text-[#00d4ff]" />
            <span className="font-medium">Site Settings</span>
          </Link>
        </nav>

        <div className="pt-6 border-t border-[#ffffff11] flex flex-col gap-2">
          <Link href="/" target="_blank" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group text-[#64748b] hover:text-white">
            <Home className="w-5 h-5" />
            <span className="text-sm font-medium">View Website</span>
          </Link>
          <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition-all group text-red-400">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-10 bg-[#0a0f1e]">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
