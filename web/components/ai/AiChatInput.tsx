"use client";

import { useState, useRef } from "react";
import { useEditor } from "@craftjs/core";
import { useAiStore } from "@/lib/stores/ai-store";
import { aiApi } from "@/lib/api/ai";
import { EzBuilderResponseParser } from "@/lib/ai/response-parser";
import { useCraftActionExecutor } from "@/lib/ai/craft-action-executor";

interface AiChatInputProps {
  pageId: string;
}

export function AiChatInput({ pageId }: AiChatInputProps) {
  const [input, setInput] = useState("");
  const {
    currentChatId,
    addMessage,
    appendToLastMessage,
    addActionToLastMessage,
    setStreaming,
    setChatId,
  } = useAiStore();

  const { query } = useEditor();
  const { executeAction } = useCraftActionExecutor();
  const parserRef = useRef<EzBuilderResponseParser | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput("");
    setStreaming(true);

    // Add empty assistant message
    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant" as const,
      content: "",
      timestamp: new Date(),
    };
    addMessage(assistantMessage);

    // Create parser for this response
    parserRef.current = new EzBuilderResponseParser();

    try {
      // Get current canvas state
      const canvasState = query.serialize();

      const stream = await aiApi.chat({
        chatId: currentChatId || undefined,
        pageId,
        message: input,
        canvasState: JSON.parse(canvasState),
      });

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            if (data.type === "chat_id") {
              setChatId(data.chatId);
            } else if (data.type === "text") {
              // Append raw content immediately
              appendToLastMessage(data.content);

              // Parse chunk for actions logic
              if (parserRef.current) {
                parserRef.current.parseChunk(data.content);

                // Debug: Log parser state
                console.log("📦 Parser buffer:", parserRef.current.getBuffer());

                const newActions = parserRef.current.extractActions();

                if (newActions.length > 0) {
                  console.log("🎯 Extracted actions:", newActions);
                }

                newActions.forEach((action) => {
                  console.log(
                    "⚡ Executing action:",
                    JSON.stringify(action, null, 2),
                  );
                  const success = executeAction(action);
                  if (success) {
                    addActionToLastMessage({
                      type: action.type,
                      component: action.data.component,
                      nodeId: action.nodeId,
                    });
                  }
                });
              }
            } else if (data.type === "done") {
              setStreaming(false);
              parserRef.current = null;
            } else if (data.type === "error") {
              console.error("AI Stream Error:", data.error);
              appendToLastMessage(`\n\nError: ${data.error}`);
              setStreaming(false);
              parserRef.current = null;
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setStreaming(false);
      parserRef.current = null;
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Mô tả gì đó bạn muốn tạo..."
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
