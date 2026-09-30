"use client";

import React, { useState } from "react";
import { api, User } from "@/lib/api";
import { X, Lock, Mail, User as UserIcon, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "login",
}) => {
  const [isLogin, setIsLogin] = useState(initialMode !== "register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode !== "register");
      setError(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

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
          onClose();
        }
      } else {
        await api.register(name, email, password);
        await api.login(email, password);
        const me = await api.getCurrentUser();
        if (me) {
          onSuccess(me);
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
      <div
        className="w-full max-w-sm rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#94A3B8] hover:text-[#0F172A] rounded-md transition"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-base font-bold text-[#0F172A]">
          {isLogin ? "Sign In to MediBot" : "Create Account"}
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5 mb-4">
          {isLogin
            ? "Access your isolated documents and consultation history."
            : "Register to manage and query your clinical documents."}
        </p>

        {/* Tab switcher */}
        <div className="flex rounded-lg border border-[#E5E0D8] bg-[#FAF8F5] p-1 mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError(null);
            }}
            className={`flex-1 py-1.5 rounded-md transition ${
              isLogin ? "bg-white text-[#0F172A] shadow-2xs" : "text-[#64748B]"
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
            className={`flex-1 py-1.5 rounded-md transition ${
              !isLogin ? "bg-white text-[#0F172A] shadow-2xs" : "text-[#64748B]"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#334155]">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Jane Smith"
                  className="w-full rounded-lg border border-[#DDD6CA] bg-[#FAF8F5] pl-9 pr-3 py-2 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0284C7] focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-[#334155]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="clinician@hospital.org"
                className="w-full rounded-lg border border-[#DDD6CA] bg-[#FAF8F5] pl-9 pr-3 py-2 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0284C7] focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[#334155]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#DDD6CA] bg-[#FAF8F5] pl-9 pr-3 py-2 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0284C7] focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-[#0284C7] py-2.5 text-xs font-semibold text-white hover:bg-[#0369A1] transition shadow-2xs disabled:opacity-40"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};
