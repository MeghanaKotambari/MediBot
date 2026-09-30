"use client";

import React, { useEffect, useState } from "react";
import { MedicalLogo } from "@/components/MedicalLogo";
import { MedicalBackground } from "@/components/MedicalBackground";
import { Activity, ShieldCheck } from "lucide-react";

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("Calibrating Clinical Knowledge Base...");
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(55);
      setStatusText("Verifying Neural Vector Indexes & Chunks...");
    }, 400);

    const timer2 = setTimeout(() => {
      setProgress(90);
      setStatusText("Initializing Grounded RAG Interface...");
    }, 850);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText("Clinical System Ready");
    }, 1200);

    const timer4 = setTimeout(() => setFade(true), 1500);
    const timer5 = setTimeout(() => onFinish(), 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden select-none transition-all duration-500 ${
        fade ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Immersive Medical Background */}
      <MedicalBackground showEkg={true} intensity="vibrant" />

      {/* Center Console Card */}
      <div className="relative z-10 flex flex-col items-center space-y-6 text-center max-w-sm px-6">
        {/* Animated Logo Container with Glow Pulse */}
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-sky-400/30 via-blue-500/25 to-teal-400/30 blur-2xl animate-pulse-slow" />
          <MedicalLogo size="xl" showText={false} className="relative" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-0.5 text-[10px] font-bold text-sky-800 tracking-wider uppercase">
            <Activity className="h-3 w-3 text-sky-600 animate-pulse" />
            <span>Clinical AI OS 2.4</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Medi<span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">Bot</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Clinical Knowledge & Medical RAG Assistant
          </p>
        </div>

        {/* Clinical Precision Progress Bar */}
        <div className="w-64 space-y-2 pt-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-emerald-500 transition-all duration-400 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between px-0.5">
            <p className="text-[10px] font-medium text-slate-500">{statusText}</p>
            <p className="text-[10px] font-bold text-sky-600">{progress}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

