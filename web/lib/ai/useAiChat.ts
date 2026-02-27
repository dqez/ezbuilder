"use client";

import { useCallback, useRef, useState } from "react";
import { useEditor } from "@craftjs/core";
import { aiApi } from "@/lib/api/ai";
import { EzBuilderResponseParser } from "./response-parser";
import { useCraftActionExecutor } from "./craft-action-executor";
import { useAiStore } from "@/lib/stores/ai-store";

interface UseAiChatOptions {
  pageId: string;
  /** Optional: node context for inline one-shot chat */
  nodeContext?: { nodeId: string; nodeName: string };
  /** Use global panel state (store messages). False = one-shot, no history */
  useGlobalState?: boolean;
}

interface UseAiChatReturn {
  handleSend: (text: string) => Promise<void>;
  isSending: boolean;
  /** Only populated when useGlobalState=false (inline one-shot) */
  inlineResponse: string;
  clearInlineResponse: () => void;
}

export function useAiChat({
  pageId,
  nodeContext,
  useGlobalState = true,
}: UseAiChatOptions): UseAiChatReturn {
  const [isSending, setIsSending] = useState(false);
  const [inlineResponse, setInlineResponse] = useState("");
  const parserRef = useRef<EzBuilderResponseParser | null>(null);

  const { query } = useEditor();
  const { executeAction } = useCraftActionExecutor();
  const {
    currentChatId,
    addMessage,
    appendToLastMessage,
    addActionToLastMessage,
    setStreaming,
    setChatId,
  } = useAiStore();

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || isSending) return;
      setIsSending(true);

      if (useGlobalState) {
        addMessage({
          id: Date.now().toString(),
          role: "user",
          content: text,
          timestamp: new Date(),
        });
        addMessage({
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "",
          timestamp: new Date(),
        });
        setStreaming(true);
      } else {
        setInlineResponse("");
      }

      parserRef.current = new EzBuilderResponseParser();

      try {
        const canvasState = query.serialize();

        const stream = await aiApi.chat({
          chatId: useGlobalState ? (currentChatId ?? undefined) : undefined,
          pageId,
          message: nodeContext
            ? `[Component: ${nodeContext.nodeName} (id: ${nodeContext.nodeId})]\n${text}`
            : text,
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
            if (!line.startsWith("data: ")) continue;
            const data = JSON.parse(line.slice(6));

            if (data.type === "chat_id" && useGlobalState) {
              setChatId(data.chatId);
            } else if (data.type === "text") {
              if (useGlobalState) {
                appendToLastMessage(data.content);
              } else {
                setInlineResponse((prev) => prev + data.content);
              }

              if (parserRef.current) {
                parserRef.current.parseChunk(data.content);
                const newActions = parserRef.current.extractActions();
                newActions.forEach((action) => {
                  const success = executeAction(action);
                  if (success && useGlobalState) {
                    addActionToLastMessage({
                      type: action.type,
                      component: action.data.component,
                      nodeId: action.nodeId,
                    });
                  }
                });
              }
            } else if (data.type === "done") {
              if (useGlobalState) setStreaming(false);
              parserRef.current = null;
            } else if (data.type === "error") {
              const errMsg = `⚠️ ${data.message || data.error}`;
              if (useGlobalState) {
                appendToLastMessage(`\n\n${errMsg}`);
                setStreaming(false);
              } else {
                setInlineResponse((prev) => prev + `\n${errMsg}`);
              }
              parserRef.current = null;
            }
          }
        }
      } catch (error) {
        console.error("AI chat error:", error);
        const errMsg = "⚠️ Có lỗi xảy ra. Vui lòng thử lại.";
        if (useGlobalState) {
          appendToLastMessage(`\n\n${errMsg}`);
          setStreaming(false);
        } else {
          setInlineResponse((prev) => prev + `\n${errMsg}`);
        }
        parserRef.current = null;
      } finally {
        setIsSending(false);
      }
    },
    [
      isSending,
      useGlobalState,
      pageId,
      nodeContext,
      query,
      currentChatId,
      addMessage,
      appendToLastMessage,
      addActionToLastMessage,
      setStreaming,
      setChatId,
      executeAction,
    ],
  );

  return {
    handleSend,
    isSending,
    inlineResponse,
    clearInlineResponse: () => setInlineResponse(""),
  };
}
