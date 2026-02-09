"use client";

import { Editor, Frame } from "@craftjs/core";
import { resolver } from "@/components/editor/components";

interface PublicRendererProps {
  content: Record<string, unknown> | string; // Support both object and serialized string
}

export const PublicRenderer = ({ content }: PublicRendererProps) => {
  const jsonContent =
    typeof content === "string" ? content : JSON.stringify(content);

  return (
    <Editor
      resolver={resolver}
      enabled={false} // Disable editing
    >
      <Frame json={jsonContent}>
        {/* Content will be rendered from JSON */}
      </Frame>
    </Editor>
  );
};
