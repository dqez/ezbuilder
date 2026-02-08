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
}

export const NodeCard = ({
  title = "Card Title",
  description = "This is a description for the card component. You can edit this text.",
  imageUrl = "https://placehold.co/400x200/f3f4f6/9ca3af?text=Card+Image",
}: NodeCardProps) => {
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
        cursor: "grab",
      }}
    >
      <Card className="overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
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
