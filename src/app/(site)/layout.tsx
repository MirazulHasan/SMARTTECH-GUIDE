import Navbar from "@/components/Navbar";
import SystemControls from "@/components/SystemControls";
import WeatherCard from "@/components/WeatherCard";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Public site header — weather, navbar, theme toggle */}
      <header className="fixed top-8 left-0 w-full z-[9999] pointer-events-none px-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full">
          {/* Left: WeatherCard */}
          <div className="flex justify-center pointer-events-auto origin-center transform scale-[0.7] md:scale-100">
            <WeatherCard />
          </div>

          {/* Center: System Navbar */}
          <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-full border border-white/10 bg-[#0a0a1a]/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.02)]">
            <Navbar />
            <div className="w-[1px] h-8 bg-white/10 mx-1 hidden sm:block" />
            <SystemControls />
          </div>

          {/* Right: Theme Toggle */}
          <div className="flex justify-center pointer-events-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {children}
    </>
  );
}
