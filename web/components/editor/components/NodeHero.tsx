"use client";

import { useNode } from "@craftjs/core";
import { Button } from "@/components/ui/button";

interface NodeHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaUrl: string;
}

export const NodeHero = ({
  title = "Build Amazing Websites",
  subtitle = "Create beautiful landing pages with our drag-and-drop builder. No coding required.",
  backgroundImage = "",
  ctaText = "Get Started",
  ctaUrl = "#",
}: NodeHeroProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <section
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        position: "relative",
        padding: "80px 40px",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: backgroundImage
          ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage}) center/cover`
          : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        cursor: "grab",
        borderRadius: "8px",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          fontWeight: 700,
          marginBottom: "16px",
          color: backgroundImage ? "#ffffff" : "#0f172a",
          maxWidth: "800px",
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: "20px",
          marginBottom: "32px",
          color: backgroundImage ? "#e2e8f0" : "#475569",
          maxWidth: "600px",
        }}
      >
        {subtitle}
      </p>
      <Button size="lg" onClick={(e) => e.preventDefault()}>
        {ctaText}
      </Button>
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
  },
  related: {},
};
