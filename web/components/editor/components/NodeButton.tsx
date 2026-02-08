"use client";

import { useNode } from "@craftjs/core";
import { Button } from "@/components/ui/button";

interface NodeButtonProps {
  text: string;
  url: string;
  variant: "default" | "secondary" | "outline" | "ghost";
  size: "default" | "sm" | "lg";
}

export const NodeButton = ({
  text = "Click me",
  url = "#",
  variant = "default",
  size = "default",
}: NodeButtonProps) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const handleDoubleClick = () => {
    const newText = prompt("Enter button text:", text);
    if (newText !== null) {
      setProp((props: NodeButtonProps) => {
        props.text = newText;
      });
    }
  };

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        display: "inline-block",
        padding: "8px",
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        borderRadius: "4px",
        cursor: "grab",
      }}
    >
      <Button
        variant={variant}
        size={size}
        onDoubleClick={handleDoubleClick}
        onClick={(e) => e.preventDefault()}
      >
        {text}
      </Button>
    </div>
  );
};

NodeButton.craft = {
  displayName: "Button",
  props: {
    text: "Click me",
    url: "#",
    variant: "default",
    size: "default",
  },
  related: {},
};
