"use client";

import { useNode } from "@craftjs/core";
import { Button } from "@/components/ui/button";

interface NavLink {
  label: string;
  url: string;
}

interface NodeNavbarProps {
  logo: string;
  links: NavLink[];
}

export const NodeNavbar = ({
  logo = "MyBrand",
  links = [
    { label: "Home", url: "#" },
    { label: "About", url: "#" },
    { label: "Services", url: "#" },
    { label: "Contact", url: "#" },
  ],
}: NodeNavbarProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <nav
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        cursor: "grab",
        borderRadius: "8px",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "20px", color: "#0f172a" }}>
        {logo}
      </div>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            onClick={(e) => e.preventDefault()}
            style={{
              color: "#475569",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {link.label}
          </a>
        ))}
        <Button size="sm">Sign Up</Button>
      </div>
    </nav>
  );
};

NodeNavbar.craft = {
  displayName: "Navbar",
  props: {
    logo: "MyBrand",
    links: [
      { label: "Home", url: "#" },
      { label: "About", url: "#" },
      { label: "Services", url: "#" },
      { label: "Contact", url: "#" },
    ],
  },
  related: {},
};
