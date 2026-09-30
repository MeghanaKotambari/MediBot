"use client";

import React, { useState } from "react";
import { api, User } from "@/lib/api";
import { MedicalLogo } from "@/components/MedicalLogo";
import { MedicalBackground } from "@/components/MedicalBackground";
import { Lock, Mail, User as UserIcon, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface AuthPageProps {
  onSuccess: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await api.login(email, password);
        const me = await api.getCurrentUser();
        if (me) {
          onSuccess(me);
        }
      } else {
        await api.register(name, email, password);
        await api.login(email, password);
        const me = await api.getCurrentUser();
        if (me) {
          onSuccess(me);
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Immersive Medical Background */}
      <MedicalBackground showEkg={true} intensity="vibrant" />

      {/* Main Authentication Glass Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-sky-100 bg-white/90 backdrop-blur-2xl p-8 shadow-glass-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-3.5">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-sky-400/20 blur-lg animate-pulse-slow" />
              <MedicalLogo size="lg" showText={false} className="relative" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold text-sky-800 uppercase tracking-wider mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Clinical Knowledge Portal
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Medi<span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">Bot</span> AI
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Document Grounded Medical Intelligence & Clinical RAG
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-2xl border border-slate-200 bg-slate-100/70 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all duration-200 ${
                isLogin
                  ? "bg-white text-slate-900 shadow-soft border border-slate-200/60"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all duration-200 ${
                !isLogin
                  ? "bg-white text-slate-900 shadow-soft border border-slate-200/60"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Full Name / Clinical Title</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Sarah Johnson, MD"
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition shadow-2xs"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Medical Institution Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="clinician@hospital.org"
                className="w-full rounded-2xl border border-slate-200 bg-white/80 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition shadow-2xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-white/80 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition shadow-2xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 py-3 text-xs font-bold text-white hover:from-sky-600 hover:to-blue-700 transition shadow-md shadow-sky-500/20 disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Validating Clinical Credentials...
              </span>
            ) : (
              <>
                <span>{isLogin ? "Sign In to Clinical Workspace" : "Register & Ingest Knowledge"}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-3 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 border-t border-slate-100">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Namespace Isolation & Grounded Citation Verification</span>
        </div>
      </div>
    </div>
  );
};

