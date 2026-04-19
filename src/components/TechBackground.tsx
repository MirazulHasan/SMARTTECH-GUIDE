"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Particle = ({ i }: { i: number }) => {
  const [initialPos] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5
  });

  return (
    <motion.div
      className="absolute bg-[#00f2ff] rounded-full pointer-events-none opacity-20"
      style={{
        width: initialPos.size,
        height: initialPos.size,
        left: `${initialPos.x}%`,
        top: `${initialPos.y}%`,
        boxShadow: "0 0 5px #00f2ff",
      }}
      animate={{
        opacity: [0.1, 0.4, 0.1],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: initialPos.duration,
        repeat: Infinity,
        delay: initialPos.delay,
        ease: "easeInOut",
      }}
    />
  );
};

// SVG Circuit Path Pulse Component
const PulsePath = ({ d, duration = 4, delay = 0 }: { d: string, duration?: number, delay?: number }) => (
  <g>
    <path
      d={d}
      fill="none"
      stroke="#00f2ff"
      strokeWidth="1.5"
      className="opacity-10"
    />
    <motion.path
      d={d}
      fill="none"
      stroke="#00f2ff"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
      animate={{
        pathLength: [0, 0.2, 0],
        pathOffset: [0, 1.2],
        opacity: [0, 1, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "linear",
      }}
      style={{ filter: "drop-shadow(0 0 4px #00f2ff)" }}
    />
  </g>
);

export default function TechBackground() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="fixed inset-0 bg-black" />;

  return (
    <div className="fixed inset-0 z-[-5] pointer-events-none overflow-hidden select-none bg-transparent transition-colors duration-500">
      {/* Base Cyber Gradient (Magenta/Deep Purple) */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: 'var(--bg-glow-opacity)',
          background: "radial-gradient(circle at center, var(--color-secondary) 0%, var(--background) 40%, transparent 100%)"
        }}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.05] bg-grid-primary" />

      {/* Tech Grid Geometric Overlay (Shattered Glass feel) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <defs>
          <pattern id="geometric" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M0 0 L100 0 L80 100 L0 100 Z" fill="none" stroke="#00f2ff" strokeWidth="1" opacity="0.3" />
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="#00f2ff" strokeWidth="0.5" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geometric)" />
      </svg>

      {/* SVG Circuit Layers with Pulses */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Top Circuits */}
        <PulsePath d="M-10 50 L100 50 L130 80 L300 80" duration={6} />
        <PulsePath d="M200 -10 L200 120 L230 150 L230 300" duration={8} delay={1} />
        <PulsePath d="M800 -10 L800 60 L750 110 L750 400" duration={10} delay={2} />
        <PulsePath d="M1200 200 L1150 250 L800 250" duration={7} delay={0.5} />

        {/* Bottom Circuits */}
        <PulsePath d="M-50 900 L200 900 L250 850 L500 850" duration={9} delay={3} />
        <PulsePath d="M1500 800 L1300 800 L1250 850 L1250 1100" duration={5} delay={1.5} />
      </svg>

      {/* Digital Dust / Particles */}
      {[...Array(60)].map((_, i) => (
        <Particle key={i} i={i} />
      ))}

      {/* Global Ambient Scanline */}
      <div className="absolute inset-0 z-10 bg-scanline pointer-events-none opacity-[0.03]" />

      {/* Global Website HUD Frame Border */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible opacity-[0.15] dark:opacity-50 text-foreground transition-colors duration-500">
        <path
          d="M 50 100 L 150 100 L 180 130 L 400 130 L 430 100 L 1200 100 L 1250 150 L 1800 150 M 50 800 L 150 800 L 180 770 L 400 770 L 430 800 L 1200 800 L 1250 750 L 1800 750"
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="opacity-40 flex"
        />
        <motion.path
          d="M 50 100 L 150 100 L 180 130 L 400 130 L 430 100 L 1200 100 L 1250 150 L 1800 150"
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 4px var(--foreground))" }}
        />
        <motion.path
          d="M 50 800 L 150 800 L 180 770 L 400 770 L 430 800 L 1200 800 L 1250 750 L 1800 750"
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          style={{ filter: "drop-shadow(0 0 4px var(--foreground))" }}
        />
      </svg>
    </div>
  );
}
