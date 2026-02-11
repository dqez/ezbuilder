"use client";

import { useNode, Element } from "@craftjs/core";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NodeContainer } from "./NodeContainer";

interface NodeAccordionProps {
  items: string[]; // List of titles
}

export const NodeAccordion = ({
  items = ["Item 1", "Item 2"],
}: NodeAccordionProps) => {
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
      }}
    >
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="px-4">{item}</AccordionTrigger>
            <AccordionContent className="p-4 bg-muted/20">
              <Element
                canvas
                id={`accordion-content-${index}`}
                is={NodeContainer}
                padding={8}
                backgroundColor="transparent"
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

NodeAccordion.craft = {
  displayName: "Accordion",
  props: {
    items: ["Section 1", "Section 2", "Section 3"],
  },
  related: {},
};
