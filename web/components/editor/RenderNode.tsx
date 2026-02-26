"use client";

import { useNode, useEditor } from "@craftjs/core";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export const RenderNode = ({ render }: { render: React.ReactElement }) => {
  const { id } = useNode();
  const { isActive, isDragging } = useEditor((state, query) => ({
    isActive: query.getEvent("selected").first() === id,
    isDragging: !!state.events.dragged,
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
  active,
  isHovered,
  isDragging,
}: {
  dom: HTMLElement;
  name: string;
  active: boolean;
  isHovered: boolean;
  isDragging: boolean;
}) => {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    const updatePos = () => {
      const rect = dom.getBoundingClientRect();
      setPos({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    };

    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true); // Capture scroll

    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
    };
  }, [dom]);

  if (typeof document === "undefined") return null;

  // Render Portal
  return ReactDOM.createPortal(
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
        className={`absolute -top-7 left-0 px-2 py-1 text-xs font-medium text-white rounded-t-md flex items-center gap-2 pointer-events-auto shadow-sm ${
          active
            ? "bg-blue-500"
            : isDragging && isHovered
              ? "bg-green-500"
              : "bg-blue-400"
        }`}
      >
        <span>{isDragging && isHovered ? `Drop inside: ${name}` : name}</span>
      </div>
    </div>,
    document.body,
  );
};
