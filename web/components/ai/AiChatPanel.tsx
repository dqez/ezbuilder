"use client";

import { useAiStore } from "@/lib/stores/ai-store";
import { AiChatMessage } from "./AiChatMessage";
import { AiChatInput } from "./AiChatInput";
import { AiStreamingIndicator } from "./AiStreamingIndicator";

import {
  X,
  Bot,
  History,
  ArrowLeft,
  MessageSquare,
  Plus,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
  const {
    isPanelOpen,
    togglePanel,
    messages,
    isStreaming,
    loadChat,
    clearChat,
  } = useAiStore();
  const [view, setView] = useState<"chat" | "history">("chat");
  const [historyList, setHistoryList] = useState<HistoryChat[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

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

  const handleNewChat = () => {
    clearChat();
    setView("chat");
  };

  const isEmpty = messages.length === 0;

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-6 right-6 w-[400px] h-[640px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-6rem)] bg-background border shadow-2xl rounded-2xl flex flex-col z-100 overflow-hidden"
        >
          {/* Header */}
          <div className="p-3 border-b flex items-center justify-between bg-muted/20 shrink-0">
            <div className="flex items-center gap-2.5">
              {view === "history" ? (
                <button
                  onClick={() => setView("chat")}
                  className="p-1.5 -ml-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-sm leading-tight">
                  {view === "history" ? "Lịch sử trò chuyện" : "Trợ lý AI"}
                </h3>
                {view === "chat" && (
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 relative block">
                      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                    </span>
                    {isEmpty ? "Sẵn sàng tạo website" : "Đang hỗ trợ"}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {view === "chat" && (
                <>
                  {!isEmpty && (
                    <button
                      onClick={handleNewChat}
                      className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-muted transition-colors"
                      title="Cuộc trò chuyện mới"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setView("history")}
                    className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-muted transition-colors"
                    title="Lịch sử"
                  >
                    <History className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={togglePanel}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* History view */}
          {view === "history" ? (
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              <button
                onClick={handleNewChat}
                className="flex items-center gap-2 p-3 rounded-xl border border-dashed hover:border-primary/50 hover:bg-primary/5 transition-colors text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Cuộc trò chuyện mới
              </button>
              {isLoadingHistory ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : historyList.length === 0 ? (
                <div className="text-center text-muted-foreground mt-8 text-sm">
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
                      <MessageSquare className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">
                        {chat.title || "Cuộc trò chuyện mới"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-5">
                      {new Date(chat.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </button>
                ))
              )}
            </div>
          ) : (
            <>
              {/* Chat area */}
              <div className="flex-1 overflow-y-auto px-3 py-4 scroll-smooth">
                {/* Onboarding empty state */}
                {isEmpty && (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-base">
                        Chào mừng đến với Trợ lý AI!
                      </p>
                      <p className="text-sm text-muted-foreground mt-2 max-w-[260px] leading-relaxed">
                        Mô tả trang web bạn muốn tạo, hoặc chọn gợi ý bên dưới
                        để bắt đầu nhanh.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-full mt-2">
                      {[
                        {
                          emoji: "🌐",
                          label: "Trang giới thiệu",
                          desc: "Professional business page",
                        },
                        {
                          emoji: "🛒",
                          label: "Landing Page",
                          desc: "High-converting sales page",
                        },
                        {
                          emoji: "🎨",
                          label: "Portfolio",
                          desc: "Showcase your work",
                        },
                        {
                          emoji: "📰",
                          label: "Blog / News",
                          desc: "Content-focused layout",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="p-2.5 rounded-xl border bg-muted/20 text-left text-xs"
                        >
                          <span className="text-base">{item.emoji}</span>
                          <p className="font-medium mt-1">{item.label}</p>
                          <p className="text-muted-foreground text-[10px]">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages */}
                {messages.map((msg) => (
                  <AiChatMessage
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    actions={msg.actions}
                  />
                ))}
                {isStreaming && <AiStreamingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="border-t bg-muted/5">
                <AiChatInput pageId={pageId} />
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
