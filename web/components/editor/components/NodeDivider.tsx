"use client";

import { useNode } from "@craftjs/core";

interface NodeDividerProps {
  color: string;
  thickness: number;
  margin: number;
}

export const NodeDivider = ({
  color = "#e5e7eb",
  thickness = 1,
  margin = 16,
}: NodeDividerProps) => {
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
        padding: "4px 8px",
        margin: `${margin}px 0`,
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        cursor: "grab",
      }}
    >
      <hr
        style={{
          border: "none",
          height: `${thickness}px`,
          backgroundColor: color,
          margin: 0,
        }}
      />
    </div>
  );
};

NodeDivider.craft = {
  displayName: "Divider",
  props: {
    color: "#e5e7eb",
    thickness: 1,
    margin: 16,
  },
  related: {},
};
