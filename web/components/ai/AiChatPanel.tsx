"use client";

import { useAiStore } from "@/lib/stores/ai-store";
import { AiChatMessage } from "./AiChatMessage";
import { AiChatInput } from "./AiChatInput";
import { AiStreamingIndicator } from "./AiStreamingIndicator";

import { motion, AnimatePresence } from "framer-motion";
import { X, Bot } from "lucide-react";

interface AiChatPanelProps {
  pageId: string;
}

export function AiChatPanel({ pageId }: AiChatPanelProps) {
  const { isPanelOpen, togglePanel, messages, isStreaming } = useAiStore();

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
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Assistant</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 relative block">
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                  </span>
                  Sẵn sàng chờ lệnh
                </p>
              </div>
            </div>
            <button
              onClick={togglePanel}
              className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground mt-8 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-primary/40" />
                </div>
                <p className="font-medium text-foreground">Xin chào!</p>
                <p className="text-sm mt-2 max-w-[250px]">
                  Tôi là trợ lý AI. Tôi có thể giúp bạn tạo components và chỉnh
                  sửa trang web này!
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
          <div className="p-2 border-t bg-background">
            <AiChatInput pageId={pageId} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
