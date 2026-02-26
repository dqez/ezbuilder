"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useEditor } from "@craftjs/core";
import { useAiStore } from "@/lib/stores/ai-store";
import { aiApi } from "@/lib/api/ai";
import { EzBuilderResponseParser } from "@/lib/ai/response-parser";
import { useCraftActionExecutor } from "@/lib/ai/craft-action-executor";
import { SendHorizonal, Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiChatInputProps {
  pageId: string;
  onFirstMessage?: () => void;
}

// Smart contextual suggestions shown when canvas has content
const SMART_SUGGESTIONS = [
  {
    label: "Thêm phần Hero",
    prompt: "Thêm một phần Hero đẹp mắt với tiêu đề lớn, mô tả ngắn và nút CTA",
  },
  {
    label: "Cải thiện layout",
    prompt:
      "Xem xét layout hiện tại và đề xuất cách cải thiện trải nghiệm người dùng",
  },
  {
    label: "Thêm Testimonial",
    prompt:
      "Thêm một section đánh giá khách hàng (testimonials) dưới phần Hero",
  },
  {
    label: "Thêm Contact form",
    prompt: "Tạo một phần liên hệ với form email và số điện thoại",
  },
  {
    label: "Thêm Features grid",
    prompt: "Thêm section tính năng nổi bật dạng grid 3 cột với icon",
  },
  {
    label: "Thêm Footer",
    prompt: "Tạo footer đầy đủ với links, copyright và thông tin liên hệ",
  },
];

// Onboarding suggestions shown when canvas is empty
const ONBOARDING_SUGGESTIONS = [
  {
    label: "🏢 Tạo trang Doanh nghiệp",
    prompt:
      "Tạo cho tôi một trang web doanh nghiệp chuyên nghiệp gồm: Hero section với tiêu đề ấn tượng, phần Dịch vụ, phần Về chúng tôi, và Footer",
  },
  {
    label: "🛍️ Tạo Landing Page bán hàng",
    prompt:
      "Tạo landing page bán sản phẩm với hero section, benefits, testimonials, và CTA nổi bật",
  },
  {
    label: "💼 Tạo Portfolio cá nhân",
    prompt:
      "Tạo trang portfolio cá nhân với phần giới thiệu, skills, projects showcase và contact form",
  },
  {
    label: "📝 Tạo trang Blog",
    prompt:
      "Tạo layout trang blog với header, danh sách bài viết dạng card và sidebar",
  },
];

export function AiChatInput({ pageId, onFirstMessage }: AiChatInputProps) {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const {
    currentChatId,
    messages,
    addMessage,
    appendToLastMessage,
    addActionToLastMessage,
    setStreaming,
    setChatId,
    templates,
    fetchTemplates,
    isPanelOpen,
  } = useAiStore();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isEmptyCanvas = messages.length === 0;

  useEffect(() => {
    if (isPanelOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isPanelOpen]);

  const { query } = useEditor();
  const { executeAction } = useCraftActionExecutor();
  const parserRef = useRef<EzBuilderResponseParser | null>(null);

  const handleSend = useCallback(
    async (messageText?: string) => {
      const text = messageText || input;
      if (!text.trim() || isSending) return;

      setIsSending(true);
      onFirstMessage?.();

      const userMessage = {
        id: Date.now().toString(),
        role: "user" as const,
        content: text,
        timestamp: new Date(),
      };

      addMessage(userMessage);
      setInput("");
      setStreaming(true);

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: "",
        timestamp: new Date(),
      };
      addMessage(assistantMessage);

      parserRef.current = new EzBuilderResponseParser();

      try {
        const canvasState = query.serialize();

        const stream = await aiApi.chat({
          chatId: currentChatId || undefined,
          pageId,
          message: text,
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
                appendToLastMessage(data.content);

                if (parserRef.current) {
                  parserRef.current.parseChunk(data.content);
                  const newActions = parserRef.current.extractActions();
                  newActions.forEach((action) => {
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
                appendToLastMessage(`\n\n⚠️ ${data.message || data.error}`);
                setStreaming(false);
                parserRef.current = null;
              }
            }
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
        appendToLastMessage("\n\n⚠️ Có lỗi xảy ra. Vui lòng thử lại.");
        setStreaming(false);
        parserRef.current = null;
      } finally {
        setIsSending(false);
      }
    },
    [
      input,
      isSending,
      onFirstMessage,
      addMessage,
      appendToLastMessage,
      addActionToLastMessage,
      setStreaming,
      setChatId,
      currentChatId,
      pageId,
      query,
      executeAction,
    ],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const suggestions = isEmptyCanvas
    ? ONBOARDING_SUGGESTIONS
    : SMART_SUGGESTIONS;
  const showSuggestions = messages.length === 0;

  // Show API templates if available but only on empty state
  const apiTemplates =
    templates && templates.length > 0 && messages.length === 0 ? templates : [];

  return (
    <div className="flex flex-col gap-2">
      {/* Quick Suggestions */}
      {showSuggestions && (
        <div className="px-3 pt-1">
          <div className="flex items-center gap-1 mb-2">
            <Zap className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              {isEmptyCanvas ? "Bắt đầu nhanh" : "Gợi ý thông minh"}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.slice(0, 4).map((s) => (
              <button
                key={s.label}
                onClick={() => handleSend(s.prompt)}
                className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-background hover:bg-primary/5 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all duration-150 font-medium"
              >
                {s.label}
              </button>
            ))}
            {apiTemplates.slice(0, 2).map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setInput(tpl.prompt)}
                className="text-[11px] px-2.5 py-1 rounded-full border border-dashed border-border bg-background hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all"
              >
                {tpl.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input row */}
      <div className="px-3 pb-3">
        <div
          className={cn(
            "flex items-end gap-2 rounded-xl border bg-background transition-all",
            "focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50",
          )}
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isEmptyCanvas
                ? "Mô tả trang web bạn muốn tạo..."
                : "Yêu cầu hoặc câu hỏi..."
            }
            className="flex-1 resize-none px-3 py-2.5 text-sm bg-transparent outline-none placeholder:text-muted-foreground min-h-[38px] max-h-[120px] overflow-y-auto"
            style={{ height: "38px" }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isSending}
            className={cn(
              "m-1.5 p-1.5 rounded-lg transition-all",
              input.trim() && !isSending
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground/40 cursor-not-allowed",
            )}
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <SendHorizonal className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/60 mt-1.5 text-center">
          Enter để gửi · Shift+Enter xuống dòng
        </p>
      </div>
    </div>
  );
}
