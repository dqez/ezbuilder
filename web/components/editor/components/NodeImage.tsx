"use client";

import { useNode } from "@craftjs/core";

interface NodeImageProps {
  src: string;
  alt: string;
  width: string;
  borderRadius: number;
}

export const NodeImage = ({
  src = "https://placehold.co/600x400/f3f4f6/9ca3af?text=Click+to+edit",
  alt = "Image",
  width = "100%",
  borderRadius = 8,
}: NodeImageProps) => {
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
        width,
        padding: "8px",
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        borderRadius: "4px",
        cursor: "grab",
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "auto",
          borderRadius: `${borderRadius}px`,
          display: "block",
        }}
      />
    </div>
  );
};

NodeImage.craft = {
  displayName: "Image",
  props: {
    src: "https://placehold.co/600x400/f3f4f6/9ca3af?text=Click+to+edit",
    alt: "Image",
    width: "100%",
    borderRadius: 8,
  },
  related: {},
};
