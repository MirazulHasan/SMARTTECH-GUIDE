"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import { Newspaper, ChevronLeft, ChevronRight } from "lucide-react";

export default function PostCarousel({ posts }: { posts: any[] }) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [dragX, setDragX] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play logic
  useEffect(() => {
    if (!isHovered && posts.length > 0) {
      timerRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % posts.length);
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, posts.length]);

  if (!posts || posts.length === 0) return null;

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      setIndex((prev) => (prev + 1) % posts.length);
    } else if (info.offset.x > swipeThreshold) {
      setIndex((prev) => (prev - 1 + posts.length) % posts.length);
    }
    setDragX(0);
  };

  const next = () => setIndex((prev) => (prev + 1) % posts.length);
  const prev = () => setIndex((prev) => (prev - 1 + posts.length) % posts.length);

  return (
    <section className="relative w-full py-24 overflow-hidden bg-black/40">
      <div className="container mx-auto px-6 mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold font-[var(--font-outfit)] mb-3 text-white">
              Latest <span className="gradient-text">Missions</span>
            </h2>
            <p className="text-[#64748b] text-xs md:text-sm uppercase tracking-[0.4em] font-black flex items-center justify-center md:justify-start gap-3">
              <span className="w-8 h-[1px] bg-[#64748b]/50" />
              Direct access interface // active
            </p>
         </div>
         <div className="flex gap-4">
            <button onClick={prev} className="w-14 h-14 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center hover:bg-[#a855f722] hover:border-[#a855f7] transition-all group">
              <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform text-white" />
            </button>
            <button onClick={next} className="w-14 h-14 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center hover:bg-[#a855f722] hover:border-[#a855f7] transition-all group">
              <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform text-white" />
            </button>
         </div>
      </div>

      <div 
        className="relative w-full h-[550px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div 
          className="relative w-full h-full flex items-center justify-center"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          onDrag={(e, info) => setDragX(info.offset.x)}
        >
          <AnimatePresence mode="popLayout">
            {posts.map((post, i) => {
              let position = i - index;
              if (position > posts.length / 2) position -= posts.length;
              if (position < -posts.length / 2) position += posts.length;

              const absPos = Math.abs(position);
              const isActive = position === 0;
              
              // Fading logic: 0: 1, 1: 0.8, 2: 0.5 (half faded), >2: 0
              let opacity = 1;
              if (absPos === 1) opacity = 0.7;
              if (absPos === 2) opacity = 0.4; // Half faded for the 3rd one in sequence (0, 1, 2)
              if (absPos > 2) opacity = 0;

              return (
                <motion.div
                  key={post.id}
                  style={{
                    perspective: 2000,
                  }}
                  initial={false}
                  animate={{
                    x: position * (typeof window !== 'undefined' && window.innerWidth < 768 ? 200 : 500) + dragX * 0.4,
                    scale: isActive ? 1.05 : 1 - (absPos * 0.15),
                    zIndex: 100 - absPos * 20,
                    opacity: opacity,
                    rotateY: position * -30 + dragX * -0.02,
                    filter: isActive ? "blur(0px)" : `blur(${absPos * 4}px)`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 24
                  }}
                  onClick={(e) => {
                    if (!isActive) {
                      e.preventDefault();
                      setIndex(i);
                    }
                  }}
                  onMouseEnter={() => {
                    if (!isActive) setIndex(i);
                  }}
                  className={`absolute w-[350px] md:w-[920px] h-[180px] md:h-[430px] rounded-[48px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.7)] border border-white/5 bg-[#0a0f1e]`}
                >
                  <Link href={`/blog/${post.slug}`} className={`w-full h-full block group relative ${!isActive ? 'pointer-events-none' : ''}`}>
                    {post.coverImage ? (
                      <img 
                        src={post.coverImage} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        alt="" 
                      />
                    ) : (
                      <div className="w-full h-full bg-[#111827] flex items-center justify-center">
                        <Newspaper className="w-24 h-24 text-white/5" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/40 to-transparent opacity-90" />
                    
                    <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-end">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#008fb3] text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20">
                          {post.category?.name || "INTEL"}
                        </span>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <h3 className="text-2xl md:text-5xl font-black text-white mb-8 leading-tight group-hover:text-[#00d4ff] transition-colors drop-shadow-2xl">
                        {post.title.replace(/<[^>]*>?/gm, "")}
                      </h3>
                      
                      {isActive && (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-6"
                        >
                          <div className="px-10 h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-xs font-black text-[#00d4ff] transition-all hover:bg-[#00d4ff] hover:text-black hover:border-transparent uppercase tracking-[0.3em] cursor-pointer">
                            Launch_Article
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
