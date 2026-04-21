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
  const [dragProgress, setDragProgress] = useState(0);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX.current !== null) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const delta = clientX - dragStartX.current;
      
      // Update visual drag progress
      setDragProgress(delta);

      if (Math.abs(delta) > 30) {
        isDragging.current = true;
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX.current !== null) {
      if (isDragging.current) {
        const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
        const delta = clientX - dragStartX.current;
        
        // Calculate the relative index offset based on drag distance
        const dragOffset = delta / 520;
        
        // Snap to the NEAREST card
        const newIndex = Math.round(current - dragOffset);
        goTo(newIndex);
      }
    }
    
    dragStartX.current = null;
    setDragProgress(0); // Reset visual offset

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
      className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden bg-transparent transition-colors duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Translucent Background Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-500 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 via-transparent to-foreground/5" />
      </div>

      {/* Subtle Corner Accents (Reduced) */}
      <div className="absolute inset-0 z-20 pointer-events-none px-4 md:px-20 py-20 opacity-20">
        <div className="relative w-full h-full">
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-foreground/10" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-foreground/10" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-foreground/10" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-foreground/10" />
        </div>
      </div>

      <div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center"
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
        <div className="mb-8 text-center relative z-20 pointer-events-none">
          <h2 className="text-2xl md:text-4xl font-black text-foreground tracking-[0.4em] uppercase italic">
            FREE_GAMES
          </h2>
          <div className="h-0.5 w-24 bg-[#00f2ff] mx-auto mt-3 shadow-[0_0_15px_#00f2ff] opacity-40" />
        </div>

        <div
          className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-visible pointer-events-none"
          style={{
            perspective: "2000px",
            transformStyle: "preserve-3d",
          }}
        >
          {posts.map((post, idx) => {
            // Real-time Dynamic Wrapping Physics
            const dragOffset = dragProgress / 520;
            const rawOffset = idx - current + dragOffset;
            
            // Continuous Wrapping Logic
            let progressOffset = rawOffset;
            while (progressOffset > total / 2) progressOffset -= total;
            while (progressOffset < -total / 2) progressOffset += total;

            const isActive = Math.abs(progressOffset) < 0.5;
            // Buffer increased to ensure no popping during fast drags
            const isVisible = Math.abs(progressOffset) <= 3; 

            if (!isVisible) return null;

            /* ── Infinite Continuous Physics ───────────────── */
            const translateX = progressOffset * 520; 
            const translateZ = Math.abs(progressOffset) * -400;
            const rotateY = progressOffset * -15; 
            const scale = 1 - Math.abs(progressOffset) * 0.15;
            const opacity = Math.max(0, 1 - Math.abs(progressOffset) * 0.45);
            const zIndex = 100 - Math.round(Math.abs(progressOffset) * 10);

            return (
              <motion.div
                key={post.id}
                initial={false}
                animate={{
                  x: translateX,
                  z: translateZ,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                }}
                transition={isDragging.current ? { type: "tween", duration: 0 } : {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  opacity: { duration: 0.4 }
                }}
                className="absolute flex flex-col items-center pointer-events-none"
                style={{
                  zIndex,
                  width: "460px",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* The Card - Actual Hit Target */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isDragging.current) return;
                    if (Math.abs(progressOffset) > 0.1) goTo(idx);
                    else openPost(post.slug);
                  }}
                  className="relative w-[340px] md:w-[460px] h-[160px] md:h-[215px] rounded-2xl overflow-hidden shadow-2xl border border-white/5 group bg-card pointer-events-auto cursor-pointer"
                >
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={post.title}
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                      <Newspaper className="w-16 h-16 text-white/5" />
                    </div>
                  )}

                  {/* Title Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-gradient-to-t from-black via-black/40 to-transparent">
                    <h3 className="text-white text-xs md:text-xl font-black uppercase tracking-tight line-clamp-1 drop-shadow-md">
                      {post.title}
                    </h3>
                  </div>

                  {!isActive && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                  )}
                </div>
              </motion.div>
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
