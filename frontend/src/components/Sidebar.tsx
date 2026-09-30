"use client";

import React, { useState, useEffect } from "react";
import { User, api } from "@/lib/api";
import { MedicalLogo } from "@/components/MedicalLogo";
import {
  Plus,
  MessageSquare,
  FileText,
  Search,
  LogIn,
  LogOut,
  Activity,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  activeTab: "chat" | "documents" | "search";
  setActiveTab: (tab: "chat" | "documents" | "search") => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNewChat: () => void;
  backendOnline: boolean | null;
  documentCount?: number;
  selectedConversationId?: string | null;
  onSelectConversation?: (id: string) => void;
  historyRefreshKey?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout,
  onNewChat,
  backendOnline,
  documentCount = 0,
  selectedConversationId = null,
  onSelectConversation,
  historyRefreshKey = 0,
}) => {
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      api
        .getChatHistory()
        .then((data) => {
          if (Array.isArray(data)) setConversations(data.slice(0, 10));
        })
        .catch(() => {});
    } else {
      setConversations([]);
    }
  }, [user, historyRefreshKey]);

  return (
    <aside className="w-72 shrink-0 border-r border-slate-200/80 bg-white/80 backdrop-blur-xl flex flex-col justify-between h-screen sticky top-0 select-none z-20 shadow-xs overflow-hidden">
      {/* Top Scrollable Section */}
      <div className="p-4 space-y-4 overflow-y-auto overflow-x-hidden">
        {/* Brand & Telemetry Status Header */}
        <div className="space-y-1.5 pb-2 border-b border-slate-100">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <MedicalLogo size="sm" showText={false} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-base font-black tracking-tight text-slate-900">
                    Medi
                    <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Bot
                    </span>
                  </span>
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[8px] font-bold text-sky-700 tracking-wider uppercase">
                    AI
                  </span>
                </div>
              </div>
            </div>

            {/* Clinical Telemetry Pulse Badge */}
            <div
              title={backendOnline ? "Clinical API Online" : "Backend Offline"}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wide shrink-0 ${
                backendOnline
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-2xs"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              <span className="relative flex h-2 w-2">
                {backendOnline && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    backendOnline ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
              </span>
              <span>{backendOnline ? "ACTIVE" : "OFFLINE"}</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-medium pl-0.5">
            Precision Clinical Knowledge Assistant
          </p>
        </div>

        {/* New Chat Primary Action Button */}
        <button
          onClick={() => {
            setActiveTab("chat");
            onNewChat();
          }}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>New Consultation</span>
        </button>

        {/* Navigation Tabs */}
        <nav className="space-y-1 pt-1">
          <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Workspace
          </div>

          <button
            onClick={() => setActiveTab("chat")}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
              activeTab === "chat"
                ? "bg-gradient-to-r from-sky-50 to-blue-50/70 text-sky-900 font-semibold shadow-2xs border border-sky-200/70"
                : "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-1.5 rounded-lg ${
                  activeTab === "chat"
                    ? "bg-sky-500 text-white shadow-xs"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
              </div>
              <span>Clinical Chat</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("documents")}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
              activeTab === "documents"
                ? "bg-gradient-to-r from-sky-50 to-blue-50/70 text-sky-900 font-semibold shadow-2xs border border-sky-200/70"
                : "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-1.5 rounded-lg ${
                  activeTab === "documents"
                    ? "bg-sky-500 text-white shadow-xs"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
              </div>
              <span>Document Library</span>
            </div>
            {documentCount > 0 && (
              <span className="rounded-full bg-sky-100 border border-sky-200 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                {documentCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("search")}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
              activeTab === "search"
                ? "bg-gradient-to-r from-sky-50 to-blue-50/70 text-sky-900 font-semibold shadow-2xs border border-sky-200/70"
                : "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-1.5 rounded-lg ${
                  activeTab === "search"
                    ? "bg-sky-500 text-white shadow-xs"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Search className="h-3.5 w-3.5" />
              </div>
              <span>Vector Search</span>
            </div>
          </button>
        </nav>

        {/* Clinical Diagnostics Mini Widget */}
        <div className="pt-2">
          <div className="rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50/60 via-white to-blue-50/40 p-3 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-sky-800 font-semibold text-[11px]">
              <Activity className="h-3.5 w-3.5 text-sky-600" />
              <span>Clinical Knowledge Engine</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              RAG 2.0 with semantic similarity & grounded citation verification.
            </p>
            <div className="pt-1 flex items-center gap-1 text-[9px] font-semibold text-emerald-700">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              <span>HIPAA Compliant Session</span>
            </div>
          </div>
        </div>

        {/* Recent Consultations */}
        {user && conversations.length > 0 && (
          <div className="pt-2 border-t border-slate-200/70">
            <p className="px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Recent Consultations
            </p>
            <div className="space-y-1">
              {conversations.map((c) => {
                const isSelected = selectedConversationId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (onSelectConversation) {
                        onSelectConversation(c.id);
                      } else {
                        setActiveTab("chat");
                      }
                    }}
                    className={`w-full text-left truncate rounded-xl px-2.5 py-2 text-xs transition flex items-center gap-2 ${
                      isSelected
                        ? "bg-sky-50 text-sky-900 font-bold border border-sky-200/80 shadow-2xs"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        isSelected ? "bg-sky-600" : "bg-sky-400"
                      }`}
                    />
                    <span className="truncate block font-medium">
                      {c.title || "Medical Consultation"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom User Section */}
      <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/80 backdrop-blur-md shrink-0">
        {user ? (
          <div className="flex items-center justify-between gap-2 rounded-2xl bg-white border border-slate-200 p-2.5 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-xs font-bold text-white shadow-xs">
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.email.charAt(0).toUpperCase()}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 border border-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user.name || "Clinician"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="shrink-0 rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm hover:from-sky-600 hover:to-blue-700 transition active:scale-[0.99]"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In / Portal</span>
          </button>
        )}
      </div>
    </aside>
  );
};
