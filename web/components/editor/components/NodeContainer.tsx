"use client";

import { useNode } from "@craftjs/core";
import React from "react";

export interface NodeContainerProps {
  padding?: number;
  backgroundColor?: string;
  flexDirection?: "row" | "column";
  gap?: number;
  width?: string;
  height?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  boxShadow?: string;
  backgroundImage?: string;
  animation?: string;
  mobilePadding?: number;
  mobileGap?: number;
  children?: React.ReactNode;
}

export const NodeContainer = ({
  padding = 16,
  backgroundColor = "transparent",
  flexDirection = "column",
  gap = 8,
  width = "100%",
  height = "auto",
  borderRadius = 8,
  borderWidth = 0,
  borderColor = "transparent",
  boxShadow = "none",
  backgroundImage = "",
  animation = "",
  mobilePadding,
  mobileGap,
  children,
}: NodeContainerProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const mPadding = mobilePadding !== undefined ? mobilePadding : padding;
  const mGap = mobileGap !== undefined ? mobileGap : gap;

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className={`${animation} p-(--p-mobile) md:p-(--p-desktop) gap-(--g-mobile) md:gap-(--g-desktop)`}
      style={
        {
          display: "flex",
          flexDirection,
          // Gap and Padding are handled via classes and vars now
          "--p-desktop": `${padding}px`,
          "--p-mobile": `${mPadding}px`,
          "--g-desktop": `${gap}px`,
          "--g-mobile": `${mGap}px`,
          backgroundColor,
          backgroundImage,
          width,
          height,
          minHeight: "100px",
          outline: selected ? "2px solid #3b82f6" : "2px dashed #e5e7eb",
          outlineOffset: "2px",
          borderRadius: `${borderRadius}px`,
          border: `${borderWidth}px solid ${borderColor}`,
          boxShadow,
          cursor: "grab",
        } as React.CSSProperties
      }
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
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "transparent",
    boxShadow: "none",
    flexDirection: "column",
    gap: 8,
  },
  rules: {
    canDrag: () => true,
  },
  related: {},
};
