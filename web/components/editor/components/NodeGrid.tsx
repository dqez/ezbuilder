"use client";

import { useNode, Element } from "@craftjs/core";
import { NodeContainer } from "./NodeContainer";

interface NodeGridProps {
  columns?: number;
  gap?: number;
  padding?: number;
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  boxShadow?: string;
  backgroundImage?: string;
}

export const NodeGrid = ({
  columns = 3,
  gap = 16,
  padding = 16,
  backgroundColor = "transparent",
  borderRadius = 0,
  borderWidth = 0,
  borderColor = "transparent",
  boxShadow = "none",
  backgroundImage = "",
}: NodeGridProps) => {
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
      className="grid w-full"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
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
      <Element
        canvas
        id="grid-item-1"
        is={NodeContainer}
        padding={8}
        backgroundColor="#f9fafb"
        data-cy="grid-item-1"
      />
      <Element
        canvas
        id="grid-item-2"
        is={NodeContainer}
        padding={8}
        backgroundColor="#f9fafb"
        data-cy="grid-item-2"
      />
      {columns >= 3 && (
        <Element
          canvas
          id="grid-item-3"
          is={NodeContainer}
          padding={8}
          backgroundColor="#f9fafb"
          data-cy="grid-item-3"
        />
      )}
      {columns >= 4 && (
        <Element
          canvas
          id="grid-item-4"
          is={NodeContainer}
          padding={8}
          backgroundColor="#f9fafb"
          data-cy="grid-item-4"
        />
      )}
    </div>
  );
};

NodeGrid.craft = {
  displayName: "Grid",
  props: {
    columns: 3,
    gap: 16,
    padding: 16,
    backgroundColor: "transparent",
  },
  related: {},
};
