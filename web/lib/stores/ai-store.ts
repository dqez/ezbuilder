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

interface AiState {
  // Chat state
  currentChatId: string | null;
  messages: AiMessage[];
  isStreaming: boolean;
  isPanelOpen: boolean;

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
}

export const useAiStore = create<AiState>((set) => ({
  currentChatId: null,
  messages: [],
  isStreaming: false,
  isPanelOpen: false,

  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),

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
