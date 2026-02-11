"use client";

import { useNode } from "@craftjs/core";

interface NodeEmbedProps {
  embedCode: string;
  width: string;
  height: string;
}

export const NodeEmbed = ({
  embedCode = "",
  width = "100%",
  height = "400px",
}: NodeEmbedProps) => {
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
        padding: "8px",
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        borderRadius: "4px",
        cursor: "grab",
      }}
    >
      <div
        style={{
          width,
          height,
          backgroundColor: "#f3f4f6",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {embedCode ? (
          <div
            dangerouslySetInnerHTML={{ __html: embedCode }}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            Enter embed code in settings (Google Maps, Twitter, Instagram, etc.)
          </div>
        )}
      </div>
    </div>
  );
};

NodeEmbed.craft = {
  displayName: "Embed",
  props: {
    embedCode: "",
    width: "100%",
    height: "400px",
  },
  related: {},
};
