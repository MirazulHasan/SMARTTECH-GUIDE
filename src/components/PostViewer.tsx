"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { usePost } from "@/context/PostContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Loader2 } from "lucide-react";

export default function PostViewer() {
  const { activePostSlug, closePost } = usePost();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (activePostSlug) {
      setLoading(true);
      setPost(null);
      fetch(`/api/posts/slug/${activePostSlug}`)
        .then((res) => res.json())
        .then((data) => {
          setPost(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setPost(null);
    }
  }, [activePostSlug]);

  // Close on Escape key
  useEffect(() => {
    if (!activePostSlug) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePost();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activePostSlug, closePost]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (activePostSlug) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activePostSlug]);

  if (!mounted) return null;

  const content = (
    <AnimatePresence>
      {activePostSlug && (
        <motion.div
          ref={overlayRef}
          key="post-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200000,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)", // For Safari
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closePost();
          }}
        >
          {/* Card */}
          <motion.div
            key="post-card"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "100%",
              maxWidth: "72rem",
              height: "calc(100vh - 4rem)",
              borderRadius: "1.5rem",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Card Header */}
            <div className="flex-shrink-0 flex items-center gap-4 px-6 py-4 bg-background/80 backdrop-blur-2xl border-b border-foreground/5">
              <button
                onClick={closePost}
                className="flex items-center gap-2 px-5 py-2.5 bg-foreground/5 border border-foreground/10 rounded-full text-foreground/80 hover:text-foreground hover:border-foreground/30 transition-all group flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] font-[var(--font-space)]">Return</span>
              </button>
              <div className="h-4 w-px bg-foreground/10 flex-shrink-0" />
              {post && !loading && (
                <div
                  className="text-sm font-semibold text-foreground/50 truncate"
                  dangerouslySetInnerHTML={{ __html: post.title }}
                />
              )}
            </div>

            {/* Scrollable article content — rendered in an iframe to isolate CSS */}
            <div style={{ flexGrow: 1, overflow: "hidden" }}>
              {loading ? (
                <div className="min-h-[400px] flex items-center justify-center" style={{ background: "var(--background)" }}>
                  <Loader2 className="w-10 h-10 text-[#00f2ff] animate-spin opacity-50" />
                </div>
              ) : post ? (
                <iframe
                  srcDoc={post.content}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    display: "block",
                  }}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
                  title={post.title || "Article"}
                />
              ) : (
                <div className="min-h-[400px] flex items-center justify-center text-foreground/40" style={{ background: "var(--background)" }}>
                  Post not found
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
