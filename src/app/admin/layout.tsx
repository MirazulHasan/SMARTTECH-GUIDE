import Link from "next/link";
import { LayoutDashboard, FileText, Settings, LogOut, Home, Layers } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen bg-transparent text-foreground relative overflow-hidden">
      {/* Admin Sidebar - Fixed height and not scrolling */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 bg-background/40 backdrop-blur-xl shrink-0 h-full z-10">
        {/* Logo Area */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00d4ff] to-[#ffa500] flex items-center justify-center font-bold text-black text-xl shadow-[0_0_15px_rgba(0,212,255,0.3)]">
            S
          </div>
          <span className="font-bold text-lg font-[var(--font-space)] tracking-tight">
            Smart<span className="text-[#00d4ff]">Tech</span>
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-grow flex flex-col gap-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-[#334155] font-bold px-3 mb-2">Menu</p>
          <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <LayoutDashboard className="w-5 h-5 text-[#64748b] group-hover:text-[#00d4ff] transition-colors" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link href="/admin/posts" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <FileText className="w-5 h-5 text-[#64748b] group-hover:text-[#00d4ff] transition-colors" />
            <span className="font-medium text-sm">Blog Posts</span>
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <Layers className="w-5 h-5 text-[#64748b] group-hover:text-[#00d4ff] transition-colors" />
            <span className="font-medium text-sm">Categories</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
            <Settings className="w-5 h-5 text-[#64748b] group-hover:text-[#00d4ff] transition-colors" />
            <span className="font-medium text-sm">Site Settings</span>
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
          <div className="px-2">
             <p className="text-[9px] uppercase tracking-[0.2em] text-[#334155] font-bold mb-4">System Theme</p>
             <ThemeToggle />
          </div>

          <div className="flex flex-col gap-1">
            <Link href="/" target="_blank" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group text-[#64748b] hover:text-white">
              <Home className="w-5 h-5 transition-colors" />
              <span className="text-sm font-medium">View Website</span>
            </Link>
            <Link href="/api/auth/signout" className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition-all group text-red-400">
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Scrollable */}
      <main className="flex-grow p-10 relative z-10 overflow-y-auto overflow-x-hidden h-full">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
