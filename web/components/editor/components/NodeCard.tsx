"use client";

import { useNode } from "@craftjs/core";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NodeCardProps {
  title: string;
  description: string;
  imageUrl: string;
  variant?: "vertical" | "horizontal" | "overlay";
}

export const NodeCard = ({
  title = "Card Title",
  description = "This is a description for the card component. You can edit this text.",
  imageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
  variant = "vertical",
}: NodeCardProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const isOverlay = variant === "overlay";
  const isHorizontal = variant === "horizontal";

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className="p-2"
      style={{
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        cursor: "grab",
      }}
    >
      <Card
        className={`overflow-hidden h-full ${isOverlay ? "relative aspect-video flex flex-col justify-end border-0" : isHorizontal ? "flex flex-row" : "flex flex-col"}`}
      >
        {/* Background Image for Overlay */}
        {isOverlay && (
          <>
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          </>
        )}

        {/* Normal Image for Vertical/Horizontal */}
        {!isOverlay && (
          <img
            src={imageUrl}
            alt={title}
            className={`${isHorizontal ? "w-1/3 min-w-[120px]" : "w-full h-48"} object-cover`}
          />
        )}

        <div
          className={`flex flex-col flex-1 z-20 ${isOverlay ? "bg-transparent p-4" : ""}`}
        >
          <CardHeader className={isOverlay ? "p-0" : ""}>
            <CardTitle
              className={
                isOverlay ? "text-white text-xl drop-shadow-md" : "text-lg"
              }
            >
              {title}
            </CardTitle>
            <CardDescription
              className={
                isOverlay ? "text-gray-200 drop-shadow-sm mt-2" : "mt-2"
              }
            >
              {description}
            </CardDescription>
          </CardHeader>
          {/* CardContent or Footer could go here if props existed */}
        </div>
      </Card>
    </div>
  );
};

NodeCard.craft = {
  displayName: "Card",
  props: {
    title: "Card Title",
    description:
      "This is a description for the card component. You can edit this text.",
    imageUrl: "https://placehold.co/400x200/f3f4f6/9ca3af?text=Card+Image",
  },
  related: {},
};
