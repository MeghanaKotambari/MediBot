"use client";

import React from "react";
import { User } from "@/lib/api";
import { MedicalLogo } from "@/components/MedicalLogo";
import { 
  Activity, 
  MessageSquare, 
  FileText, 
  Search, 
  LogOut, 
  LogIn, 
  ShieldCheck,
  Stethoscope
} from "lucide-react";

interface NavbarProps {
  activeTab: "chat" | "documents" | "search";
  setActiveTab: (tab: "chat" | "documents" | "search") => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  backendOnline: boolean | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout,
  backendOnline,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <MedicalLogo size="md" />
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100/70 p-1">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "chat"
                ? "bg-white text-sky-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 text-sky-600" />
            <span>Consultation</span>
          </button>

          <button
            onClick={() => setActiveTab("documents")}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === "documents"
                ? "bg-white text-mediblue-700 shadow-sm"
                : "text-medigray-600 hover:text-medigray-900 hover:bg-white/50"
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-mediblue-500" />
            <span>Documents & Knowledge</span>
          </button>

          <button
            onClick={() => setActiveTab("search")}
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === "search"
                ? "bg-white text-mediblue-700 shadow-sm"
                : "text-medigray-600 hover:text-medigray-900 hover:bg-white/50"
            }`}
          >
            <Search className="h-3.5 w-3.5 text-mediblue-500" />
            <span>Vector Search</span>
          </button>
        </nav>

        {/* Right Action / Auth */}
        <div className="flex items-center gap-3">
          {/* Backend Status indicator */}
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-medigray-200/80 bg-white px-2.5 py-1 text-xs text-medigray-600">
            <span
              className={`h-2 w-2 rounded-full ${
                backendOnline === true
                  ? "bg-emerald-500 animate-pulse"
                  : backendOnline === false
                  ? "bg-rose-500"
                  : "bg-amber-400"
              }`}
            />
            <span className="text-[11px] font-medium">
              {backendOnline === true
                ? "API Connected"
                : backendOnline === false
                ? "Backend Offline"
                : "Connecting..."}
            </span>
          </div>

          {user ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 rounded-full border border-cream-300 bg-white px-3 py-1 shadow-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-mediblue-100 text-xs font-bold text-mediblue-700">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-medigray-800 leading-tight">
                    {user.name || "Doctor / Researcher"}
                  </p>
                  <p className="text-[10px] text-medigray-400 truncate max-w-[120px]">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Sign out"
                className="rounded-full border border-cream-200 bg-white p-2 text-medigray-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 rounded-full bg-mediblue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-mediblue-700 active:scale-95 transition-all"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
