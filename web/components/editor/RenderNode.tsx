"use client";

import { useNode, useEditor } from "@craftjs/core";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Move, Trash2 } from "lucide-react";

export const RenderNode = ({ render }: { render: React.ReactElement }) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").first() === id,
  }));

  const {
    isHovered,
    dom,
    name,
    moveable,
    deletable,
    connectors: { drag },
    actions: { setProp },
  } = useNode((node) => ({
    isHovered: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
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
        <Indicator dom={dom} name={name} active={isActive} />
      )}
      {render}
    </>
  );
};

const Indicator = ({
  dom,
  name,
  active,
}: {
  dom: HTMLElement;
  name: string;
  active: boolean;
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
      className={`fixed border-2 pointer-events-none z-50 transition-colors duration-200 ${
        active ? "border-blue-500" : "border-blue-400 border-dashed"
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
          active ? "bg-blue-500" : "bg-blue-400"
        }`}
      >
        <span>{name}</span>
      </div>
    </div>,
    document.body,
  );
};
