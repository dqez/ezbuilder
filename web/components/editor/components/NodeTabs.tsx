"use client";

import { useNode, Element } from "@craftjs/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NodeContainer } from "./NodeContainer";

interface NodeTabsProps {
  tabs: string[];
  defaultValue: string;
}

export const NodeTabs = ({
  tabs = ["Tab 1", "Tab 2", "Tab 3"],
  defaultValue = "tab-0",
}: NodeTabsProps) => {
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
      className="w-full"
      style={{
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        padding: "8px",
      }}
    >
      <Tabs defaultValue={defaultValue} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {tabs.map((tab, index) => (
            <TabsTrigger key={`trigger-${index}`} value={`tab-${index}`}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab, index) => (
          <TabsContent
            key={`content-${index}`}
            value={`tab-${index}`}
            className="mt-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm"
          >
            <Element
              canvas
              id={`tab-content-${index}`}
              is={NodeContainer}
              padding={16}
              width="100%"
              height="auto"
              backgroundColor="transparent"
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

NodeTabs.craft = {
  displayName: "Tabs",
  props: {
    tabs: ["Details", "Reviews", "FAQ"],
    defaultValue: "tab-0",
  },
  related: {},
};
