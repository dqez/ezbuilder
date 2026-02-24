"use client";

import { Editor, Frame, Element } from "@craftjs/core";
import { resolver } from "@/components/editor/components";
import { NodeContainer } from "@/components/editor/components/NodeContainer";

interface PublicRendererProps {
  content: Record<string, unknown> | string; // Support both object and serialized string
}

export const PublicRenderer = ({ content }: PublicRendererProps) => {
  let isEmpty = false;
  let parsedContent: Record<string, unknown> | null = null;

  try {
    parsedContent = typeof content === "string" ? JSON.parse(content) : content;

    if (
      !parsedContent ||
      Object.keys(parsedContent).length === 0 ||
      !parsedContent.ROOT
    ) {
      isEmpty = true;
    } else {
      const rootNode = parsedContent.ROOT as Record<string, unknown>;
      // Check if this is real Craft.js serialized content or just backend default
      const rootType = rootNode?.type as Record<string, unknown> | undefined;
      const isBackendDefault =
        rootType &&
        typeof rootType === "object" &&
        "resolvedName" in rootType &&
        rootType.resolvedName === "NodeContainer" &&
        Array.isArray(rootNode.nodes) &&
        rootNode.nodes.length === 0;

      if (isBackendDefault || !rootType) {
        isEmpty = true;
      }
    }
  } catch {
    isEmpty = true; // Error parsing means it's invalid/empty
  }

  const jsonContent =
    typeof content === "string" ? content : JSON.stringify(content);

  return (
    <Editor
      resolver={resolver}
      enabled={false} // Disable editing
    >
      {isEmpty ? (
        <Frame>
          <Element
            canvas
            is={NodeContainer}
            padding={24}
            backgroundColor="#ffffff"
            flexDirection="column"
            gap={16}
          ></Element>
        </Frame>
      ) : (
        <Frame data={jsonContent}>
          {/* Content will be rendered from data */}
        </Frame>
      )}
    </Editor>
  );
};
