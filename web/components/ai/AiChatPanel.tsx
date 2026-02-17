"use client";

import { useAiStore } from "@/lib/stores/ai-store";
import { AiChatMessage } from "./AiChatMessage";
import { AiChatInput } from "./AiChatInput";
import { AiStreamingIndicator } from "./AiStreamingIndicator";

interface AiChatPanelProps {
  pageId: string;
}

export function AiChatPanel({ pageId }: AiChatPanelProps) {
  const { isPanelOpen, togglePanel, messages, isStreaming } = useAiStore();

  if (!isPanelOpen) return null;

  return (
    <div className="w-80 border-l bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">AI Assistant</h3>
        <button
          onClick={togglePanel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Xin chào! 👋</p>
            <p className="text-sm mt-2">
              Tôi có thể giúp bạn tạo components cho website.
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <AiChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {isStreaming && <AiStreamingIndicator />}
      </div>

      {/* Input */}
      <AiChatInput pageId={pageId} />
    </div>
  );
}
