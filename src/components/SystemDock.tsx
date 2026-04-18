"use client";

import WeatherCard from "./WeatherCard";
import ThemeToggle from "./ThemeToggle";

export default function SystemDock() {
  return (
    <div className="fixed bottom-8 left-8 z-[9999] flex items-end gap-6 pointer-events-none">
      <div className="pointer-events-auto">
        <WeatherCard />
      </div>
      <div className="pointer-events-auto pb-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
