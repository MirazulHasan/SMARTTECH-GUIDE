"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function TechBackground() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* Dynamic Grids */}
      <div className="absolute inset-0 bg-grid-primary opacity-[0.25]" />
      <div className="absolute inset-0 bg-dot-matrix opacity-[0.1]" />
      <div className="absolute inset-0 bg-scanline opacity-[0.03]" />

      {/* Floating Tech Dots */}
      {isMounted && [...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: i % 3 === 0 ? "#00f2ff" : i % 3 === 1 ? "#ff00ff" : "#f0f600",
            boxShadow: `0 0 10px ${i % 3 === 0 ? "#00f2ff" : i % 3 === 1 ? "#ff00ff" : "#f0f600"}`,
          }}
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.5,
            opacity: 0,
          }}
          animate={{
            y: [null, Math.random() * 100 + "%"],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Moving Light Rays */}
      <motion.div
        className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-tr from-[#00f2ff05] via-transparent to-[#ff00ff05] pointer-events-none"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Extra Depth Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#00f2ff08] rounded-full blur-[180px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-[#ff00ff08] rounded-full blur-[200px] animate-pulse-slow" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-[#00f2ff22] blur-sm animate-[scan_10s_linear_infinite]" />
    </div>
  );
}
