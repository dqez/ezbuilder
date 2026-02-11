"use client";

import { useNode } from "@craftjs/core";
import { Button } from "@/components/ui/button";

interface NodeHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaUrl: string;
  layout?: "center" | "split-left" | "split-right";
  imageUrl?: string;
  overlayOpacity?: number;
}

export const NodeHero = ({
  title = "Build Amazing Websites",
  subtitle = "Create beautiful landing pages with our drag-and-drop builder. No coding required.",
  backgroundImage = "",
  ctaText = "Get Started",
  ctaUrl = "#",
  layout = "center",
  imageUrl = "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
  overlayOpacity = 0.5,
}: NodeHeroProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const isCentered = layout === "center";
  const isSplitLeft = layout === "split-left";

  return (
    <section
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className={`relative min-h-[500px] p-8 md:p-16 flex flex-col gap-10 ${
        isCentered
          ? "items-center justify-center text-center"
          : `md:flex-row items-center justify-between text-left ${
              isSplitLeft ? "md:flex-row-reverse" : ""
            }`
      }`}
      style={{
        background: backgroundImage
          ? `linear-gradient(rgba(0,0,0,${overlayOpacity}), rgba(0,0,0,${overlayOpacity})), url(${backgroundImage}) center/cover`
          : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        cursor: "grab",
        borderRadius: "8px", // Should be 0 for full width sections? But editor usually has padding.
      }}
    >
      <div
        className={`flex flex-col gap-6 z-10 ${isCentered ? "items-center max-w-4xl" : "flex-1 items-start"}`}
      >
        <h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight"
          style={{
            color: backgroundImage ? "#ffffff" : "#0f172a",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        <p
          className="text-lg md:text-xl"
          style={{
            color: backgroundImage ? "#e2e8f0" : "#475569",
            maxWidth: "600px",
          }}
        >
          {subtitle}
        </p>
        <Button size="lg" onClick={(e) => e.preventDefault()}>
          {ctaText}
        </Button>
      </div>

      {!isCentered && (
        <div className="flex-1 w-full flex justify-center z-10">
          <img
            src={imageUrl}
            alt="Hero Visual"
            className="rounded-xl shadow-2xl w-full max-w-[600px] object-cover aspect-4/3 border-4 border-white/20"
          />
        </div>
      )}
    </section>
  );
};

NodeHero.craft = {
  displayName: "Hero",
  props: {
    title: "Build Amazing Websites",
    subtitle:
      "Create beautiful landing pages with our drag-and-drop builder. No coding required.",
    backgroundImage: "",
    ctaText: "Get Started",
    ctaUrl: "#",
    layout: "center",
    imageUrl:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
    overlayOpacity: 0.5,
  },
  related: {},
};
