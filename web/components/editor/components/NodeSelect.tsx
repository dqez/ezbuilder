"use client";

import { useNode } from "@craftjs/core";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface NodeSelectProps {
  label: string;
  placeholder: string;
  options: string; // Comma separated string for simplicity in editor
  required: boolean;
  name: string;
}

export const NodeSelect = ({
  label = "Label",
  placeholder = "Select an option",
  options = "Option 1, Option 2, Option 3",
  required = false,
  name = "select",
}: NodeSelectProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const optionsList = options.split(",").map((opt) => opt.trim());

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
      <div className="pointer-events-none">
        <Select name={name} required={required}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {optionsList.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

NodeSelect.craft = {
  displayName: "Select",
  props: {
    label: "Subject",
    placeholder: "Select a subject",
    options: "General Inquiry, Support, Feedback",
    required: true,
    name: "subject",
  },
  related: {},
};
