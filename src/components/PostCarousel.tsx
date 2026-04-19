"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { usePost } from "@/context/PostContext";
import { Newspaper } from "lucide-react";

export default function PostCarousel({ posts }: { posts: any[] }) {
  const { openPost } = usePost();
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const total = posts.length;

  const goTo = useCallback(
    (idx: number) => {
      setCurrent(((idx % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-play logic
  useEffect(() => {
    if (isHovered || total === 0) return;
    timerRef.current = setTimeout(next, 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, isHovered, next, total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  // Sensitive mouse drag
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    dragStartX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    isDragging.current = false;
  };
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX.current !== null) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      if (Math.abs(clientX - dragStartX.current) > 10) {
        isDragging.current = true;
      }
    }
  };
  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX.current !== null && isDragging.current) {
      // For touchend, clientX is in changedTouches
      const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
      const delta = clientX - dragStartX.current;
      if (delta < -20) next();
      else if (delta > 20) prev();
    }
    dragStartX.current = null;

    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  const handleMouseLeaveList = () => {
    if (isDragging.current) {
      dragStartX.current = null;
      setTimeout(() => {
        isDragging.current = false;
      }, 50);
    }
  };

  if (!posts || total === 0) return null;

  const activePost = posts[current];

  return (
    <section
      className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden bg-background transition-colors duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Blurred Background with Fade Borders */}
      <div className="absolute inset-0 z-0 bg-background pointer-events-none transition-colors duration-500">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="absolute inset-0 bg-grid-primary opacity-[0.05]" />
      </div>

      {/* Cyber Corner Accents */}
      <div className="absolute inset-0 z-20 pointer-events-none px-4 md:px-20 py-20">
        <div className="relative w-full h-full">
           {/* Top Left */}
           <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#00f2ff] opacity-40" />
           {/* Top Right */}
           <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#00f2ff] opacity-40" />
           {/* Bottom Left */}
           <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#00f2ff] opacity-40" />
           {/* Bottom Right */}
           <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#00f2ff] opacity-40" />
           
           {/* Animated Pulse Accents */}
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: [0.2, 0.6, 0.2] }}
             transition={{ duration: 3, repeat: Infinity }}
             className="absolute top-0 left-0 w-32 h-32 border-t border-l border-[#00f2ff] opacity-20 blur-[1px]" 
           />
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: [0.2, 0.6, 0.2] }}
             transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
             className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-[#00f2ff] opacity-20 blur-[1px]" 
           />
        </div>
      </div>

      <div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center max-w-7xl mx-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeaveList}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        style={{
          cursor: isDragging.current ? "grabbing" : "grab",
          userSelect: "none",
        }}
      >
        <div className="mb-20 text-center relative z-20">
          <h2 className="text-3xl md:text-6xl font-black gradient-text tracking-[0.3em] uppercase italic drop-shadow-[0_0_20px_rgba(0,242,255,0.2)] dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            FREE GAMES
          </h2>
          <div className="h-1.5 w-48 bg-[#a855f7] mx-auto mt-4 shadow-[0_0_20px_#a855f7] skew-x-[-20deg]" />
        </div>

        <div
          className="relative w-full h-[300px] flex items-center justify-center"
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
        >
          {posts.map((post, idx) => {
            const offset = idx - current;
            const wrappedOffset = offset > total / 2 ? offset - total : offset < -total / 2 ? offset + total : offset;

            const isActive = wrappedOffset === 0;
            const isVisible = Math.abs(wrappedOffset) <= 3;

            if (!isVisible) return null;

            /* ── Swiper Coverflow Physics ───────────────── */
            const translateX = wrappedOffset * 50;  // Tighter overlap
            const rotateY = wrappedOffset * -50;    // Deep 3D curve
            const translateZ = Math.abs(wrappedOffset) * -150; // Push inactive cards deep into the background
            const scale = isActive ? 1 : 0.9;
            const opacity = isActive ? 1 : 0.4;
            const blurPx = isActive ? 0 : 4;
            const zIndex = isActive ? 20 : 10 - Math.abs(wrappedOffset);

            return (
              <div
                key={post.id}
                onClick={(e) => {
                  if (isDragging.current) e.preventDefault();
                  else if (!isActive) goTo(idx);
                }}
                className={`absolute w-[320px] md:w-[460px] h-[150px] md:h-[215px] rounded-3xl overflow-hidden bg-card shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-foreground/5`}
                style={{
                  transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  filter: blurPx > 0 ? `blur(${blurPx}px) brightness(0.5)` : "brightness(1)",
                  zIndex,
                  transition: "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.8s ease, filter 0.8s ease",
                  transformOrigin: "center center",
                  transformStyle: "preserve-3d",
                }}
              >
                <div className={`w-full h-full block group relative rounded-3xl overflow-hidden ${!isActive ? 'pointer-events-none' : ''}`}>
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      alt=""
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#111827] flex items-center justify-center">
                      <Newspaper className="w-24 h-24 text-white/5" />
                    </div>
                  )}

                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 transition-opacity duration-300 pointer-events-none" />
                  )}

                  <div className="absolute inset-0 pb-8 flex flex-col justify-end items-center pointer-events-none">
                    {isActive && (
                      <div className="pointer-events-auto">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            openPost(activePost.slug);
                          }}
                          style={{
                            animation: "buttonFadeIn 0.3s ease forwards"
                          }}
                          className="bg-[#0b84f3] text-white px-8 py-2 md:py-2.5 text-xs md:text-sm font-semibold hover:bg-[#096dd0] transition-colors"
                        >
                          Read more
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes bgFadeIn {
          from { opacity: 0; }
          to { opacity: 0.2; }
        }
        @keyframes buttonFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
