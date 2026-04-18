import Link from "next/link";
import { Gamepad2, Newspaper, Download, Lightbulb, ChevronRight, Monitor, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import TechBackground from "@/components/TechBackground";
import CyberTitle from "@/components/CyberTitle";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [categories, settings] = await Promise.all([
    prisma.category.findMany({ 
      include: { _count: { select: { posts: true } } },
      take: 4
    }),
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }) as Promise<any>
  ]);

  const categoryIcons: Record<string, React.ReactNode> = {
    "Tech News": <Newspaper />,
    "Free Games": <Gamepad2 />,
    "Free Software": <Download />,
    "PC Tips": <Lightbulb />,
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-[#00d4ff33] overflow-x-hidden relative">
      <TechBackground />
      
      {/* Centered Minimalist Hero */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 z-10 overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-tr from-[#00d4ff08] via-[#a855f708] to-transparent rounded-full blur-[150px] pointer-events-none animate-pulse-slow active-glow" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#00d4ff05] rounded-full blur-[120px] pointer-events-none animate-float" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#a855f708] rounded-full blur-[150px] pointer-events-none animate-float" style={{ animationDelay: "2s" }} />
        
        {/* Hero Content Wrapper */}
        <div className="max-w-5xl relative z-20 w-full flex flex-col items-center gap-y-12">
          <CyberTitle siteName={settings?.siteName || "SMART"} siteTitle={settings?.siteTitle || "GUIDE"} />

          {/* Primary Slogan (Badge Style) */}
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-[#00f2ff11] border-l-4 border-[#00f2ff] skew-x-[-12deg]">
            <div className="w-2 h-2 bg-[#00f2ff] shadow-[0_0_10px_#00f2ff] animate-pulse" />
            <span className="text-[#00f2ff] text-xs md:text-sm font-black tracking-[0.4em] uppercase font-[var(--font-space)] skew-x-[12deg]">
              SYSTEM READY // SMART_TIPS_V2.0
            </span>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-6 relative z-10">
            <Link href="#explore" className="cyber-button px-12 py-5 font-black flex items-center gap-3 group skew-x-[-10deg]">
              <span className="skew-x-[10deg] flex items-center gap-2 text-sm">
                INITIALIZE <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
            
            <Link href="https://www.facebook.com/smarttechguide/" target="_blank" className="px-10 py-5 border border-[#ff00ff]/30 text-[#ff00ff] font-bold inline-flex items-center gap-2 hover:bg-[#ff00ff0a] transition-all skew-x-[-10deg]">
              <span className="skew-x-[10deg] flex items-center gap-2 text-sm uppercase italic">
                Connect_Net <ExternalLink className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Selection */}
      <section id="explore" className="container mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold font-[var(--font-outfit)] mb-4">Explore Our Guides</h2>
            <p className="text-[#64748b] text-lg max-w-lg">Hand-picked categories to help you master your PC and discover the latest tech secrets.</p>
          </div>
          <div className="h-px bg-gradient-to-r from-[#00d4ff33] to-transparent flex-grow hidden md:block mx-12 mb-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((item: any, idx: number) => (
            <Link 
              key={idx} 
              href={`/category/${item.slug}`}
              className="group relative bg-[#050510] p-10 border border-[#00f2ff33] hover:border-[#ff00ff] transition-all duration-500 flex flex-col items-start overflow-hidden shadow-[inset_0_0_20px_rgba(0,242,255,0.05)]"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#ff00ff22] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-16 h-16 bg-[#00f2ff0a] border border-[#00f2ff33] flex items-center justify-center mb-8 text-[#00f2ff] group-hover:bg-[#00f2ff] group-hover:text-black transition-all duration-500 group-hover:shadow-[0_0_30px_#00f2ff]">
                {categoryIcons[item.name] || <Newspaper />}
              </div>
              
              <h3 className="text-2xl font-bold mb-3 group-hover:text-[#00d4ff] transition-colors">{item.name}</h3>
              <p className="text-[#64748b] mb-8 text-base leading-relaxed">{item._count.posts} Premium Articles</p>
              
              <div className="mt-auto flex items-center text-[#00d4ff] font-extrabold text-xs uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-all">
                Discover <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-3 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-6 py-24 border-t border-white/5 flex flex-col items-center text-center">
        <h2 className="text-4xl font-bold font-[var(--font-outfit)] mb-4">Stay Updated</h2>
        <p className="text-[#64748b] text-lg max-w-lg mb-16">Get the latest PC tips, tech news, and freebies delivered straight to your inbox.</p>
        
        <div className="input__container">
          <div className="shadow__input"></div>
          <input 
            type="email" 
            name="email" 
            className="input__search" 
            placeholder="Enter your email" 
            autoComplete="off"
          />
          <button className="input__button__shadow" aria-label="Subscribe">
            <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4ZM11 11V7H13V11H17V13H13V17H11V13H7V11H11Z"></path>
            </svg>
          </button>
        </div>
      </section>

      {/* Simple Global Footer */}
      <footer className="py-20 border-t border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold font-[var(--font-outfit)] mb-2">SmartTech Guide</h3>
            <p className="text-[#64748b]">Smart Tips, Better You.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-[#64748b] font-medium">
            <Link href="/" className="hover:text-[#00d4ff] transition-colors">Home</Link>
            <Link href="/news" className="hover:text-[#00d4ff] transition-colors">Tech News</Link>
            <Link href="/free-games" className="hover:text-[#00d4ff] transition-colors">Free Games</Link>
            <Link href="/tips" className="hover:text-[#00d4ff] transition-colors">PC Tips</Link>
            <Link href="https://www.facebook.com/smarttechguide/" className="hover:text-[#00d4ff] transition-colors text-white font-bold">Facebook</Link>
          </div>
          
          <div className="text-[#64748b] text-sm md:text-right relative z-10">
            &copy; {new Date().getFullYear()} SmartTech Guide.<br />
            Powered by Passion.
          </div>
        </div>
      </footer>
    </main>
  );
}
