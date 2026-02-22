"use client";

import { useAiStore } from "@/lib/stores/ai-store";
import { AiChatMessage } from "./AiChatMessage";
import { AiChatInput } from "./AiChatInput";
import { AiStreamingIndicator } from "./AiStreamingIndicator";

import { X, Bot, History, ArrowLeft, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { aiApi } from "@/lib/api/ai";
import { motion, AnimatePresence } from "framer-motion";

interface AiChatPanelProps {
  pageId: string;
}

interface HistoryChat {
  id: string;
  title: string | null;
  createdAt: string | Date;
}

export function AiChatPanel({ pageId }: AiChatPanelProps) {
  const { isPanelOpen, togglePanel, messages, isStreaming, loadChat } =
    useAiStore();
  const [view, setView] = useState<"chat" | "history">("chat");
  const [historyList, setHistoryList] = useState<HistoryChat[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const chats = await aiApi.getChats(pageId);
        setHistoryList(chats);
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    if (view === "history" && isPanelOpen) {
      fetchHistory();
    }
  }, [view, isPanelOpen, pageId]);

  const handleSelectChat = async (chatId: string) => {
    await loadChat(chatId);
    setView("chat");
  };

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-6 right-6 w-[380px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-6rem)] bg-background border shadow-2xl rounded-2xl flex flex-col z-100 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-2">
              {view === "history" ? (
                <button
                  onClick={() => setView("chat")}
                  className="p-1.5 -ml-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-sm">
                  {view === "history" ? "Lịch sử trò chuyện" : "AI Assistant"}
                </h3>
                {view === "chat" && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 relative block">
                      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                    </span>
                    Sẵn sàng chờ lệnh
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {view === "chat" && (
                <button
                  onClick={() => setView("history")}
                  className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-muted transition-colors"
                  title="Lịch sử"
                >
                  <History className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={togglePanel}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body content based on view */}
          {view === "history" ? (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {isLoadingHistory ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : historyList.length === 0 ? (
                <div className="text-center text-muted-foreground mt-8">
                  Chưa có lịch sử trò chuyện nào.
                </div>
              ) : (
                historyList.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    className="flex flex-col text-left p-3 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-colors gap-1"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <span className="truncate">
                        {chat.title || "Cuộc trò chuyện mới"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-6">
                      {new Date(chat.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </button>
                ))
              )}
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground mt-8 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                      <Bot className="w-6 h-6 text-primary/40" />
                    </div>
                    <p className="font-medium text-foreground">Xin chào!</p>
                    <p className="text-sm mt-2 max-w-[250px]">
                      Tôi là trợ lý AI. Tôi có thể giúp bạn tạo components và
                      chỉnh sửa trang web này!
                    </p>
                  </div>
                )}
                {messages.map((msg) => (
                  <AiChatMessage
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                  />
                ))}
                {isStreaming && <AiStreamingIndicator />}
              </div>

              {/* Input */}
              <div className="p-2 bg-background">
                <AiChatInput pageId={pageId} />
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
