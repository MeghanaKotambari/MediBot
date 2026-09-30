"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api, DocumentItem, User } from "@/lib/api";
import {
  Upload,
  FileText,
  AlertCircle,
  RefreshCw,
  LogIn,
  Layers,
  File,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Database,
  Calendar,
} from "lucide-react";

interface DocumentsViewProps {
  user: User | null;
  onOpenAuth: () => void;
  onSwitchToChat: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  user,
  onOpenAuth,
  onSwitchToChat,
}) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDocuments();
      setDocuments(data);
    } catch (err: any) {
      setError(err.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileUpload = async (file: File) => {
    if (!user) {
      onOpenAuth();
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a clinical PDF document.");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadStatus("Extracting clinical text and generating vector embeddings...");

    try {
      const res = await api.uploadDocument(file);
      setUploadStatus(
        `✓ "${res.data.document_name}" indexed (${res.data.chunks} chunks across ${res.data.pages} pages)`
      );
      fetchDocuments();
      setTimeout(() => setUploadStatus(null), 6000);
    } catch (err: any) {
      setError(err.message || "Upload failed.");
      setUploadStatus(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const totalChunks = documents.reduce((acc, doc) => acc + (doc.chunks || 0), 0);

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Clinical Knowledge Repository
            </h2>
            <span className="rounded-full bg-sky-50 border border-sky-200 px-2.5 py-0.5 text-[11px] font-bold text-sky-700">
              {documents.length} Files Indexed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage uploaded medical research, drug guidelines, protocols, and vectorized corpora
          </p>
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-slate-200 text-xs text-slate-600 shadow-2xs">
              <Database className="h-3.5 w-3.5 text-sky-600" />
              <span>{totalChunks} Chunks Ingested</span>
            </div>

            <button
              onClick={fetchDocuments}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white/95 border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs hover:bg-slate-50 transition active:scale-95"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-sky-600 ${loading ? "animate-spin" : ""}`} />
              <span className="font-semibold">Refresh</span>
            </button>
          </div>
        )}
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
          dragOver
            ? "border-sky-500 bg-sky-50/80 shadow-glow-cyan scale-[1.005]"
            : "border-sky-200/90 bg-white/85 backdrop-blur-xl hover:border-sky-400 hover:bg-white/95 shadow-glass"
        }`}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 text-sky-600 mb-3.5 shadow-2xs border border-sky-200/60">
          <Upload className="h-6 w-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-1">
          Ingest Medical Documentation (PDF)
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
          Drag & drop your clinical trial reports, drug indices, or diagnostic guidelines to parse and chunk into vector embeddings.
        </p>

        <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-blue-700 transition active:scale-95">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Browse Clinical PDF</span>
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
        </label>

        {uploading && (
          <div className="mt-5 flex items-center justify-center gap-2.5 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200 py-2 px-4 rounded-xl max-w-md mx-auto">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
            <span>{uploadStatus}</span>
          </div>
        )}

        {!uploading && uploadStatus && (
          <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 py-2 px-4 rounded-xl animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{uploadStatus}</span>
          </div>
        )}

        {error && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Documents List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Vectorized Knowledge Library ({documents.length})
          </h3>
        </div>

        {!user ? (
          <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-md p-10 text-center shadow-glass space-y-3">
            <p className="text-xs text-slate-500">
              Please authenticate to access your clinical repository.
            </p>
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-sky-600 hover:to-blue-700 transition"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In to Repository</span>
            </button>
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/90 bg-white/80 backdrop-blur-md p-12 text-center shadow-glass">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
              <File className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Documents Uploaded</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Upload your medical PDFs above to enable grounded AI query answering and vector similarity search.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md overflow-hidden shadow-glass">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-5">Clinical Document</th>
                    <th className="py-3 px-4">Pages</th>
                    <th className="py-3 px-4">Vector Chunks</th>
                    <th className="py-3 px-4">Ingested Date</th>
                    <th className="py-3 px-5 text-right">Inquiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-sky-50/40 transition-colors group"
                    >
                      <td className="py-3.5 px-5 font-bold text-slate-900 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 border border-sky-100 text-sky-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="truncate max-w-xs sm:max-w-md">
                          <span className="truncate block font-semibold text-slate-900 group-hover:text-sky-700 transition">
                            {doc.document_name}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Grounded in Vector DB
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px]">
                          {doc.pages} pgs
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        <span className="rounded-lg bg-sky-50 border border-sky-200/60 px-2 py-0.5 text-[11px] text-sky-800 font-bold">
                          {doc.chunks} chunks
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={onSwitchToChat}
                          className="inline-flex items-center gap-1 rounded-lg bg-white border border-sky-200 px-3 py-1.5 text-xs font-bold text-sky-700 hover:bg-sky-600 hover:text-white hover:border-sky-600 transition shadow-2xs group-hover:border-sky-300"
                        >
                          <span>Query File</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

