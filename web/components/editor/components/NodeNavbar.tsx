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
  variant?: "default" | "centered" | "minimal";
  sticky?: boolean;
}

export const NodeNavbar = ({
  logo = "MyBrand",
  links = [
    { label: "Home", url: "#" },
    { label: "About", url: "#" },
    { label: "Services", url: "#" },
    { label: "Contact", url: "#" },
  ],
  variant = "default",
  sticky = false,
}: NodeNavbarProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const isCentered = variant === "centered";
  const isMinimal = variant === "minimal";

  return (
    <nav
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className={`w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex items-center transition-all duration-200 ${
        sticky ? "sticky top-0 z-50 shadow-sm" : "relative"
      } ${
        isCentered
          ? "flex-col gap-4 md:flex-col justify-center"
          : "justify-between"
      }`}
      style={{
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        cursor: "grab",
      }}
    >
      {/* Logo */}
      <div
        className={`font-bold text-xl text-slate-900 tracking-tight ${isCentered ? "mb-2" : ""}`}
      >
        {logo}
      </div>

      {/* Links - Hidden on Minimal, or different layout */}
      {!isMinimal && (
        <div
          className={`flex gap-6 items-center ${isCentered ? "justify-center w-full" : ""}`}
        >
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              onClick={(e) => e.preventDefault()}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button size="sm" variant={isCentered ? "outline" : "default"}>
            Sign Up
          </Button>
        </div>
      )}

      {/* Minimal Variant - Just Button? */}
      {isMinimal && (
        <div className="flex gap-4">
          <Button size="sm" variant="ghost">
            Log in
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
      )}
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
    variant: "default",
    sticky: false,
  },
  related: {},
};
