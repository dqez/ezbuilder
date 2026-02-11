"use client";

import { useNode } from "@craftjs/core";
import { Button } from "@/components/ui/button";

interface NodeCTAProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export const NodeCTA = ({
  title = "Ready to get started?",
  subtitle = "Join thousands of satisfied users today and take your business to the next level.",
  buttonText = "Sign Up Now",
  buttonLink = "#",
}: NodeCTAProps) => {
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
      className="w-full py-12 px-6 rounded-lg bg-muted/30 text-center"
      style={{
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        cursor: "grab",
      }}
    >
      <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        {subtitle}
      </p>
      <Button asChild size="lg">
        <a href={buttonLink}>{buttonText}</a>
      </Button>
    </div>
  );
};

NodeCTA.craft = {
  displayName: "CTA",
  props: {
    title: "Ready to get started?",
    subtitle:
      "Join thousands of satisfied users today and take your business to the next level.",
    buttonText: "Sign Up Now",
    buttonLink: "#",
  },
  related: {},
};
