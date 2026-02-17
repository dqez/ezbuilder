"use client";

import { useNode } from "@craftjs/core";
import { Image as ImageIcon } from "lucide-react";

interface NodeImageProps {
  src: string;
  alt: string;
  width: string;
  borderRadius: number;
}

export const NodeImage = ({
  src = "",
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
      {src ? (
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
      ) : (
        <div
          className="bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-2"
          style={{
            width: "100%",
            height: "240px", // Default height for placeholder
            borderRadius: `${borderRadius}px`,
          }}
        >
          <ImageIcon className="w-10 h-10 opacity-50" />
          <span className="text-sm font-medium">No Image</span>
        </div>
      )}
    </div>
  );
};

NodeImage.craft = {
  displayName: "Image",
  props: {
    src: "",
    alt: "Image",
    width: "100%",
    borderRadius: 8,
  },
  related: {},
};
