"use client";

import React, { useState } from "react";
import { api, User } from "@/lib/api";
import {
  Search,
  SlidersHorizontal,
  AlertCircle,
  LogIn,
  FileText,
  Sparkles,
  BarChart2,
  Copy,
  Check,
} from "lucide-react";

interface SearchViewProps {
  user: User | null;
  onOpenAuth: () => void;
}

interface SearchMatch {
  score: number;
  text: string;
  page_number?: number | string;
  document_name?: string;
}

export const SearchView: React.FC<SearchViewProps> = ({ user, onOpenAuth }) => {
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(5);
  const [results, setResults] = useState<SearchMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    if (!user) {
      onOpenAuth();
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await api.search(query, topK);
      setResults(data.matches || data.results || []);
    } catch (err: any) {
      setError(err.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Vector Similarity Diagnostic Search
          </h2>
          <span className="rounded-full bg-sky-50 border border-sky-200 px-2.5 py-0.5 text-[11px] font-bold text-sky-700">
            Cosine Distance
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Perform high-dimensional semantic search directly against document chunk embeddings
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-sky-600" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symptoms, contraindications, clinical guidelines, pharmacology..."
            className="w-full rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition shadow-soft outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white/95 px-3.5 py-2.5 text-xs text-slate-600 shadow-2xs">
            <SlidersHorizontal className="h-3.5 w-3.5 text-sky-600" />
            <span className="text-[11px] font-medium text-slate-400">Depth:</span>
            <select
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer"
            >
              <option value={3}>Top 3</option>
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-blue-700 transition disabled:opacity-40 active:scale-95 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Execute Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="inline-flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      <div className="space-y-3.5">
        {!user ? (
          <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-md p-10 text-center shadow-glass space-y-3">
            <p className="text-xs text-slate-500">
              Please authenticate to execute semantic similarity searches across your indexed repository.
            </p>
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-sky-600 hover:to-blue-700 transition"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        ) : hasSearched && results.length === 0 && !loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white/85 backdrop-blur-md p-10 text-center shadow-glass">
            <p className="text-xs text-slate-500">No matching vector chunks met the similarity threshold.</p>
          </div>
        ) : (
          results.map((match, idx) => {
            const scorePercent = Math.min(100, Math.max(0, match.score * 100));
            const isHighMatch = scorePercent >= 75;
            const isMidMatch = scorePercent >= 50;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 space-y-3 shadow-glass hover:border-sky-300 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 text-sky-600 shrink-0" />
                    <span className="font-bold text-slate-900 truncate">
                      {match.document_name || "Clinical Document"}
                    </span>
                    {match.page_number && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        Page {match.page_number}
                      </span>
                    )}
                  </div>

                  {/* Similarity Score Meter */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHighMatch
                            ? "bg-emerald-500"
                            : isMidMatch
                            ? "bg-sky-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${scorePercent}%` }}
                      />
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        isHighMatch
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : isMidMatch
                          ? "bg-sky-50 border-sky-200 text-sky-700"
                          : "bg-amber-50 border-amber-200 text-amber-700"
                      }`}
                    >
                      {scorePercent.toFixed(1)}% Match
                    </span>
                  </div>
                </div>

                <div className="relative group">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 font-normal">
                    &ldquo;{match.text}&rdquo;
                  </p>

                  <button
                    onClick={() => handleCopy(match.text, idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 border border-slate-200 text-slate-500 hover:text-slate-800 shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy excerpt"
                  >
                    {copiedIdx === idx ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

