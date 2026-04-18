"use client";

import React from "react";
import { Cloud, Droplets, Wind, Sun, MapPin, Search } from "lucide-react";

/**
 * Cyberpunk Weather Card
 * Inspired by mahiatlinux on Uiverse.io
 * Adapted for SmartTech Guide with high-fidelity aesthetics.
 */
const WeatherCard = () => {
  return (
    <div className="weather-card-wrapper pointer-events-none">
      <div className="card-instance pointer-events-auto group">
        {/* Main Front Card */}
        <div className="card-front glass-card">
          <div className="weather-header">
            <span className="live-badge">
              <span className="pulse-dot"></span>
              LIVE_SYSTEM
            </span>
          </div>
          
          <div className="weather-info mt-4">
            <div className="temp-section flex items-start">
              <span className="temperature">28°</span>
              <Sun className="weather-icon text-accent animate-pulse ml-auto" size={42} />
            </div>
            
            <div className="location-section flex items-center gap-2 mt-1">
              <MapPin size={12} className="text-primary" />
              <span className="location-text">DHAKA // SECTOR_07</span>
            </div>
          </div>
        </div>

        {/* Hidden Details Card (Expands on Hover) */}
        <div className="card-back glass-card-secondary">
          <div className="metric-grid">
            <div className="metric-box border-r border-[#00f2ff22]">
              <span className="metric-label">HUMIDITY</span>
              <div className="metric-value text-primary">
                <Droplets size={14} />
                65%
              </div>
            </div>
            <div className="metric-box">
              <span className="metric-label">AIR QUALITY</span>
              <div className="metric-value text-secondary">
                <Wind size={14} />
                GOOD
              </div>
            </div>
          </div>
          
          <div className="detail-footer px-6 py-4 flex items-center justify-between">
            <div className="aqi-stat">
              <span className="metric-label">AQI INDEX</span>
              <div className="font-bold text-lg font-[var(--font-space)]">42</div>
            </div>
            <div className="realfeel-stat text-right">
              <span className="metric-label">REAL FEEL</span>
              <div className="font-bold text-lg font-[var(--font-space)]">31°C</div>
            </div>
          </div>

          <div className="status-banner">
            <span>SUNRISE: 05:42 AM // CLEAR SKIES</span>
          </div>
        </div>
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
          background: rgba(10, 15, 30, 0.9);
          border: 1px solid rgba(0, 242, 255, 0.2);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8),
                      inset 0 0 15px rgba(0, 242, 255, 0.05);
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
          background: rgba(15, 20, 40, 0.98);
          z-index: 1;
          opacity: 0;
          transform: translateY(0);
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(255, 255, 255, 0.05);
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
          border-color: rgba(0, 242, 255, 0.3);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
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
          color: #fff;
          text-shadow: 0 0 20px rgba(0, 242, 255, 0.4);
        }

        .location-text {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #94a3b8;
          font-family: var(--font-space);
        }

        .metric-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin-top: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
          color: #64748b;
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
