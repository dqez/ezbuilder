"use client";

import { useEffect, useRef, useState, KeyboardEvent } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  SendHorizonal,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAiChat } from "@/lib/ai/useAiChat";

interface InlineAiChatProps {
  nodeId: string;
  nodeName: string;
  pageId: string;
  anchorRect: DOMRect;
  onClose: () => void;
}

const INLINE_SUGGESTIONS = [
  { label: "Đổi màu nền", prompt: "Đổi màu nền của component này" },
  { label: "Thay text", prompt: "Thay đổi nội dung text của component này" },
  { label: "Thêm padding", prompt: "Tăng padding cho component này" },
  { label: "Làm nổi bật", prompt: "Làm cho component này nổi bật hơn" },
];

export function InlineAiChat({
  nodeId,
  nodeName,
  pageId,
  anchorRect,
  onClose,
}: InlineAiChatProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { handleSend, isSending, inlineResponse, clearInlineResponse } =
    useAiChat({
      pageId,
      nodeContext: { nodeId, nodeName },
      useGlobalState: false,
    });

  const isDone = !isSending && inlineResponse.length > 0;

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const onSend = async () => {
    if (!input.trim() || isSending) return;
    clearInlineResponse();
    await handleSend(input);
    setInput("");
  };

  const onSuggestion = async (prompt: string) => {
    clearInlineResponse();
    await handleSend(prompt);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // Calculate position: prefer below the component, fallback above
  const viewportHeight = window.innerHeight;
  const popupHeight = 220;
  const gap = 8;
  const spaceBelow = viewportHeight - anchorRect.bottom;
  const top =
    spaceBelow >= popupHeight + gap
      ? anchorRect.bottom + gap
      : anchorRect.top - popupHeight - gap;
  const left = Math.min(
    anchorRect.left,
    window.innerWidth - 340 - 8, // 340px width + 8px margin
  );

  if (typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: -6, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.97 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed z-200 w-[340px] rounded-xl border bg-background shadow-2xl overflow-hidden"
        style={{ top, left }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/20">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
            <span className="text-xs font-semibold">AI — {nodeName}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Response area */}
        <AnimatePresence>
          {(isSending || isDone) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-3 py-2 border-b bg-muted/10 max-h-[100px] overflow-y-auto"
            >
              {isSending && !inlineResponse ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  {isDone && !isSending && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                  )}
                  {isSending && (
                    <Loader2 className="w-3 h-3 animate-spin mt-0.5 shrink-0 text-primary" />
                  )}
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap line-clamp-5">
                    {inlineResponse}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick suggestions */}
        {!isSending && !isDone && (
          <div className="px-3 pt-2 flex flex-wrap gap-1">
            {INLINE_SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => onSuggestion(s.prompt)}
                className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-background hover:bg-primary/5 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all font-medium"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-3 py-2">
          <div
            className={cn(
              "flex items-end gap-1.5 rounded-lg border bg-background transition-all",
              "focus-within:ring-1 focus-within:ring-primary/40 focus-within:border-primary/50",
            )}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 80)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Yêu cầu cho ${nodeName}...`}
              disabled={isSending}
              className="flex-1 resize-none px-2.5 py-2 text-xs bg-transparent outline-none placeholder:text-muted-foreground disabled:opacity-50"
              style={{ height: "34px" }}
            />
            <button
              onClick={onSend}
              disabled={!input.trim() || isSending}
              className={cn(
                "m-1 p-1.5 rounded-md transition-all",
                input.trim() && !isSending
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground/40 cursor-not-allowed",
              )}
            >
              <SendHorizonal className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[9px] text-muted-foreground/50 mt-1 text-center">
            Enter · Esc để đóng
          </p>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
