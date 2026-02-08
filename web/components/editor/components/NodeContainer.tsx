"use client";

import { useNode, Element } from "@craftjs/core";
import React from "react";

interface NodeContainerProps {
  padding: number;
  backgroundColor: string;
  flexDirection: "row" | "column";
  gap: number;
  children?: React.ReactNode;
}

export const NodeContainer = ({
  padding = 16,
  backgroundColor = "transparent",
  flexDirection = "column",
  gap = 8,
  children,
}: NodeContainerProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        display: "flex",
        flexDirection,
        gap: `${gap}px`,
        padding: `${padding}px`,
        backgroundColor,
        minHeight: "100px",
        outline: selected ? "2px solid #3b82f6" : "2px dashed #e5e7eb",
        outlineOffset: "2px",
        borderRadius: "8px",
        cursor: "grab",
      }}
    >
      {children}
    </div>
  );
};

NodeContainer.craft = {
  displayName: "Container",
  props: {
    padding: 16,
    backgroundColor: "transparent",
    flexDirection: "column",
    gap: 8,
  },
  rules: {
    canDrag: () => true,
  },
  related: {},
};
