"use client";

import { useNode, useEditor } from "@craftjs/core";
import React, { useEffect, useState, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { Sparkles } from "lucide-react";
import { InlineAiChat } from "../ai/InlineAiChat";
import { useAiStore } from "@/lib/stores/ai-store";

export const RenderNode = ({ render }: { render: React.ReactElement }) => {
  const { id } = useNode();
  const { isActive, isDragging } = useEditor((state, query) => ({
    isActive: query.getEvent("selected").first() === id,
    isDragging: state.events.dragged ? state.events.dragged.size > 0 : false,
  }));

  const { isHovered, dom, name } = useNode((node) => ({
    isHovered: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    props: node.data.props,
  }));

  // Helper to remove class if component unmounts or state changes
  useEffect(() => {
    if (dom) {
      if (isActive || isHovered) dom.classList.add("component-selected");
      else dom.classList.remove("component-selected");
    }
  }, [dom, isActive, isHovered]);

  return (
    <>
      {id !== "ROOT" && (isHovered || isActive) && dom && (
        <Indicator
          dom={dom}
          name={name}
          nodeId={id}
          active={isActive}
          isHovered={isHovered}
          isDragging={isDragging}
        />
      )}
      {render}
    </>
  );
};

const Indicator = ({
  dom,
  name,
  nodeId,
  active,
  isHovered,
  isDragging,
}: {
  dom: HTMLElement;
  name: string;
  nodeId: string;
  active: boolean;
  isHovered: boolean;
  isDragging: boolean;
}) => {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [showInlineChat, setShowInlineChat] = useState(false);

  // Read pageId from global store (avoids React context boundary issues with CraftJS)
  const pageId = useAiStore((state) => state.currentPageId) ?? "";

  const updatePos = useCallback(() => {
    const rect = dom.getBoundingClientRect();
    setPos({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  }, [dom]);

  useEffect(() => {
    // Initial position + subscribe to layout changes
    const timer = setTimeout(updatePos, 0);
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
    };
  }, [updatePos]);

  // Close inline chat when node is deselected
  const prevActiveRef = useRef(active);
  useEffect(() => {
    const prev = prevActiveRef.current;
    prevActiveRef.current = active;
    if (!active && prev) {
      const timer = setTimeout(() => setShowInlineChat(false), 0);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (typeof document === "undefined") return null;

  const anchorRect = new DOMRect(pos.left, pos.top, pos.width, pos.height);

  return ReactDOM.createPortal(
    <>
      <div
        className={`fixed pointer-events-none z-50 transition-colors duration-200 ${
          active
            ? "border-2 border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.3)]"
            : isDragging && isHovered
              ? "border-2 border-green-500 bg-green-500/10 shadow-[0_0_0_4px_rgba(34,197,94,0.3)]"
              : "border-2 border-blue-400 border-dashed"
        }`}
        style={{
          top: pos.top,
          left: pos.left,
          width: pos.width,
          height: pos.height,
        }}
      >
        <div
          className={`absolute -top-7 left-0 flex items-center gap-1 pointer-events-auto shadow-sm`}
        >
          {/* Component name label */}
          <div
            className={`px-2 py-1 text-xs font-medium text-white rounded-t-md flex items-center gap-2 ${
              active
                ? "bg-blue-500"
                : isDragging && isHovered
                  ? "bg-green-500"
                  : "bg-blue-400"
            }`}
          >
            <span>
              {isDragging && isHovered ? `Drop inside: ${name}` : name}
            </span>
          </div>

          {/* Ask AI button — always visible when hovering, hidden only during drag */}
          {!isDragging && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowInlineChat((prev) => !prev);
              }}
              title="Hỏi AI về component này"
              className={`px-2 py-1 text-xs font-medium rounded-t-md flex items-center gap-1 transition-colors ${
                showInlineChat
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/80 hover:bg-primary text-white"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Ask AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Inline AI Chat popup */}
      {showInlineChat && (
        <InlineAiChat
          nodeId={nodeId}
          nodeName={name}
          pageId={pageId}
          anchorRect={anchorRect}
          onClose={() => setShowInlineChat(false)}
        />
      )}
    </>,
    document.body,
  );
};
