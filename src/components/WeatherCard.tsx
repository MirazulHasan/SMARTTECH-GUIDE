"use client";

import React, { useEffect, useState } from "react";
import { Cloud, Droplets, Wind, Sun, MapPin, Search, RefreshCw, Loader2, Thermometer, CloudRain, CloudLightning, Snowflake, CloudOff } from "lucide-react";
import { toast } from "sonner";

/**
 * Cyberpunk Weather Card
 * Inspired by mahiatlinux on Uiverse.io
 * Adapted for SmartTech Guide with high-fidelity aesthetics.
 */
const WeatherCard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weather, setWeather] = useState<any>(null);
  const [locationName, setLocationName] = useState("LOCATING...");

  const fetchWeather = async () => {
    try {
      setRefreshing(true);
      
      // Get Geolocation
      const position: any = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Reverse Geocode for City Name
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      const geoData = await geoRes.json();
      const city = geoData.address.city || geoData.address.town || geoData.address.suburb || "USERL_COORD";
      const district = geoData.address.suburb || geoData.address.neighbourhood || "SEC_X";
      setLocationName(`${city.toUpperCase()} // ${district.toUpperCase()}`);

      // Get Weather Data (Open-Meteo)
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto`);
      const weatherData = await weatherRes.json();
      setWeather(weatherData.current);
      
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error(err);
      toast.error("HUD: Failed to sync weather data.");
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="weather-icon text-amber-400 animate-pulse" size={42} />;
    if (code <= 3) return <Cloud className="weather-icon text-[#00d4ff] animate-pulse" size={42} />;
    if (code <= 48) return <Wind className="weather-icon text-slate-400" size={42} />;
    if (code <= 67) return <CloudRain className="weather-icon text-[#00d4ff]" size={42} />;
    if (code <= 77) return <Snowflake className="weather-icon text-white" size={42} />;
    if (code <= 99) return <CloudLightning className="weather-icon text-yellow-500" size={42} />;
    return <CloudOff className="weather-icon text-[#64748b]" size={42} />;
  };

  return (
    <div className="weather-card-wrapper pointer-events-none">
      <div className="card-instance pointer-events-auto group">
        {/* Main Front Card */}
        <div className="card-front glass-card">
          <div className="weather-header flex justify-between items-center">
            <span className="live-badge">
              <span className={`pulse-dot ${refreshing ? 'animate-ping' : ''}`}></span>
              LIVE_SYSTEM
            </span>
            <button 
              onClick={fetchWeather}
              disabled={refreshing}
              className={`p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-primary transition-all ${refreshing ? 'animate-spin opacity-50' : 'hover:rotate-180'}`}
              title="SYNC_ENVIRONMENT"
            >
              <RefreshCw size={12} />
            </button>
          </div>
          
          <div className="weather-info mt-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-2 h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
                <span className="text-[8px] font-black tracking-widest text-primary mt-2">SYNCING_ATMOSPHERE...</span>
              </div>
            ) : (
              <>
                <div className="temp-section flex items-start">
                  <span className="temperature">{Math.round(weather?.temperature_2m || 0)}°</span>
                  <div className="ml-auto">
                    {getWeatherIcon(weather?.weather_code)}
                  </div>
                </div>
                
                <div className="location-section flex items-center gap-2 mt-1">
                  <MapPin size={12} className="text-primary" />
                  <span className="location-text">{locationName}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hidden Details Card (Expands on Hover) */}
        {!loading && (
          <div className="card-back glass-card-secondary">
            <div className="metric-grid">
              <div className="metric-box border-r border-[#00f2ff22]">
                <span className="metric-label">HUMIDITY</span>
                <div className="metric-value text-[#00d4ff]">
                  <Droplets size={14} />
                  {weather?.relative_humidity_2m}%
                </div>
              </div>
              <div className="metric-box">
                <span className="metric-label">WIND_SPD</span>
                <div className="metric-value text-purple-400">
                  <Wind size={14} />
                  {weather?.wind_speed_10m} <span className="text-[8px] font-light">KM/H</span>
                </div>
              </div>
            </div>
            
            <div className="detail-footer px-6 py-4 flex items-center justify-between">
              <div className="aqi-stat">
                <span className="metric-label">PRECIPIT.</span>
                <div className="font-bold text-lg font-[var(--font-space)] text-foreground">{weather?.precipitation}mm</div>
              </div>
              <div className="realfeel-stat text-right">
                <span className="metric-label">REAL FEEL</span>
                <div className="font-bold text-lg font-[var(--font-space)] text-foreground">{Math.round(weather?.apparent_temperature || 0)}°C</div>
              </div>
            </div>

            <div className="status-banner">
              <span>ATMOSPHERE: {weather?.weather_code === 0 ? "CLEAR_SKIES" : "MONITORING..."} // {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .weather-card-wrapper {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          perspective: 1200px;
        }

        .card-instance {
          position: relative;
          width: 280px;
          height: 150px;
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .card-front {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 24px;
          padding: 1.5rem;
          z-index: 20;
          overflow: hidden;
          background: var(--color-card-bg);
          backdrop-filter: blur(16px);
          border: 2px solid var(--color-primary);
          box-shadow: 0 0 20px rgba(0, 242, 255, 0.3),
                      inset 0 0 15px rgba(0, 242, 255, 0.1);
          animation: neon-flicker 4s infinite;
          transition: all 0.4s ease;
          cursor: pointer;
        }

        .card-back {
          position: absolute;
          top: 0px;
          left: 8px;
          right: 8px;
          height: 140px;
          border-radius: 30px;
          background: var(--color-card-bg);
          z-index: 1;
          opacity: 0;
          transform: translateY(0);
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
        }

        /* Hover States */
        .card-instance:hover .card-front {
          border-color: var(--color-primary);
          box-shadow: 0 0 30px rgba(0, 242, 255, 0.2);
          transform: translateY(-5px);
        }

        .card-instance:hover .card-back {
          height: 260px;
          opacity: 1;
          transform: translateY(16px);
          z-index: 15; 
          border-color: var(--color-primary);
          box-shadow: 0 25px 50px rgba(0, 242, 255, 0.2);
        }

        .weather-header {
          display: flex;
          justify-content: flex-end;
        }

        .live-badge {
          font-size: 0.6rem;
          font-weight: 900;
          letter-spacing: 0.2em;
          color: var(--color-primary);
          background: rgba(0, 242, 255, 0.1);
          padding: 4px 10px;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          background: var(--color-primary);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .temperature {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1;
          font-family: var(--font-space);
          color: var(--foreground);
          text-shadow: 0 0 20px rgba(0, 242, 255, 0.4);
        }

        .location-text {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--text-muted);
          font-family: var(--font-space);
        }

        .metric-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin-top: 2rem;
          padding: 1.5rem;
          background: rgba(128, 128, 128, 0.05);
          border-bottom: 1px solid var(--glass-border);
        }

        .metric-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .metric-label {
          font-size: 0.55rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: var(--text-muted);
          text-transform: uppercase;
          font-family: var(--font-space);
        }

        .metric-value {
          font-size: 1.1rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-space);
        }

        .status-banner {
          margin-top: auto;
          height: 40px;
          background: var(--color-primary);
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 900;
          font-family: var(--font-space);
          letter-spacing: 0.1em;
          border-bottom-left-radius: 28px;
          border-bottom-right-radius: 28px;
          clip-path: polygon(0 25%, 100% 0, 100% 100%, 0 100%);
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 242, 255, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(0, 242, 255, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 242, 255, 0); }
        }

        @media (max-width: 640px) {
          .weather-card-wrapper {
            top: 6rem;
            left: 1rem;
            transform: scale(0.8);
            transform-origin: top left;
          }
        }

        :global(.weather-icon) {
          filter: drop-shadow(0 0 15px var(--color-accent));
        }

        .glass-card {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
      `}</style>
    </div>
  );
};

export default WeatherCard;
