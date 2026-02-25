"use client";

import { useEditor } from "@craftjs/core";
import { MousePointerClick, Sparkles, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAiStore } from "@/lib/stores/ai-store";

export function CanvasEmptyState() {
  const { query } = useEditor();
  const togglePanel = useAiStore((s) => s.togglePanel);

  // Check if canvas has children
  const rootNode = query.node("ROOT").get();
  const hasChildren = rootNode?.data?.nodes?.length > 0;

  if (hasChildren) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="pointer-events-auto text-center max-w-md p-8">
        {/* Illustration */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <MousePointerClick className="w-10 h-10 text-primary/40" />
        </div>

        <h3 className="text-xl font-semibold mb-2">
          Bắt đầu thiết kế trang web
        </h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Kéo thành phần từ thanh bên trái vào đây, hoặc bắt đầu nhanh với các
          gợi ý bên dưới.
        </p>

        {/* Quick-start suggestions */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              // The user can drag from toolbox - this is a visual hint
              const toolbox = document.querySelector("[data-tour='toolbox']");
              if (toolbox) {
                toolbox.scrollIntoView({ behavior: "smooth" });
                toolbox.classList.add("ring-2", "ring-primary");
                setTimeout(
                  () => toolbox.classList.remove("ring-2", "ring-primary"),
                  2000,
                );
              }
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Thêm Hero
          </Button>
        </div>

        {/* AI suggestion */}
        <button
          onClick={togglePanel}
          className="text-xs text-primary hover:underline flex items-center justify-center gap-1 mx-auto mt-2"
        >
          <Bot className="w-3.5 h-3.5" />
          Hoặc nhờ trợ lý AI thiết kế cho bạn →
        </button>
      </div>
    </div>
  );
}
