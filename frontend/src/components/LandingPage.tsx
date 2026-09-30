"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  FileText,
  MessageSquare,
  Search,
  CheckCircle2,
  FileCheck,
  Activity,
  LogIn,
  Layers,
  Sparkles,
  Database,
} from "lucide-react";
import { MedicalLogo } from "@/components/MedicalLogo";
import { MedicalBackground } from "@/components/MedicalBackground";
import { User } from "@/lib/api";

interface LandingPageProps {
  user: User | null;
  backendOnline: boolean | null;
  onOpenAuth: (mode?: "login" | "register") => void;
  onLaunchApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  user,
  backendOnline,
  onOpenAuth,
  onLaunchApp,
}) => {
  const [activeDemoTab, setActiveDemoTab] = useState<"chat" | "search" | "docs">("chat");

  const handlePrimaryAction = () => {
    if (user) {
      onLaunchApp();
    } else {
      onOpenAuth("register");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans select-none bg-[#F8FAFC] text-[#0F172A]">
      {/* Creative Medical Ambient Background with EKG & Clinical Grids */}
      <MedicalBackground showEkg={true} intensity="vibrant" />

      {/* Subtle Floating Medical Crosshair & Geometric Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Top-Right Decorative Pulse Node */}
        <div className="absolute top-20 right-1/4 h-24 w-24 rounded-full border border-sky-300/30 bg-sky-100/10 backdrop-blur-xs flex items-center justify-center animate-float-gentle">
          <div className="h-10 w-10 rounded-full border border-sky-400/40 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-sky-500/60 animate-ping" />
          </div>
        </div>

        {/* Bottom-Left Clinical Vital Marker */}
        <div className="absolute bottom-24 left-16 h-28 w-28 rounded-full border border-teal-300/20 bg-teal-50/10 flex items-center justify-center animate-pulse-slow">
          <Activity className="h-8 w-8 text-teal-600/30" />
        </div>
      </div>

      {/* 1. Clean Top Header */}
      <header className="relative z-20 w-full border-b border-slate-200/80 bg-white/75 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MedicalLogo size="md" showText={true} />
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-sky-200/80 bg-sky-50/70 text-[11px] font-medium text-sky-800">
              <span
                className={`h-2 w-2 rounded-full ${
                  backendOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <span>{backendOnline ? "RAG Engine Online" : "Connecting..."}</span>
            </div>
          </div>

          <div>
            {user ? (
              <button
                onClick={onLaunchApp}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-700 transition active:scale-[0.98]"
              >
                <span>Dashboard ({user.name || "Clinician"})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth("login")}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition shadow-2xs"
              >
                <LogIn className="h-3.5 w-3.5 text-sky-600" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Stage & Restored Feature Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full flex-1 flex flex-col items-center justify-center text-center gap-8">
        {/* Main Headline */}
        <div className="max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Consult Your Medical PDFs with{" "}
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Clinical Precision
            </span>
            .
          </h1>

          {/* Short & Clear Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl mx-auto">
            Upload medical textbooks, clinical guidelines, and research papers. Ask complex clinical questions and get
            instant answers grounded strictly in your documents with page-level citations.
          </p>

          {/* The ONLY Primary Action Button: "Get Started" in the middle */}
          <div className="pt-3 flex justify-center">
            <button
              onClick={handlePrimaryAction}
              className="group relative flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        

        {/* Restored Content 1: The 3 Core Pillar Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md p-5 shadow-2xs hover:shadow-sm transition">
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">1. Upload Medical PDFs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload clinical guidelines, pharmacology books, or research notes. PyMuPDF automatically parses tables, text, and structure.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md p-5 shadow-2xs hover:shadow-sm transition">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">2. Grounded Clinical Chat</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ask natural medical questions. MediBot retrieves relevant excerpts and generates structured answers with clickable page footnotes.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md p-5 shadow-2xs hover:shadow-sm transition">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">3. Semantic Vector Search</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Powered by Pinecone and Gemini 768-D embeddings. Instantly search clinical concepts with similarity scores and highlighted excerpts.
            </p>
          </div>
        </div>

        {/* Restored Content 2: Interactive Workflow Preview Card */}
        <div className="w-full rounded-2xl border border-sky-100 bg-white/95 backdrop-blur-xl p-5 shadow-md shadow-sky-500/5 text-left">
          {/* Card Header & Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <Activity className="h-4 w-4 text-sky-600" />
              <span>Interactive Workflow Preview</span>
            </div>

            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-semibold">
              <button
                onClick={() => setActiveDemoTab("chat")}
                className={`px-3 py-1 rounded-md transition ${
                  activeDemoTab === "chat" ? "bg-white text-sky-700 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                RAG Chat View
              </button>
              <button
                onClick={() => setActiveDemoTab("search")}
                className={`px-3 py-1 rounded-md transition ${
                  activeDemoTab === "search" ? "bg-white text-sky-700 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Vector Search View
              </button>
              <button
                onClick={() => setActiveDemoTab("docs")}
                className={`px-3 py-1 rounded-md transition ${
                  activeDemoTab === "docs" ? "bg-white text-sky-700 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Indexed Document
              </button>
            </div>
          </div>

          {/* Interactive Preview Body */}
          <div className="pt-4">
            {activeDemoTab === "chat" && (
              <div className="space-y-3">
                {/* User Prompt */}
                <div className="flex items-start gap-2.5 max-w-xl">
                  <div className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    Dr
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2 text-xs text-slate-800">
                    What is the first-line antibiotic protocol for acute bacterial meningitis in adults?
                  </div>
                </div>

                {/* MediBot Response */}
                <div className="flex items-start gap-2.5 max-w-2xl pl-1">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    AI
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-sky-50/70 border border-sky-100 p-3.5 text-xs text-slate-800 space-y-2">
                    <p className="font-medium">
                      Based on your uploaded <strong>IDSA_Bacterial_Meningitis_Guidelines.pdf</strong>:
                    </p>
                    <ul className="space-y-1 list-disc list-inside text-slate-700">
                      <li>
                        <strong>Vancomycin</strong> (15–20 mg/kg IV q8–12h) PLUS <strong>Ceftriaxone</strong> (2 g IV q12h).
                      </li>
                      <li>
                        Add <strong>Ampicillin</strong> (2 g IV q4h) for patients age &gt; 50 or immunocompromised to cover <em>Listeria monocytogenes</em>.
                      </li>
                      <li>
                        Administer <strong>Dexamethasone</strong> (10 mg IV) prior to or with the first dose of antimicrobial therapy.
                      </li>
                    </ul>

                    {/* Source Footnote Badge */}
                    <div className="pt-1 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-sky-200 text-[10px] font-mono text-sky-700 shadow-2xs">
                        <FileCheck className="h-3 w-3" />
                        IDSA_Guidelines_2024.pdf &bull; Page 18
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified from document
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDemoTab === "search" && (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 flex items-center justify-between">
                  <span className="font-mono text-slate-600">Query: &quot;Dexamethasone timing in pneumococcal meningitis&quot;</span>
                  <span className="font-mono text-sky-700 font-bold text-[11px]">Match Score: 0.962 (96.2%)</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1 text-slate-700">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Source: Clinical_Infectious_Diseases_Vol42.pdf (Page 22)
                  </span>
                  <p className="text-xs leading-relaxed">
                    &ldquo;...adjunctive dexamethasone should be administered 10–20 minutes before or at least concomitant with the first dose of parenteral antibiotics...&rdquo;
                  </p>
                </div>
              </div>
            )}

            {activeDemoTab === "docs" && (
              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">IDSA_Bacterial_Meningitis_Guidelines.pdf</h4>
                      <p className="text-[11px] text-slate-500">28 Pages &bull; 64 Vector Chunks &bull; Status: Ingested &amp; Indexed</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                    Pinecone Synced
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. Clean Subtle Footer */}
      <footer className="relative z-20 border-t border-slate-200/70 bg-white/50 py-4 px-4 text-center text-xs text-slate-500">
        <p>MediBot &bull; AI-Powered Medical Knowledge &amp; Document Retrieval System</p>
      </footer>
    </div>
  );
};
