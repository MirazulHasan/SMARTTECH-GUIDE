"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  siteName?: string;
  siteTitle?: string;
  logoUrl?: string; // Kept for prop parity, but we use text for the cyber-glitch effect
  splashTopLeft?: string;
  splashTopRight?: string;
  splashBottomLeft?: string;
  splashBottomRight?: string;
  splashLogs?: string;
  onComplete?: () => void;
}

export default function SplashScreen({
  siteName = "SMART TECH",
  siteTitle = "GUIDE",
  splashTopLeft = "SYS.VER.2.0.4 // BOOT_SEQ",
  splashTopRight = "AUTH: OVERRIDE_ACTV",
  splashBottomLeft = "CPU: OVERRIDE",
  splashBottomRight = "SEC: UNLOCKED",
  onComplete,
  splashLogs = '[\n  "ESTABLISHING SECURE CONNECTION...",\n  "BYPASSING MAINFRAME FIREWALL...",\n  "DECRYPTING DATABASE OBJECTS...",\n  "MOUNTING USER INTERFACE...",\n  "SYSTEM READY."\n]',
}: SplashScreenProps) {
  const [show, setShow] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logText, setLogText] = useState("INITIALIZING NEURAL NET...");
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    document.body.style.overflow = "hidden";

    let logs = [];
    try {
      logs = JSON.parse(splashLogs);
      if (!Array.isArray(logs) || logs.length === 0) throw new Error();
    } catch {
      logs = [
        "ESTABLISHING SECURE CONNECTION...",
        "BYPASSING MAINFRAME FIREWALL...",
        "DECRYPTING DATABASE OBJECTS...",
        "MOUNTING USER INTERFACE...",
        "SYSTEM READY."
      ];
    }
    setLogText(logs[0] || "INITIALIZING NEURAL NET...");

    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < logs.length) {
        setLogText(logs[currentLog]);
        currentLog++;
      }
    }, 450);

    // Rapid, jumpy progress bar charging
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + Math.floor(Math.random() * 18) + 4;
      });
    }, 120);

    // Random visual glitch triggers
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 1500);

    // Unmount after sequence
    const unmountTimer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "auto";
      if (onComplete) onComplete();
    }, 3200);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
      clearInterval(glitchInterval);
      clearTimeout(unmountTimer);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "brightness(2) blur(10px)",
            transition: { duration: 0.4, ease: "easeIn" },
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            backgroundColor: "var(--background)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "all",
            fontFamily: "monospace",
            color: "var(--foreground)",
            overflow: "hidden",
          }}
        >
          {/* --- LIGHT THEME: Vintage White CRT --- */}
          {/* Vintage Grid */}
          <div
            className="block dark:hidden"
            style={{
              position: "absolute",
              inset: 0,
              backgroundSize: "40px 40px",
              backgroundImage:
                "linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)",
              transform:
                "perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Vintage Scanlines */}
          <div
            className="block dark:hidden"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />

          {/* Vintage Vignette */}
          <div
            className="block dark:hidden"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at center, transparent 30%, rgba(180, 175, 170, 0.3) 100%)",
              pointerEvents: "none",
              zIndex: 9,
            }}
          />

          {/* --- DARK THEME: Neon Cyberpunk CRT --- */}
          {/* CyberGrid Background */}
          <div
            className="hidden dark:block"
            style={{
              position: "absolute",
              inset: 0,
              backgroundSize: "40px 40px",
              backgroundImage:
                "linear-gradient(to right, rgba(0, 212, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 212, 255, 0.05) 1px, transparent 1px)",
              transform:
                "perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* CRT Scanlines Overlay */}
          <div
            className="hidden dark:block"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 212, 255, 0.04) 2px, rgba(0, 212, 255, 0.04) 4px)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />

          {/* CRT Vignette */}
          <div
            className="hidden dark:block"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at center, transparent 20%, #050914 90%)",
              pointerEvents: "none",
              zIndex: 9,
            }}
          />

          <div
            style={{
              zIndex: 5,
              width: "100%",
              maxWidth: "700px",
              padding: "0 30px",
              position: "relative",
            }}
          >
            {/* Top decorative elements */}
            <div
              className="hidden dark:flex justify-between"
              style={{
                fontSize: "11px",
                opacity: 0.6,
                marginBottom: "60px",
                letterSpacing: "2px",
              }}
            >
              <span>{splashTopLeft}</span>
              <span style={{ color: glitchActive ? "#ff00ff" : "#00d4ff" }}>
                {splashTopRight}
              </span>
            </div>

            {/* Main Glitch Title */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "60px",
                position: "relative",
              }}
            >
              <motion.h1
                animate={{ x: glitchActive ? [-8, 8, -8, 0] : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontSize: "clamp(3.5rem, 10vw, 6rem)",
                  fontWeight: 900,
                  lineHeight: 1,
                  textTransform: "uppercase",
                  color: "#fff",
                  textShadow: glitchActive
                    ? "4px 0px 0px rgba(255,0,255,0.8), -4px 0px 0px rgba(0,212,255,0.8)"
                    : "0 0 20px rgba(0,212,255,0.5), 2px 2px 0px rgba(255,0,255,0.5)",
                  fontFamily: "var(--font-space)",
                  margin: 0,
                  fontStyle: "italic",
                  paddingRight: "10px",
                }}
              >
                {siteName}
              </motion.h1>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  fontWeight: 700,
                  color: "#ff00ff",
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                  margin: 0,
                  fontFamily: "var(--font-space)",
                  textShadow: "0 0 15px rgba(255,0,255,0.6)",
                  opacity: 0.9,
                }}
              >
                {siteTitle}
              </h2>
              <div
                style={{
                  position: "absolute",
                  right: "-10px",
                  top: "10px",
                  width: "4px",
                  height: "80%",
                  background: "#00d4ff",
                  boxShadow: "0 0 10px #00d4ff",
                }}
              />
            </div>

            {/* Cyberpunk Loading Bar */}
            <div
              style={{
                marginBottom: "30px",
                background: "rgba(0,212,255,0.05)",
                padding: "20px",
                border: "1px solid rgba(0,212,255,0.2)",
                borderLeft: "4px solid #00d4ff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "13px",
                  marginBottom: "12px",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                }}
              >
                <span>
                  <span style={{ marginRight: "8px", color: "#ff00ff" }}>▶</span>
                  {logText}
                </span>
                <span style={{ color: progress >= 100 ? "#ff00ff" : "#00d4ff" }}>
                  {Math.min(progress, 100)}%
                </span>
              </div>

              <div
                style={{
                  height: "24px",
                  width: "100%",
                  border: "1px solid rgba(0,212,255,0.4)",
                  padding: "3px",
                  position: "relative",
                  background: "#03060c",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: progress >= 100 ? "#ff00ff" : "#00d4ff",
                    boxShadow:
                      progress >= 100 ? "0 0 15px #ff00ff" : "0 0 15px #00d4ff",
                    transition: "width 0.15s ease-out, background-color 0.3s ease",
                  }}
                />

                {/* Visual Segments slicing the bar */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "repeating-linear-gradient(90deg, transparent, transparent 20px, #03060c 20px, #03060c 26px)",
                  }}
                />
              </div>
            </div>

            {/* Bottom Tech Stats */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                opacity: 0.6,
                letterSpacing: "1px",
              }}
            >
              <div style={{ display: "flex", gap: "30px" }}>
                <span>
                  {splashBottomLeft.split(':')[0]}: <span style={{ color: "#ff00ff" }}>{splashBottomLeft.substring(splashBottomLeft.indexOf(':') + 1) || "OVERRIDE"}</span>
                </span>
                <span>
                  MEM: 0x
                  {Math.floor(progress * 42.5)
                    .toString(16)
                    .toUpperCase()
                    .padStart(4, "0")}
                </span>
              </div>
              <span style={{ color: progress >= 100 ? "#ff00ff" : "#00d4ff" }}>
                {progress >= 100 ? splashBottomRight : splashBottomRight.replace('UNLOCKED', 'LOCKED').replace('ACTIVATED', 'DEACTIVATED').replace('ONLINE', 'OFFLINE')}
              </span>
            </div>
          </div>

          {/* Random floating hex codes for deeper cyberpunk vibe */}
          {isMounted && [...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0, 0.4, 0],
                y: [100, -100],
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                delay: i * 0.3,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                left: `${10 + i * 11}%`,
                bottom: "0%",
                fontSize: "12px",
                color: i % 2 === 0 ? "#00d4ff" : "#ff00ff",
                pointerEvents: "none",
                opacity: 0,
                zIndex: 2,
              }}
            >
              0x{Math.floor(Math.random() * 16777215).toString(16).toUpperCase()}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
