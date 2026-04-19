"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface SplashContextType {
  triggerSplash: () => void;
  isSplashDone: boolean;
  setIsSplashDone: (done: boolean) => void;
  splashKey: number;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [isSplashDone, setIsSplashDone] = useState(false);
  const [splashKey, setSplashKey] = useState(0);

  const triggerSplash = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setIsSplashDone(false);
    setSplashKey(prev => prev + 1);
  }, []);

  return (
    <SplashContext.Provider value={{ triggerSplash, isSplashDone, setIsSplashDone, splashKey }}>
      {children}
    </SplashContext.Provider>
  );
}

export function useSplash() {
  const context = useContext(SplashContext);
  if (context === undefined) {
    throw new Error("useSplash must be used within a SplashProvider");
  }
  return context;
}
