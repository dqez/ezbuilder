"use client";

import { useNode, Element } from "@craftjs/core";
import { NodeContainer } from "./NodeContainer";

interface NodeColumnsProps {
  columns: number;
  gap: number;
  padding: number;
  backgroundColor: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  boxShadow?: string;
  backgroundImage?: string;
}

export const NodeColumns = ({
  columns = 2,
  gap = 16,
  padding = 16,
  backgroundColor = "transparent",
  borderRadius = 0,
  borderWidth = 0,
  borderColor = "transparent",
  boxShadow = "none",
  backgroundImage = "",
}: NodeColumnsProps) => {
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
      className="w-full flex flex-col md:flex-row"
      style={{
        gap: `${gap}px`,
        padding: `${padding}px`,
        backgroundColor,
        backgroundImage,
        borderRadius: `${borderRadius}px`,
        border: `${borderWidth}px solid ${borderColor}`,
        boxShadow,
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        minHeight: "100px",
      }}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <div
          key={index}
          className="flex-1 w-full md:w-auto h-full min-h-[50px]"
        >
          <Element
            canvas
            id={`column-${index}`}
            is={NodeContainer}
            padding={8}
            backgroundColor="#f9fafb"
            flexDirection="column"
            width="100%"
            height="100%"
          />
        </div>
      ))}
    </div>
  );
};

NodeColumns.craft = {
  displayName: "Columns",
  props: {
    columns: 2,
    gap: 16,
    padding: 16,
    backgroundColor: "transparent",
  },
  related: {},
};
