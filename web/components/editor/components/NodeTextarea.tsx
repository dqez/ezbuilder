"use client";

import { useNode } from "@craftjs/core";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface NodeTextareaProps {
  label: string;
  placeholder: string;
  rows: number;
  required: boolean;
  name: string;
}

export const NodeTextarea = ({
  label = "Label",
  placeholder = "Placeholder",
  rows = 4,
  required = false,
  name = "textarea",
}: NodeTextareaProps) => {
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
      className="w-full space-y-2"
      style={{
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        padding: "4px",
        borderRadius: "4px",
        cursor: "grab",
      }}
    >
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        placeholder={placeholder}
        rows={rows}
        name={name}
        required={required}
        className="pointer-events-none resize-none" // Disable interaction in editor
        readOnly
      />
    </div>
  );
};

NodeTextarea.craft = {
  displayName: "Textarea",
  props: {
    label: "Message",
    placeholder: "Enter your message",
    rows: 4,
    required: true,
    name: "message",
  },
  related: {},
};
