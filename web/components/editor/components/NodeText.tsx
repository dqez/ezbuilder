"use client";

import { useNode } from "@craftjs/core";
import { useState, useCallback } from "react";

interface NodeTextProps {
  text: string;
  fontSize: number;
  color: string;
  textAlign: "left" | "center" | "right";
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: number;
  marginTop?: number;
  marginBottom?: number;
  animation?: string;
}

export const NodeText = ({
  text = "Edit this text",
  fontSize = 16,
  color = "#000000",
  textAlign = "left",
  fontWeight = "400",
  fontFamily = "inherit",
  lineHeight = 1.5,
  marginTop = 0,
  marginBottom = 0,
  animation = "",
}: NodeTextProps) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLParagraphElement>) => {
      setIsEditing(false);
      setProp((props: NodeTextProps) => {
        props.text = e.target.innerText;
      });
    },
    [setProp],
  );

  return (
    <p
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className={animation}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      contentEditable={isEditing}
      suppressContentEditableWarning
      style={{
        fontSize: `${fontSize}px`,
        color,
        textAlign,
        fontWeight,
        fontFamily,
        lineHeight,
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        padding: "8px",
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        borderRadius: "4px",
        cursor: isEditing ? "text" : "grab",
        minHeight: "24px",
      }}
    >
      {text}
    </p>
  );
};

NodeText.craft = {
  displayName: "Text",
  props: {
    text: "Edit this text",
    fontSize: 16,
    color: "#000000",
    textAlign: "left",
  },
  related: {},
};
