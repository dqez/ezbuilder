"use client";

import { useNode } from "@craftjs/core";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";

interface NodeCardProps {
  title: string;
  description: string;
  imageUrl: string;
  variant?: "vertical" | "horizontal" | "overlay";
}

export const NodeCard = ({
  title = "Card Title",
  description = "This is a description for the card component. You can edit this text.",
  imageUrl = "",
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

  const renderImage = () => {
    if (imageUrl) {
      if (isOverlay) {
        return (
          <>
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          </>
        );
      }
      return (
        <img
          src={imageUrl}
          alt={title}
          className={`${isHorizontal ? "w-1/3 min-w-[120px]" : "w-full h-48"} object-cover`}
        />
      );
    }

    // Placeholder when no image
    const placeholderClass = isOverlay
      ? "absolute inset-0 z-0 bg-slate-50 flex items-center justify-center"
      : `${isHorizontal ? "w-1/3 min-w-[120px]" : "w-full h-48"} bg-slate-50 flex items-center justify-center`;

    return (
      <div className={placeholderClass}>
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <ImageIcon className="w-8 h-8 opacity-50" />
          <span className="text-xs font-medium">No Image</span>
        </div>
        {/* Maintain gradient for overlay readability if needed, but white bg requested. 
            However, overlay text (white) needs contrast. 
            If isOverlay, we MUST add a gradient or change text color. 
            Given the component structure, changing text color dynamically is harder without more logic.
            So I will keep the gradient for overlay even with placeholder.
        */}
        {isOverlay && (
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent z-10" />
        )}
      </div>
    );
  };

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
        className={`overflow-hidden h-full ${
          isOverlay
            ? "relative aspect-video flex flex-col justify-end border-0"
            : isHorizontal
              ? "flex flex-row"
              : "flex flex-col"
        }`}
      >
        {renderImage()}

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
    imageUrl: "",
  },
  related: {},
};
