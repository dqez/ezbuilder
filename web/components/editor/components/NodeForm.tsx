"use client";

import { useNode } from "@craftjs/core";
import { ReactNode } from "react";

interface NodeFormProps {
  children?: ReactNode;
  padding?: number;
  gap?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
}

export const NodeForm = ({
  children,
  padding = 16,
  gap = 16,
  backgroundColor = "transparent",
  borderColor = "transparent",
  borderWidth = 0,
  borderRadius = 0,
}: NodeFormProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <form
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      onSubmit={(e) => e.preventDefault()}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: `${gap}px`,
        padding: `${padding}px`,
        backgroundColor,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: `${borderRadius}px`,
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        minHeight: "100px",
      }}
    >
      {children}
    </form>
  );
};

NodeForm.craft = {
  displayName: "Form",
  props: {
    padding: 16,
    gap: 16,
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
  },
  related: {},
};
