"use client";

import React from "react";

interface MedicalLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  pulseLive?: boolean;
}

export const MedicalLogo: React.FC<MedicalLogoProps> = ({
  size = "md",
  showText = true,
  className = "",
  pulseLive = true,
}) => {
  const sizeMap = {
    sm: {
      box: "h-8 w-8",
      text: "text-sm",
      sub: "text-[9px]",
      badge: "text-[8px] px-1.5 py-0.5",
      iconPad: 2,
    },
    md: {
      box: "h-10 w-10",
      text: "text-lg",
      sub: "text-[11px]",
      badge: "text-[9px] px-2 py-0.5",
      iconPad: 3,
    },
    lg: {
      box: "h-16 w-16",
      text: "text-2xl",
      sub: "text-xs",
      badge: "text-[10px] px-2.5 py-0.5",
      iconPad: 4,
    },
    xl: {
      box: "h-24 w-24",
      text: "text-3xl",
      sub: "text-sm",
      badge: "text-xs px-3 py-1",
      iconPad: 5,
    },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* 3D High-Tech Clinical Emblem */}
      <div className={`${current.box} shrink-0 relative transition-all duration-300 group-hover:scale-105`}>
        {/* Ambient Glow Aura */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/25 via-blue-600/25 to-indigo-500/20 blur-md opacity-75 group-hover:opacity-100 transition-opacity" />

        {/* SVG Medical Emblem */}
        <svg
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-md"
        >
          <defs>
            {/* Outer Shield Gradient */}
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="35%" stopColor="#0EA5E9" />
              <stop offset="70%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>

            {/* Specular Highlight Sheen */}
            <linearGradient id="shieldSheen" x1="0%" y1="0%" x2="50%" y2="70%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Medical Cross Luster */}
            <linearGradient id="crossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>

            {/* Glowing Vital EKG Wave Gradient */}
            <linearGradient id="pulseGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="45%" stopColor="#06B6D4" />
              <stop offset="55%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            {/* Inner Shadow for 3D Inset */}
            <filter id="innerDepth" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#0F172A" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* Outer Squircle Container with Bevel Stroke */}
          <rect
            x="4"
            y="4"
            width="64"
            height="64"
            rx="18"
            fill="url(#shieldGrad)"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1.2"
          />

          {/* Specular Glass Highlight Overlay */}
          <rect
            x="4"
            y="4"
            width="64"
            height="64"
            rx="18"
            fill="url(#shieldSheen)"
          />

          {/* Medical Cross - Vertical Bar */}
          <rect
            x="27"
            y="14"
            width="18"
            height="44"
            rx="6"
            fill="url(#crossGrad)"
            filter="url(#innerDepth)"
          />

          {/* Medical Cross - Horizontal Bar */}
          <rect
            x="14"
            y="27"
            width="44"
            height="18"
            rx="6"
            fill="url(#crossGrad)"
            filter="url(#innerDepth)"
          />

          {/* Precision Vital Cardiogram Pulse Wave */}
          <path
            d="M12 36 H24 L28 26 L33 46 L38 29 L42 41 L45 36 H60"
            stroke="url(#pulseGlow)"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Heartbeat / Status Beacon Node */}
          <circle cx="53" cy="18" r="4" fill="#67E8F9" fillOpacity="0.4" />
          <circle cx="53" cy="18" r="2.8" fill="#10B981" />
          <circle cx="53" cy="18" r="1.2" fill="#FFFFFF" />
        </svg>

        {/* Dynamic Micro Pulse Indicator Ring */}
        {pulseLive && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white shadow-xs" />
          </span>
        )}
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 leading-none">
            <span className={`${current.text} font-black tracking-tight text-slate-900`}>
              Medi<span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">Bot</span>
            </span>
            <span
              className={`rounded-full border border-sky-200/80 bg-gradient-to-r from-sky-50 to-blue-50/80 ${current.badge} font-bold text-sky-700 tracking-wider uppercase shadow-2xs flex items-center gap-1`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Clinical AI
            </span>
          </div>
          <span className={`${current.sub} text-slate-500 font-medium tracking-tight mt-1`}>
            Precision Medical Knowledge Assistant
          </span>
        </div>
      )}
    </div>
  );
};

