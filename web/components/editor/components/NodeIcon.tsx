"use client";

import { useNode } from "@craftjs/core";
import * as LucideIcons from "lucide-react";

interface NodeIconProps {
  iconName: string;
  size: number;
  color: string;
  backgroundColor: string;
  borderRadius: number;
  padding: number;
}

export const NodeIcon = ({
  iconName = "Star",
  size = 24,
  color = "#000000",
  backgroundColor = "transparent",
  borderRadius = 0,
  padding = 8,
}: NodeIconProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  // Get the icon component dynamically
  const IconComponent =
    (LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{
      size?: number;
      color?: string;
    }>) || LucideIcons.Star;

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `${padding}px`,
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        cursor: "grab",
      }}
    >
      <IconComponent size={size} color={color} />
    </div>
  );
};

NodeIcon.craft = {
  displayName: "Icon",
  props: {
    iconName: "Star",
    size: 24,
    color: "#000000",
    backgroundColor: "transparent",
    borderRadius: 0,
    padding: 8,
  },
  related: {},
};
