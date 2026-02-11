"use client";

import { useNode } from "@craftjs/core";
import { useState, useCallback } from "react";

interface NodeHeadingProps {
  text: string;
  level: 1 | 2 | 3;
  color: string;
  textAlign: "left" | "center" | "right";
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: number;
  marginTop?: number;
  marginBottom?: number;
  animation?: string;
}

export const NodeHeading = ({
  text = "Heading",
  level = 1,
  color = "#000000",
  textAlign = "left",
  fontWeight,
  fontFamily = "inherit",
  lineHeight = 1.2,
  marginTop = 0,
  marginBottom = 0,
  animation = "",
}: NodeHeadingProps) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const [isEditing, setIsEditing] = useState(false);

  // ... (useCallback)

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLHeadingElement>) => {
      setIsEditing(false);
      setProp((props: NodeHeadingProps) => {
        props.text = e.target.innerText;
      });
    },
    [setProp],
  );

  const defaultFontSize = level === 1 ? 36 : level === 2 ? 28 : 22;
  const defaultFontWeight = level === 1 ? "700" : level === 2 ? "600" : "500";

  const finalFontWeight = fontWeight || defaultFontWeight;

  const HeadingTag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
  const Tag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";

  return (
    <Tag
      ref={(ref: any) => {
        if (ref) connect(drag(ref));
      }}
      className={animation}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      contentEditable={isEditing}
      suppressContentEditableWarning
      style={{
        fontSize: `${defaultFontSize}px`,
        fontWeight: finalFontWeight,
        fontFamily,
        lineHeight,
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        color,
        textAlign,
        padding: "8px",
        margin: 0,
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        borderRadius: "4px",
        cursor: isEditing ? "text" : "grab",
        minHeight: "24px",
      }}
    >
      {text}
    </Tag>
  );
};

NodeHeading.craft = {
  displayName: "Heading",
  props: {
    text: "Heading",
    level: 1,
    color: "#000000",
    textAlign: "left",
  },
  related: {},
};
