"use client";

import { useNode } from "@craftjs/core";
import { CheckCircle2 } from "lucide-react";

interface NodeFeatureListProps {
  features: string; // "Title: Description | Title: Description"
}

export const NodeFeatureList = ({
  features = "Easy to Use: Intuitive drag and drop interface | Responsive Design: Looks great on all devices | SEO Optimized: Rank higher on search engines",
}: NodeFeatureListProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const featureList = features.split("|").map((f) => {
    const [title, desc] = f.split(":").map((i) => i.trim());
    return { title, desc };
  });

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className="w-full py-8"
      style={{
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        cursor: "grab",
      }}
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {featureList.map((feature, index) => (
          <div key={index} className="flex gap-4 p-6 border rounded-lg bg-card">
            <CheckCircle2 className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold mb-2 text-lg">
                {feature.title || "Feature"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc || "Description goes here"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

NodeFeatureList.craft = {
  displayName: "Features",
  props: {
    features:
      "Easy to Use: Intuitive drag and drop interface | Responsive Design: Looks great on all devices | SEO Optimized: Rank higher on search engines",
  },
  related: {},
};
