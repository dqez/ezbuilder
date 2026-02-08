"use client";

import { useNode } from "@craftjs/core";

interface NodeGalleryProps {
  images: string[];
  columns: 2 | 3 | 4;
  gap: number;
}

export const NodeGallery = ({
  images = [
    "https://placehold.co/300x200/f3f4f6/9ca3af?text=Image+1",
    "https://placehold.co/300x200/f3f4f6/9ca3af?text=Image+2",
    "https://placehold.co/300x200/f3f4f6/9ca3af?text=Image+3",
    "https://placehold.co/300x200/f3f4f6/9ca3af?text=Image+4",
  ],
  columns = 2,
  gap = 16,
}: NodeGalleryProps) => {
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
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        padding: "8px",
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        cursor: "grab",
        borderRadius: "8px",
      }}
    >
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Gallery image ${index + 1}`}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "8px",
            objectFit: "cover",
            aspectRatio: "3 / 2",
          }}
        />
      ))}
    </div>
  );
};

NodeGallery.craft = {
  displayName: "Gallery",
  props: {
    images: [
      "https://placehold.co/300x200/f3f4f6/9ca3af?text=Image+1",
      "https://placehold.co/300x200/f3f4f6/9ca3af?text=Image+2",
      "https://placehold.co/300x200/f3f4f6/9ca3af?text=Image+3",
      "https://placehold.co/300x200/f3f4f6/9ca3af?text=Image+4",
    ],
    columns: 2,
    gap: 16,
  },
  related: {},
};
