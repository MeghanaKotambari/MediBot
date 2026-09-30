"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatView } from "@/components/ChatView";
import { DocumentsView } from "@/components/DocumentsView";
import { SearchView } from "@/components/SearchView";
import { SplashScreen } from "@/components/SplashScreen";
import { LandingPage } from "@/components/LandingPage";
import { AuthModal } from "@/components/AuthModal";
import { MedicalBackground } from "@/components/MedicalBackground";
import { api, removeAuthToken, User } from "@/lib/api";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [viewMode, setViewMode] = useState<"landing" | "workspace">("landing");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [activeTab, setActiveTab] = useState<"chat" | "documents" | "search">("chat");
  const [user, setUser] = useState<User | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [documentCount, setDocumentCount] = useState<number>(0);
  const [chatKey, setChatKey] = useState<number>(0);
  const [authChecked, setAuthChecked] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState<number>(0);

  // Check health and persistent authentication on initial load
  const loadUserAndDocs = useCallback(async () => {
    try {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        setViewMode("workspace");
        const docs = await api.getDocuments();
        if (Array.isArray(docs)) setDocumentCount(docs.length);
      } else {
        setViewMode("landing");
      }
    } catch {
      setUser(null);
      setDocumentCount(0);
      setViewMode("landing");
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const isOnline = await api.checkHealth();
      setBackendOnline(isOnline);
      await loadUserAndDocs();
    };

    init();
    const interval = setInterval(async () => {
      const isOnline = await api.checkHealth();
      setBackendOnline(isOnline);
    }, 15000);

    return () => clearInterval(interval);
  }, [loadUserAndDocs]);

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    setDocumentCount(0);
    setSelectedConversationId(null);
    setViewMode("landing");
  };

  const handleNewChat = () => {
    setSelectedConversationId(null);
    setChatKey((prev) => prev + 1);
  };

  const handleSelectConversation = (convId: string) => {
    setSelectedConversationId(convId);
    setActiveTab("chat");
    setChatKey((prev) => prev + 1);
  };

  const handleConversationUpdated = () => {
    setHistoryRefreshKey((prev) => prev + 1);
  };

  const handleOpenAuth = (mode: "login" | "register" = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (loggedUser: User) => {
    setUser(loggedUser);
    setIsAuthModalOpen(false);
    setViewMode("workspace");
    loadUserAndDocs();
  };

  // 1. Initial Splash Screen
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // 2. Landing Page View (unauthenticated or landing mode)
  if (viewMode === "landing" || (!user && authChecked)) {
    return (
      <>
        <LandingPage
          user={user}
          backendOnline={backendOnline}
          onOpenAuth={handleOpenAuth}
          onLaunchApp={() => {
            if (user) {
              setViewMode("workspace");
            } else {
              handleOpenAuth("login");
            }
          }}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  // 3. Authenticated Clinical Workspace Dashboard
  return (
    <div className="relative flex h-screen w-screen overflow-hidden font-sans">
      {/* Dynamic Ambient Medical Background */}
      <MedicalBackground showEkg={true} intensity="medium" />

      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => handleOpenAuth("login")}
        onLogout={handleLogout}
        onNewChat={handleNewChat}
        backendOnline={backendOnline}
        documentCount={documentCount}
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
        historyRefreshKey={historyRefreshKey}
      />

      {/* Main Workspace Stage */}
      <main className="relative z-10 flex-1 h-screen overflow-hidden flex flex-col bg-transparent">
        {activeTab === "chat" && (
          <ChatView
            key={chatKey}
            user={user}
            onOpenAuth={() => handleOpenAuth("login")}
            onSwitchToDocuments={() => setActiveTab("documents")}
            initialConversationId={selectedConversationId}
            onConversationUpdated={handleConversationUpdated}
          />
        )}

        {activeTab === "documents" && (
          <div className="flex-1 overflow-y-auto">
            <DocumentsView
              user={user}
              onOpenAuth={() => handleOpenAuth("login")}
              onSwitchToChat={() => setActiveTab("chat")}
            />
          </div>
        )}

        {activeTab === "search" && (
          <div className="flex-1 overflow-y-auto">
            <SearchView
              user={user}
              onOpenAuth={() => handleOpenAuth("login")}
            />
          </div>
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
