"use client";

import { useNode } from "@craftjs/core";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NodeInputProps {
  label: string;
  placeholder: string;
  inputType: "text" | "email" | "password" | "number" | "tel" | "url";
  required: boolean;
  name: string;
}

export const NodeInput = ({
  label = "Label",
  placeholder = "Placeholder",
  inputType = "text",
  required = false,
  name = "input",
}: NodeInputProps) => {
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
      <Input
        type={inputType}
        placeholder={placeholder}
        name={name}
        required={required}
        className="pointer-events-none" // Disable interaction in editor
        readOnly
      />
    </div>
  );
};

NodeInput.craft = {
  displayName: "Input",
  props: {
    label: "Email",
    placeholder: "Enter your email",
    inputType: "email",
    required: true,
    name: "email",
  },
  related: {},
};
