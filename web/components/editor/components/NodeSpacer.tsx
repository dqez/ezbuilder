"use client";

import { useNode } from "@craftjs/core";

interface NodeSpacerProps {
  height: number;
}

export const NodeSpacer = ({ height = 32 }: NodeSpacerProps) => {
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
        height: `${height}px`,
        width: "100%",
        backgroundColor: selected ? "#f0f9ff" : "transparent",
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {selected && (
        <span style={{ fontSize: 12, color: "#6b7280" }}>
          Spacer: {height}px
        </span>
      )}
    </div>
  );
};

NodeSpacer.craft = {
  displayName: "Spacer",
  props: {
    height: 32,
  },
  related: {},
};
