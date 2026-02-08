"use client";

import { useNode } from "@craftjs/core";

interface SocialLink {
  platform: string;
  url: string;
}

interface NodeFooterProps {
  copyright: string;
  socialLinks: SocialLink[];
}

export const NodeFooter = ({
  copyright = "© 2026 MyBrand. All rights reserved.",
  socialLinks = [
    { platform: "Twitter", url: "#" },
    { platform: "Facebook", url: "#" },
    { platform: "LinkedIn", url: "#" },
  ],
}: NodeFooterProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <footer
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 32px",
        backgroundColor: "#0f172a",
        color: "#94a3b8",
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        cursor: "grab",
        borderRadius: "8px",
      }}
    >
      <div style={{ fontSize: "14px" }}>{copyright}</div>
      <div style={{ display: "flex", gap: "24px" }}>
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            onClick={(e) => e.preventDefault()}
            style={{
              color: "#94a3b8",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            {link.platform}
          </a>
        ))}
      </div>
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
  },
  related: {},
};
