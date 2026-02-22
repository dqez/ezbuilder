import { create } from "zustand";

interface AiMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  actions?: Array<{
    type: string;
    component?: string;
    nodeId?: string;
  }>;
}

export interface AiPromptTemplate {
  id: string;
  name: string;
  category: string;
  prompt: string;
  isSystem: boolean;
  sortOrder: number;
}

interface AiState {
  // Chat state
  currentChatId: string | null;
  messages: AiMessage[];
  isStreaming: boolean;
  isPanelOpen: boolean;
  templates: AiPromptTemplate[];

  // Actions
  togglePanel: () => void;
  addMessage: (message: AiMessage) => void;
  appendToLastMessage: (chunk: string) => void;
  addActionToLastMessage: (action: {
    type: string;
    component?: string;
    nodeId?: string;
  }) => void;
  setStreaming: (streaming: boolean) => void;
  setChatId: (chatId: string) => void;
  clearChat: () => void;
  fetchTemplates: () => Promise<void>;
  loadChat: (chatId: string) => Promise<void>;
}

import { aiApi } from "../api/ai";

export const useAiStore = create<AiState>((set) => ({
  currentChatId: null,
  messages: [],
  isStreaming: false,
  isPanelOpen: false,
  templates: [],

  fetchTemplates: async () => {
    try {
      const templates = await aiApi.getTemplates();
      set({ templates });
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  },

  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),

  loadChat: async (chatId: string) => {
    try {
      const chat = await aiApi.getChat(chatId);
      if (chat) {
        set({
          currentChatId: chat.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          messages: chat.messages.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: new Date(m.createdAt),
            actions: m.metadata?.actions || [],
          })),
          isPanelOpen: true,
        });
      }
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  },

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  appendToLastMessage: (chunk) =>
    set((state) => {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === "assistant") {
        lastMessage.content += chunk;
      }
      return { messages };
    }),

  addActionToLastMessage: (action) =>
    set((state) => {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === "assistant") {
        if (!lastMessage.actions) {
          lastMessage.actions = [];
        }
        lastMessage.actions.push(action);
      }
      return { messages };
    }),

  setStreaming: (streaming) => set({ isStreaming: streaming }),

  setChatId: (chatId) => set({ currentChatId: chatId }),

  clearChat: () => set({ currentChatId: null, messages: [] }),
}));
