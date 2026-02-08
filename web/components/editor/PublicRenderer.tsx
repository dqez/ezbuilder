"use client";

import { Editor, Frame } from "@craftjs/core";
import { resolver } from "@/components/editor/components";

interface PublicRendererProps {
  content: string; // Serialized JSON from Craft.js
}

export const PublicRenderer = ({ content }: PublicRendererProps) => {
  return (
    <Editor
      resolver={resolver}
      enabled={false} // Disable editing
    >
      <Frame json={content}>{/* Content will be rendered from JSON */}</Frame>
    </Editor>
  );
};
