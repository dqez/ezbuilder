"use client";

import { useNode } from "@craftjs/core";

interface SocialLink {
  platform: string;
  url: string;
}

interface NodeFooterProps {
  copyright: string;
  socialLinks: SocialLink[];
  variant?: "simple" | "centered" | "minimal";
}

export const NodeFooter = ({
  copyright = "© 2026 MyBrand. All rights reserved.",
  socialLinks = [
    { platform: "Twitter", url: "#" },
    { platform: "Facebook", url: "#" },
    { platform: "LinkedIn", url: "#" },
  ],
  variant = "simple",
}: NodeFooterProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const isCentered = variant === "centered";
  const isMinimal = variant === "minimal";

  return (
    <footer
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className={`flex bg-slate-900 text-slate-400 p-8 ${
        isCentered
          ? "flex-col items-center justify-center gap-6"
          : "items-center justify-between"
      }`}
      style={{
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        cursor: "grab",
        borderRadius: "8px",
      }}
    >
      <div className={`text-sm ${isCentered && !isMinimal ? "order-2" : ""}`}>
        {copyright}
      </div>

      {!isMinimal && (
        <div className={`flex gap-6 ${isCentered ? "order-1" : ""}`}>
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              onClick={(e) => e.preventDefault()}
              className="text-sm font-medium hover:text-white transition-colors"
            >
              {link.platform}
            </a>
          ))}
        </div>
      )}
    </footer>
  );
};

NodeFooter.craft = {
  displayName: "Footer",
  props: {
    copyright: "© 2026 MyBrand. All rights reserved.",
    socialLinks: [
      { platform: "Twitter", url: "#" },
      { platform: "Facebook", url: "#" },
      { platform: "LinkedIn", url: "#" },
    ],
    variant: "simple",
  },
  related: {},
};
