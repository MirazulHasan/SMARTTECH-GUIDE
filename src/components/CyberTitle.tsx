"use client";

import { motion } from "framer-motion";

interface CyberTitleProps {
  siteName?: string;
  siteTitle?: string;
}

export default function CyberTitle({ siteName = "SMART", siteTitle = "GUIDE" }: CyberTitleProps) {
  const line1 = siteName;
  const line2 = "TECH ";
  const line3 = siteTitle;

  // Animation variants for drawing effect
  const drawAction = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.5, bounce: 0 },
        opacity: { duration: 0.01 },
      },
    },
  };

  return (
    <div className="relative group cursor-default">
      <h1 className="text-6xl md:text-9xl font-black tracking-tighter font-[var(--font-space)] leading-none italic uppercase relative flex items-center justify-center flex-wrap gap-x-4">
        {/* The Outline Drawing Layer (SVG) */}
        <svg
          viewBox="0 0 800 120"
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        >
          <motion.text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            stroke="#00f2ff"
            strokeWidth="1.5"
            strokeDasharray="10 5"
            fill="none"
            initial={{ strokeDashoffset: 1000, opacity: 0 }}
            animate={{ 
              strokeDashoffset: 0, 
              opacity: [0.1, 0.4, 0.1, 0.3, 0.1, 0.5, 0.2] 
            }}
            transition={{ 
              strokeDashoffset: { duration: 4, repeat: Infinity, ease: "linear" },
              opacity: { duration: 2, repeat: Infinity, times: [0, 0.1, 0.2, 0.3, 0.6, 0.7, 1] }
            }}
            className="text-8xl md:text-9xl font-black italic uppercase font-[var(--font-space)]"
          >
            {line1}{line2}{line3}
          </motion.text>
        </svg>

        {/* The Actual Text Layer with Glitch Reveal */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative inline-block"
        >
          {line1}
        </motion.span>
        
        <motion.span
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-[#00f2ff] drop-shadow-[0_0_15px_#00f2ff] relative"
        >
          {line2}
          <motion.div 
            className="absolute -bottom-2 left-0 h-1 bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 1.2 }}
          />
        </motion.span>

        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="gradient-text italic"
        >
          {line3}
        </motion.span>
      </h1>
      
    </div>
  );
}
