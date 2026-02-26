"use client";

import Markdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Bot, User, Sparkles } from "lucide-react";

interface AiChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  actions?: Array<{
    type: string;
    component?: string;
    nodeId?: string;
  }>;
}

const ACTION_LABELS: Record<string, string> = {
  add: "Đã thêm",
  update: "Đã cập nhật",
  delete: "Đã xóa",
  move: "Đã di chuyển",
};

export function AiChatMessage({ role, content, actions }: AiChatMessageProps) {
  // Strip ezAction tags from content
  const cleanContent = content
    .replace(
      /<ezAction\s+type="[^"]+"\s+nodeId="[^"]+">([\s\S]*?)<\/ezAction>/g,
      "",
    )
    .trim();

  if (role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="flex items-end gap-2 max-w-[85%]">
          <div className="px-4 py-2.5 rounded-2xl rounded-br-sm bg-primary text-primary-foreground text-sm leading-relaxed">
            {cleanContent}
          </div>
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start gap-2 max-w-[90%]">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-muted/60 border text-sm leading-relaxed">
            <div
              className={cn(
                "prose prose-sm max-w-none dark:prose-invert",
                "[&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5",
                "[&_code]:bg-background [&_code]:border [&_code]:px-1 [&_code]:rounded [&_code]:text-xs",
              )}
            >
              <Markdown>{cleanContent || "..."}</Markdown>
            </div>
          </div>

          {/* Applied actions badges */}
          {actions && actions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-1">
              {actions.map((action, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 font-medium"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  {ACTION_LABELS[action.type] || action.type}
                  {action.component && (
                    <span className="opacity-70">{action.component}</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
