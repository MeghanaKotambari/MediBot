const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface User {
  id?: string;
  _id?: string;
  name?: string;
  email: string;
}

export interface DocumentItem {
  id: string;
  document_name: string;
  pages: number;
  chunks: number;
  created_at: string;
}

export interface DocumentUploadResponse {
  message: string;
  data: {
    document_id: string;
    document_name: string;
    pages: number;
    chunks: number;
    database_id?: string;
  };
}

export interface Source {
  document_name: string;
  page_number?: number | string;
  section?: string;
  text?: string;
  score?: number;
}

export interface ChatResponse {
  answer: string;
  conversation_id: string;
  sources: Source[];
}

export interface Conversation {
  id: string;
  title?: string;
  created_at?: string;
  messages_count?: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  sources?: Source[];
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("medibot_token");
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("medibot_token", token);
}

export function removeAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("medibot_token");
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

export const api = {
  // Health
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(err.detail || "Invalid email or password");
    }
    const data = await res.json();
    setAuthToken(data.access_token);
    return data;
  },

  register: async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Registration failed" }));
      throw new Error(err.detail || "Could not register account");
    }
    return res.json();
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = getAuthToken();
    if (!token) return null;
    const res = await fetchWithAuth("/auth/me");
    if (!res.ok) {
      removeAuthToken();
      return null;
    }
    return res.json();
  },

  // Documents
  getDocuments: async (): Promise<DocumentItem[]> => {
    const res = await fetchWithAuth("/documents/");
    if (!res.ok) {
      throw new Error("Failed to load documents");
    }
    return res.json();
  },

  uploadDocument: async (file: File): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetchWithAuth("/documents/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Upload failed" }));
      throw new Error(err.detail || "Failed to process and embed PDF");
    }
    return res.json();
  },

  // Chat
  sendMessage: async (
    question: string,
    conversation_id?: string,
    top_k: number = 4
  ): Promise<ChatResponse> => {
    const res = await fetchWithAuth("/chat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        conversation_id: conversation_id || null,
        top_k,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Chat query failed" }));
      throw new Error(err.detail || "Failed to get AI answer");
    }
    return res.json();
  },

  // Chat History
  getChatHistory: async () => {
    const res = await fetchWithAuth("/chat/history");
    if (!res.ok) {
      return [];
    }
    return res.json();
  },

  getConversationMessages: async (conversationId: string): Promise<ChatMessage[]> => {
    const res = await fetchWithAuth(`/chat/${conversationId}/messages`);
    if (!res.ok) {
      return [];
    }
    return res.json();
  },

  // 1-Click Quick Demo Login for instant testing
  quickDemoLogin: async () => {
    const demoEmail = "dr.demo@medibot.health";
    const demoPassword = "DemoPassword123!";
    try {
      await api.login(demoEmail, demoPassword);
    } catch {
      try {
        await api.register("Dr. Alex Demo", demoEmail, demoPassword);
        await api.login(demoEmail, demoPassword);
      } catch (err: any) {
        throw new Error(err.message || "Failed to start demo session");
      }
    }
    return api.getCurrentUser();
  },

  // Direct Semantic Search
  search: async (query: string, top_k: number = 5) => {
    const res = await fetchWithAuth(
      `/search/?query=${encodeURIComponent(query)}&top_k=${top_k}`
    );
    if (!res.ok) {
      throw new Error("Search failed");
    }
    return res.json();
  },
};
