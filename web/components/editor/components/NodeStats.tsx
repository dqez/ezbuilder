"use client";

import { useNode } from "@craftjs/core";

interface NodeStatsProps {
  stats: string; // "Value: Label, Value: Label"
}

export const NodeStats = ({
  stats = "10k+: Active Users, 500+: Components, 99.9%: Uptime",
}: NodeStatsProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const statsList = stats.split(",").map((s) => {
    const [value, label] = s.split(":").map((i) => i.trim());
    return { value, label };
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
      <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
        {statsList.map((stat, index) => (
          <div key={index} className="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt className="text-base leading-7 text-muted-foreground">
              {stat.label || "Label"}
            </dt>
            <dd className="order-first text-3xl font-semibold tracking-tight sm:text-5xl">
              {stat.value || "0"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

NodeStats.craft = {
  displayName: "Stats",
  props: {
    stats: "10k+: Active Users, 500+: Components, 99.9%: Uptime",
  },
  related: {},
};
