import Link from "next/link";
import { Gamepad2, Newspaper, Download, Lightbulb, ChevronRight, Monitor, ExternalLink, Cpu, Code, Zap, Rocket } from "lucide-react";
import Navbar from "@/components/Navbar";
import TechBackground from "@/components/TechBackground";
import CyberTitle from "@/components/CyberTitle";
import { prisma } from "@/lib/prisma";
import PostCarousel from "@/components/PostCarousel";

export default async function Home() {
  const [categories, settings, recentPosts] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: "asc" },
      take: 10
    }),
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }) as Promise<any>,
    prisma.post.findMany({
      where: { 
        published: true,
        featured: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { category: true }
    })
  ]);

  const getCategoryIcon = (name: string, iconName?: string) => {
    // Priority to stored icon
    if (iconName === "Gamepad2") return <Gamepad2 />;
    if (iconName === "Newspaper") return <Newspaper />;
    if (iconName === "Cpu") return <Cpu />;
    if (iconName === "Download") return <Download />;
    if (iconName === "Lightbulb") return <Lightbulb />;
    if (iconName === "Monitor") return <Monitor />;
    if (iconName === "Code") return <Code />;
    if (iconName === "Zap") return <Zap />;
    if (iconName === "Rocket") return <Rocket />;
    
    // Fallback to name-based
    const n = name.toLowerCase();
    if (n.includes('game')) return <Gamepad2 />;
    if (n.includes('news')) return <Newspaper />;
    if (n.includes('software') || n.includes('download')) return <Download />;
    if (n.includes('tip') || n.includes('pc') || n.includes('tech')) return <Monitor />;
    return <Lightbulb />;
  };

  return (
    <main className="min-h-screen bg-transparent text-foreground selection:bg-[#00d4ff33] overflow-x-hidden relative">
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
              {settings?.heroStatusText || "SYSTEM READY // SMART_TIPS_V2.0"}
            </span>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-6 relative z-10">
            <Link href={settings?.heroButton1Link || "#explore"} className="cyber-button px-12 py-5 font-black flex items-center gap-3 group skew-x-[-10deg]">
              <span className="skew-x-[10deg] flex items-center gap-2 text-sm uppercase tracking-widest">
                {settings?.heroButton1Text || "INITIALIZE"} <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>

            <Link 
              href={settings?.heroButton2Link || "https://www.facebook.com/smarttechguide/"} 
              target={settings?.heroButton2Link?.startsWith('http') ? "_blank" : "_self"} 
              className="px-10 py-5 border border-[#ff00ff]/30 text-[#ff00ff] font-bold inline-flex items-center gap-2 hover:bg-[#ff00ff0a] transition-all skew-x-[-10deg]"
            >
              <span className="skew-x-[10deg] flex items-center gap-2 text-sm uppercase italic">
                {settings?.heroButton2Text || "Connect_Net"} <ExternalLink className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Carousel Section */}
      <PostCarousel posts={recentPosts} />

      {/* Categories Selection */}
      <section id="explore" className="container mx-auto px-6 py-32">
        <div className="mb-20 text-center relative z-20">
          <h2 className="text-4xl md:text-5xl font-black gradient-text italic uppercase tracking-tighter">
            {settings?.exploreTitle || "Explore Our Guides"}
          </h2>
          <div className="h-1.5 w-48 bg-[#a855f7] mx-auto mt-4 shadow-[0_0_20px_#a855f7] skew-x-[-20deg]" />
          <p className="text-[#64748b] text-lg max-w-lg mx-auto mt-6">
            {settings?.exploreSubtitle || "Hand-picked categories to help you master your PC."}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-12 gap-y-16 py-10">
          {categories.map((item: any, idx: number) => (
            <Link
              key={idx}
              href={`/category/${item.slug}`}
              className="cyber-box group relative w-full sm:w-[320px] h-full min-h-[320px]"
            >
              {/* Mechanical Corner Badge */}
              <div className="absolute -top-3 left-4 bg-[#00f2ff] text-black font-black px-3 py-1 text-[10px] tracking-[0.2em] shadow-[0_0_10px_#00f2ff] skew-x-[8deg] z-10 transition-transform group-hover:scale-110">
                CAT-{String(idx + 1).padStart(2, '0')}
              </div>

              <div className="w-16 h-16 bg-[#00f2ff0a] border border-[#00f2ff33] flex items-center justify-center mb-8 text-[#00f2ff] group-hover:bg-[#00f2ff] group-hover:text-black transition-all duration-500 group-hover:shadow-[0_0_30px_#00f2ff] skew-x-[8deg]">
                {getCategoryIcon(item.name, item.icon)}
              </div>

              <h3 className="text-2xl font-black mb-3 group-hover:text-[#00f2ff] transition-colors italic uppercase tracking-wider skew-x-[8deg]">{item.name}</h3>
              <p className="text-[#64748b] mb-8 text-sm leading-relaxed font-bold skew-x-[8deg]">{item._count.posts} Premium Articles</p>

              <div className="mt-auto flex items-center text-[#00f2ff] font-black text-[10px] uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 transition-all skew-x-[8deg]">
                Access Data <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-3 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-6 py-24 border-t border-white/5 flex flex-col items-center text-center">
        <div className="mb-16 text-center relative z-20">
          <h2 className="text-4xl md:text-5xl font-black gradient-text italic uppercase tracking-tighter">
            {settings?.stayUpdatedTitle || "Stay Updated"}
          </h2>
          <div className="h-1.5 w-48 bg-[#a855f7] mx-auto mt-4 shadow-[0_0_20px_#a855f7] skew-x-[-20deg]" />
          <p className="text-[#64748b] text-lg max-w-lg mx-auto mt-6">
            {settings?.stayUpdatedSubtitle || "Get the latest PC tips and tech news straight to your inbox."}
          </p>
        </div>

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

      <footer className="py-20 relative z-10 bg-transparent overflow-hidden">
        {/* Global Connecting HUD line (Wire) */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-dashed-line opacity-10 -translate-y-1/2" />
        
        {/* Top Gradient line */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00f2ff33] to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Title HUD Box */}
            <div className="relative group bg-background/80 backdrop-blur-sm pr-10">
              <div className="absolute -inset-4 border border-[#00f2ff22] skew-x-[-15deg] group-hover:border-[#00f2ff44] transition-all" />
              <div className="relative border-l-4 border-[#00f2ff] pl-6 py-2">
                <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-widest text-foreground">
                  {settings?.footerTitle?.split(' ')[0] || "SmartTech"} <span className="text-[#00f2ff]">{settings?.footerTitle?.split(' ').slice(1).join(' ') || "Guide"}</span>
                </h3>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#64748b] font-bold mt-1">
                  {settings?.footerSubtitle || "Smart Tips // Better You"}
                </p>
              </div>
            </div>

            {/* Navigation Links (Social HUD) */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 text-[10px] font-black uppercase tracking-[0.2em] relative z-20 px-6 py-2">
              {(() => {
                let socialLinks = [];
                try {
                  socialLinks = settings?.socialLinks ? JSON.parse(settings.socialLinks) : [];
                } catch (e) {
                  socialLinks = [];
                }
                
                if (socialLinks.length === 0 && settings?.socialLinkFacebook) {
                  socialLinks = [{ platform: "Facebook", url: settings.socialLinkFacebook }];
                }

                return socialLinks.map((link: any, idx: number) => (
                  <Link 
                    key={idx} 
                    href={link.url || "#"} 
                    target="_blank" 
                    className="group relative h-9 px-6 bg-background/50 backdrop-blur-md border border-[#00f2ff22] hover:border-[#00f2ff] skew-x-[-15deg] transition-all flex items-center justify-center overflow-hidden"
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00f2ff11] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    
                    <span className="block skew-x-[15deg] relative z-10 text-foreground/80 group-hover:text-[#00f2ff]">
                      {link.platform}
                    </span>
                    
                    {/* Bottom Indicator */}
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#00f2ff] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ));
              })()}
            </div>

            {/* System Copyright */}
            <div className="md:text-right border-r-2 border-[#64748b33] pr-6 py-2">
              <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-[0.2em] mb-1">
                &copy; {new Date().getFullYear()} smarttech.sys
              </div>
              <div className="text-[9px] text-[#64748b] opacity-50 uppercase tracking-[0.1em]">
                Powered by Passion // v2.0.4
              </div>
            </div>
          </div>
        </div>

        {/* Bottom HUD accents */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 opacity-10">
          <div className="w-2 h-2 rounded-full bg-[#00f2ff]" />
          <div className="w-12 h-2 rounded-full bg-[#00f2ff]" />
          <div className="w-2 h-2 rounded-full bg-[#00f2ff]" />
        </div>
      </footer>
    </main>
  );
}
