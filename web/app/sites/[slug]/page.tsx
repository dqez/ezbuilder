"use client";

import { PublicRenderer } from "@/components/editor/PublicRenderer";
import { notFound } from "next/navigation";

// Mock data - in real app, fetch from API based on slug
const MOCK_SITES: Record<string, { content: string; name: string }> = {
  demo: {
    name: "Demo Site",
    content: JSON.stringify({
      ROOT: {
        type: { resolvedName: "NodeContainer" },
        isCanvas: true,
        props: {
          padding: 24,
          backgroundColor: "#ffffff",
          flexDirection: "column",
          gap: 16,
        },
        displayName: "Container",
        custom: {},
        hidden: false,
        nodes: ["hero-1", "text-1"],
        linkedNodes: {},
      },
      "hero-1": {
        type: { resolvedName: "NodeHero" },
        isCanvas: false,
        props: {
          title: "Welcome to EZBuilder",
          subtitle: "Create beautiful websites with drag and drop",
          backgroundImage: "",
          ctaText: "Get Started",
          ctaUrl: "/dashboard",
        },
        displayName: "Hero",
        custom: {},
        parent: "ROOT",
        hidden: false,
        nodes: [],
        linkedNodes: {},
      },
      "text-1": {
        type: { resolvedName: "NodeText" },
        isCanvas: false,
        props: {
          text: "This is a demo page built with EZBuilder. You can create pages like this without any coding!",
          fontSize: 18,
          color: "#475569",
          textAlign: "center",
        },
        displayName: "Text",
        custom: {},
        parent: "ROOT",
        hidden: false,
        nodes: [],
        linkedNodes: {},
      },
    }),
  },
};

interface PublicSitePageProps {
  params: {
    slug: string;
  };
}

export default function PublicSitePage({ params }: PublicSitePageProps) {
  const site = MOCK_SITES[params.slug];

  if (!site) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicRenderer content={site.content} />
    </div>
  );
}
