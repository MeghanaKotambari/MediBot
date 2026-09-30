"use client";

import React, { useState, useRef, useEffect } from "react";
import { api, ChatMessage, User } from "@/lib/api";
import { MedicalLogo } from "@/components/MedicalLogo";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import {
  Send,
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  RotateCcw,
  Paperclip,
  LogIn,
  SlidersHorizontal,
  Sparkles,
  FileText,
  Activity,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";

interface ChatViewProps {
  user: User | null;
  onOpenAuth: () => void;
  onSwitchToDocuments: () => void;
  initialConversationId?: string | null;
  onConversationUpdated?: () => void;
}

const CLINICAL_PROMPTS = [
  {
    category: "Treatment & Efficacy",
    badge: "Clinical Summary",
    icon: "📋",
    prompt: "Summarize key findings and treatment recommendations in the document.",
    desc: "Extract primary therapeutic recommendations and conclusions",
  },
  {
    category: "Pharmacology",
    badge: "Dosage & Safety",
    icon: "💊",
    prompt: "What dosages, precautions, or contraindications are specified?",
    desc: "Verify administration guidelines, risks, and contraindications",
  },
  {
    category: "Diagnostics",
    badge: "Clinical Criteria",
    icon: "🔬",
    prompt: "List the primary clinical guidelines and patient diagnostic criteria.",
    desc: "Map inclusion criteria, diagnostic indicators, and metrics",
  },
];

export const ChatView: React.FC<ChatViewProps> = ({
  user,
  onOpenAuth,
  onSwitchToDocuments,
  initialConversationId = null,
  onConversationUpdated,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [topK, setTopK] = useState(3);
  const [conversationId, setConversationId] = useState<string | undefined>(
    initialConversationId || undefined
  );
  const [expandedSources, setExpandedSources] = useState<Record<number, boolean>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load existing messages when selecting a past conversation from sidebar
  useEffect(() => {
    if (initialConversationId) {
      setConversationId(initialConversationId);
      setLoading(true);
      api
        .getConversationMessages(initialConversationId)
        .then((msgs) => {
          if (Array.isArray(msgs)) setMessages(msgs);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setConversationId(undefined);
      setMessages([]);
    }
  }, [initialConversationId]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    if (!user) {
      onOpenAuth();
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput("");
    setLoading(true);

    try {
      const response = await api.sendMessage(textToSend, conversationId, topK);
      if (response.conversation_id) {
        setConversationId(response.conversation_id);
        onConversationUpdated?.();
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.answer,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Clinical retrieval notice: ${err.message || "Please ensure you have uploaded documents in the Documents tab."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDirectPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!user) {
      onOpenAuth();
      return;
    }

    setUploadingPdf(true);
    setUploadNotice(`Analyzing & indexing "${file.name}"...`);

    try {
      const res = await api.uploadDocument(file);
      setUploadNotice(
        `✓ "${res.data.document_name}" successfully indexed (${res.data.chunks} chunks, ${res.data.pages} pages)`
      );
      setTimeout(() => setUploadNotice(null), 5000);
    } catch (err: any) {
      setUploadNotice(`Upload failed: ${err.message}`);
    } finally {
      setUploadingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(undefined);
    onConversationUpdated?.();
  };

  return (
    <div className="flex flex-col h-screen bg-transparent">
      {/* Top Clinical Header */}
      <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 z-10 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 border border-sky-200 text-sky-600 shadow-2xs">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Clinical Inquiry Console</h2>
              <span className="flex items-center gap-1 rounded-full bg-sky-50 border border-sky-200/80 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                Grounded RAG
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Document-verified neural retrieval engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Top_k Context Chunks selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white/90 border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
            <SlidersHorizontal className="h-3.5 w-3.5 text-sky-600" />
            <span className="text-[11px] font-medium text-slate-500">Source Depth:</span>
            <select
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="bg-transparent font-semibold text-slate-900 outline-none cursor-pointer"
            >
              <option value={2}>2 Sources</option>
              <option value={3}>3 Sources</option>
              <option value={5}>5 Sources</option>
              <option value={8}>8 Sources</option>
            </select>
          </div>

          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100/70 transition shadow-2xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-medium">Reset Session</span>
          </button>
        </div>
      </header>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Upload Notice Banner */}
          {uploadNotice && (
            <div className="rounded-2xl border border-sky-200 bg-white/90 backdrop-blur-md p-3.5 text-xs text-sky-900 flex items-center justify-between shadow-soft animate-in fade-in">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-sky-600" />
                <span className="font-medium">{uploadNotice}</span>
              </div>
              {uploadingPdf && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
              )}
            </div>
          )}

          {/* Empty State / Welcome Screen */}
          {messages.length === 0 && (
            <div className="py-10 text-center space-y-6">
              <div className="relative inline-block">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-sky-400/20 via-blue-500/20 to-teal-400/20 blur-xl animate-pulse-slow" />
                <MedicalLogo size="xl" showText={false} className="relative mx-auto" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50/80 px-3 py-1 text-xs font-semibold text-sky-800">
                  <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                  <span>Clinical Intelligence Engine</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900">
                  Document-Grounded Medical Intelligence
                </h3>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Query medical guidelines, clinical trials, dosages, and research literature with verified citations and semantic vector grounding.
                </p>
              </div>

              {!user ? (
                <div className="inline-flex items-center gap-4 rounded-2xl border border-sky-200 bg-white/95 backdrop-blur-md p-4 shadow-glass">
                  <span className="text-xs font-medium text-slate-700">
                    Sign in to your clinical account to query indexed documents
                  </span>
                  <button
                    onClick={onOpenAuth}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-sky-600 hover:to-blue-700 transition"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    <span>Sign In Now</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 max-w-2xl mx-auto space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Suggested Clinical Inquiries
                    </span>
                    <button
                      onClick={onSwitchToDocuments}
                      className="text-[11px] font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                    >
                      <span>Manage Documents</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CLINICAL_PROMPTS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(item.prompt)}
                        className="group text-left rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md p-4 hover:border-sky-300 hover:bg-gradient-to-b hover:from-white hover:to-sky-50/50 transition-all duration-200 shadow-soft hover:shadow-med flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-base">{item.icon}</span>
                            <span className="rounded-full bg-sky-50 border border-sky-200/60 px-2 py-0.5 text-[9px] font-bold text-sky-700">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2">
                            {item.prompt}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 line-clamp-1">
                          {item.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Messages Stream */}
          {messages.map((msg, index) => {
            const isAssistant = msg.role === "assistant";

            return (
              <div
                key={index}
                className={`flex gap-3 animate-in fade-in-50 duration-200 ${
                  isAssistant ? "items-start" : "items-end justify-end"
                }`}
              >
                {isAssistant && (
                  <MedicalLogo size="sm" showText={false} className="shrink-0 mt-1" />
                )}

                <div
                  className={`flex flex-col gap-1.5 max-w-[85%] sm:max-w-[80%] ${
                    isAssistant ? "items-start" : "items-end"
                  }`}
                >
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed transition-all ${
                      isAssistant
                        ? "bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-800 shadow-glass rounded-tl-sm border-l-4 border-l-sky-500"
                        : "bg-gradient-to-r from-sky-600 to-blue-700 text-white font-normal shadow-md shadow-blue-500/15 rounded-tr-sm"
                    }`}
                  >
                    {isAssistant ? (
                      <MarkdownRenderer
                        content={msg.content}
                        onSourceClick={() =>
                          setExpandedSources((prev) => ({
                            ...prev,
                            [index]: true,
                          }))
                        }
                      />
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}

                    {isAssistant && msg.content && (
                      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{msg.timestamp || "MediBot Clinical AI"}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(msg.content, index)}
                          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-semibold text-[10px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span className="text-[10px]">Copy Answer</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Sources Accordion */}
                  {isAssistant && msg.sources && msg.sources.length > 0 && (
                    <div className="w-full rounded-2xl border border-sky-200 bg-sky-50/70 backdrop-blur-sm p-3 text-xs shadow-2xs">
                      <button
                        onClick={() =>
                          setExpandedSources((prev) => ({
                            ...prev,
                            [index]: !prev[index],
                          }))
                        }
                        className="flex w-full items-center justify-between font-bold text-sky-800"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 text-sky-600" />
                          <span>Verified Citations ({msg.sources.length} sources)</span>
                        </div>
                        {expandedSources[index] ? (
                          <ChevronUp className="h-4 w-4 text-sky-600" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-sky-600" />
                        )}
                      </button>

                      {expandedSources[index] && (
                        <div className="mt-2.5 space-y-2 border-t border-sky-200/60 pt-2.5">
                          {msg.sources.map((src, sIdx) => (
                            <div
                              key={sIdx}
                              className="rounded-xl border border-slate-200 bg-white/95 p-3 text-xs shadow-2xs"
                            >
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <div className="flex items-center gap-1.5 truncate">
                                  <FileText className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                                  <span className="font-bold text-slate-900 truncate">
                                    {src.document_name}
                                  </span>
                                </div>
                                {src.page_number && (
                                  <span className="shrink-0 rounded-full bg-sky-100 border border-sky-200 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                                    Page {src.page_number}
                                  </span>
                                )}
                              </div>
                              {src.text && (
                                <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-3">
                                  &ldquo;{src.text}&rdquo;
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!isAssistant && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-xs">
                    <UserIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 rounded-2xl border border-sky-200 bg-white/90 backdrop-blur-md p-3 text-xs text-sky-900 shadow-2xs">
              <span className="h-3 w-3 rounded-full bg-sky-500 animate-ping" />
              <span className="font-medium">Synthesizing clinical knowledge and checking citations...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom High-Visibility Clinical Input Bar */}
      <footer className="p-4 sm:p-5 border-t-2 border-slate-200 bg-white/95 backdrop-blur-2xl shrink-0 z-10 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleDirectPdfUpload}
          />

          <div className="flex items-center gap-2.5 rounded-2xl border-2 border-slate-300 bg-white p-2.5 sm:p-3 focus-within:border-sky-600 focus-within:ring-4 focus-within:ring-sky-100 transition-all duration-200 shadow-md hover:border-slate-400">
            <button
              onClick={() => {
                if (!user) onOpenAuth();
                else fileInputRef.current?.click();
              }}
              title="Upload and index clinical PDF"
              disabled={uploadingPdf}
              className="p-2.5 text-slate-700 hover:text-sky-600 rounded-xl bg-slate-100 hover:bg-sky-50 border border-slate-200 transition shrink-0 shadow-2xs"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                user
                  ? "Inquire about drug dosages, contraindications, or clinical guidelines..."
                  : "Sign in to query your medical documents..."
              }
              rows={1}
              className="flex-1 resize-none bg-transparent px-2.5 py-1 text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-500 placeholder:font-normal outline-none max-h-32 leading-relaxed"
            />

            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white hover:from-sky-600 hover:to-blue-700 transition shadow-md shadow-sky-500/30 hover:scale-105 active:scale-95 disabled:opacity-35 disabled:hover:scale-100 disabled:shadow-none"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2.5 flex items-center justify-between px-2 text-xs text-slate-500 font-semibold">
            <span>Press Enter to submit inquiry, Shift + Enter for new line</span>
            <span className="flex items-center gap-1.5 text-sky-800 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Verified Vector Citations
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};


