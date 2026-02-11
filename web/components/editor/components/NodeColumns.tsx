"use client";

import { useNode, Element } from "@craftjs/core";
import { NodeContainer } from "./NodeContainer";

interface NodeColumnsProps {
  columns: number;
  gap: number;
  padding: number;
  backgroundColor: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  boxShadow?: string;
  backgroundImage?: string;
  animation?: string;
  mobilePadding?: number;
  mobileGap?: number;
}

export const NodeColumns = ({
  columns = 2,
  gap = 16,
  padding = 16,
  backgroundColor = "transparent",
  borderRadius = 0,
  borderWidth = 0,
  borderColor = "transparent",
  boxShadow = "none",
  backgroundImage = "",
  animation = "",
  mobilePadding,
  mobileGap,
}: NodeColumnsProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const mPadding = mobilePadding !== undefined ? mobilePadding : padding;
  const mGap = mobileGap !== undefined ? mobileGap : gap;

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className={`w-full flex flex-col md:flex-row ${animation} p-(--p-mobile) md:p-(--p-desktop) gap-(--g-mobile) md:gap-(--g-desktop)`}
      style={
        {
          // gap/padding handled by class vars
          "--p-desktop": `${padding}px`,
          "--p-mobile": `${mPadding}px`,
          "--g-desktop": `${gap}px`,
          "--g-mobile": `${mGap}px`,
          backgroundColor,
          backgroundImage,
          borderRadius: `${borderRadius}px`,
          border: `${borderWidth}px solid ${borderColor}`,
          boxShadow,
          outline: selected ? "2px solid #3b82f6" : "none",
          outlineOffset: "2px",
          minHeight: "100px",
        } as React.CSSProperties
      }
    >
      {Array.from({ length: columns }).map((_, index) => (
        <div
          key={index}
          className="flex-1 w-full md:w-auto h-full min-h-[50px]"
        >
          <Element
            canvas
            id={`column-${index}`}
            is={NodeContainer}
            padding={8}
            backgroundColor="#f9fafb"
            flexDirection="column"
            width="100%"
            height="100%"
          />
        </div>
      ))}
    </div>
  );
};

NodeColumns.craft = {
  displayName: "Columns",
  props: {
    columns: 2,
    gap: 16,
    padding: 16,
    backgroundColor: "transparent",
  },
  related: {},
};
