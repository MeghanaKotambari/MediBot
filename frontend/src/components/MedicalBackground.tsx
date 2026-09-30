"use client";

import React from "react";

interface MedicalBackgroundProps {
  showEkg?: boolean;
  intensity?: "subtle" | "medium" | "vibrant";
  className?: string;
}

export const MedicalBackground: React.FC<MedicalBackgroundProps> = ({
  showEkg = true,
  intensity = "medium",
  className = "",
}) => {
  const opacityMap = {
    subtle: "opacity-40",
    medium: "opacity-75",
    vibrant: "opacity-100",
  };

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Base Pristine Clinical Tint & Precision Grid */}
      <div className="absolute inset-0 bg-[#F8FAFC]" />
      
      {/* Precision Medical Monitor Grid */}
      <div className="absolute inset-0 medical-grid-bg opacity-70" />

      {/* 2. Ambient Clinical Light Cones & Glowing Orbs */}
      <div
        className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-400/18 via-sky-500/12 to-transparent blur-[120px] animate-ambient-breathe ${opacityMap[intensity]}`}
      />
      <div
        className={`absolute top-1/4 -right-40 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-blue-500/15 via-indigo-400/10 to-transparent blur-[130px] animate-ambient-breathe ${opacityMap[intensity]}`}
        style={{ animationDelay: "3s" }}
      />
      <div
        className={`absolute -bottom-40 left-1/3 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-emerald-400/12 via-teal-500/10 to-transparent blur-[120px] animate-ambient-breathe ${opacityMap[intensity]}`}
        style={{ animationDelay: "5s" }}
      />

      {/* 3. Subtle Molecular / Clinical Grid Crosshairs */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#0284C7_2px,transparent_2px)] [background-size:36px_36px]" />

      {/* 4. Telemetry Precision EKG Pulse Wave Line */}
      {showEkg && (
        <div className="absolute top-[35%] left-0 right-0 -translate-y-1/2 opacity-[0.16] pointer-events-none">
          <svg
            viewBox="0 0 1440 160"
            className="w-full h-32 stroke-sky-500 fill-none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="ekgGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.1" />
                <stop offset="25%" stopColor="#06B6D4" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#0284C7" stopOpacity="0.8" />
                <stop offset="75%" stopColor="#10B981" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.1" />
              </linearGradient>
              <filter id="neonPulse" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background continuous faint line */}
            <path
              d="M0,80 L200,80 L220,50 L235,110 L250,25 L270,125 L285,60 L305,90 L320,80 L600,80 L620,40 L635,120 L650,15 L670,135 L685,55 L705,95 L720,80 L1020,80 L1040,45 L1055,115 L1070,20 L1090,130 L1105,60 L1125,90 L1140,80 L1440,80"
              stroke="#BAE6FD"
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />

            {/* Glowing animated trace */}
            <path
              d="M0,80 L200,80 L220,50 L235,110 L250,25 L270,125 L285,60 L305,90 L320,80 L600,80 L620,40 L635,120 L650,15 L670,135 L685,55 L705,95 L720,80 L1020,80 L1040,45 L1055,115 L1070,20 L1090,130 L1105,60 L1125,90 L1140,80 L1440,80"
              stroke="url(#ekgGlow)"
              strokeWidth="2.8"
              filter="url(#neonPulse)"
              className="animate-ekg-trace"
            />
          </svg>
        </div>
      )}

      {/* 5. Delicate Floating Clinical Cross Watermarks in corners */}
      <div className="absolute top-12 right-16 opacity-[0.06]">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M50 25 V75 M25 50 H75" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      <div className="absolute bottom-16 left-12 opacity-[0.05]">
        <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="48" stroke="#06B6D4" strokeWidth="1.2" />
          <circle cx="50" cy="50" r="32" stroke="#0284C7" strokeWidth="1" strokeDasharray="6 3" />
          <path d="M50 28 V72 M28 50 H72" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};
