"use client";

import Navbar from "@/components/Navbar";
import SystemControls from "@/components/SystemControls";
import WeatherCard from "@/components/WeatherCard";
import ThemeToggle from "@/components/ThemeToggle";
import SplashScreen from "@/components/SplashScreen";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { SplashProvider, useSplash } from "@/context/SplashContext";

function SiteLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isBlogPost = pathname?.startsWith("/blog/");
  const [settings, setSettings] = useState<any>(null);
  const { isSplashDone, setIsSplashDone, splashKey } = useSplash();

  useEffect(() => {
    // If we enter the site from any subpage via direct URL or refresh, force home.
    if (pathname !== "/") {
      router.replace("/");
    }

    fetch("/api/settings")
      .then(r => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Splash screen shown once on every page load or via trigger */}
      <SplashScreen
        key={`splash-${splashKey}`}
        siteName={settings?.siteName || "SMART TECH"}
        siteTitle={settings?.siteTitle || "GUIDE"}
        logoUrl={settings?.logoUrl}
        splashTopLeft={settings?.splashTopLeft}
        splashTopRight={settings?.splashTopRight}
        splashBottomLeft={settings?.splashBottomLeft}
        splashBottomRight={settings?.splashBottomRight}
        splashLogs={settings?.splashLogs}
        onComplete={() => setIsSplashDone(true)}
      />

      <motion.div
        key={`content-${splashKey}`}
        initial={{ opacity: 0 }}
        animate={isSplashDone ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Public site header — weather, navbar, theme toggle */}
        {!isBlogPost && (
          <header className="fixed top-8 left-0 w-full z-[90000] pointer-events-none px-4">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full">
              {/* Left: WeatherCard */}
              <div className="flex justify-center pointer-events-auto origin-center transform scale-[0.7] md:scale-100 relative z-[90001]">
                <WeatherCard />
              </div>

              {/* Center: System Navbar */}
              <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-full border border-foreground/10 bg-background/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.02)] relative z-[90001]">
                <Navbar />
                <div className="w-[1px] h-8 bg-foreground/10 mx-1 hidden sm:block" />
                <SystemControls />
              </div>

              {/* Right: Theme Toggle */}
              <div className="flex justify-center pointer-events-auto relative z-[90001]">
                <ThemeToggle />
              </div>
            </div>
          </header>
        )}

        {children}
      </motion.div>
    </>
  );
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SplashProvider>
      <SiteLayoutContent>{children}</SiteLayoutContent>
    </SplashProvider>
  );
}
