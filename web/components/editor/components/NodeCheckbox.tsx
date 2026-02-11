"use client";

import { useNode } from "@craftjs/core";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface NodeCheckboxProps {
  label: string;
  required: boolean;
  name: string;
  defaultChecked: boolean;
}

export const NodeCheckbox = ({
  label = "I agree to the terms",
  required = false,
  name = "checkbox",
  defaultChecked = false,
}: NodeCheckboxProps) => {
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
      className="flex items-center space-x-2"
      style={{
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        padding: "8px 4px",
        borderRadius: "4px",
        cursor: "grab",
      }}
    >
      <div className="pointer-events-none flex items-center space-x-2">
        <Checkbox id={name} checked={defaultChecked} />
        <Label
          htmlFor={name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      </div>
    </div>
  );
};

NodeCheckbox.craft = {
  displayName: "Checkbox",
  props: {
    label: "I agree to the terms and policies",
    required: true,
    name: "terms",
    defaultChecked: false,
  },
  related: {},
};
