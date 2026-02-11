"use client";

import { useNode } from "@craftjs/core";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NodeRichTextProps {
  text: string;
  fontSize: number;
  color: string;
  textAlign: "left" | "center" | "right";
  fontWeight: number;
}

export const NodeRichText = ({
  text = "Edit this rich text",
  fontSize = 16,
  color = "#000000",
  textAlign = "left",
  fontWeight = 400,
}: NodeRichTextProps) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setShowToolbar(true);
  }, []);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      setIsEditing(false);
      setShowToolbar(false);
      setProp((props: NodeRichTextProps) => {
        props.text = e.target.innerHTML;
      });
    },
    [setProp],
  );

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        padding: "8px",
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        borderRadius: "4px",
        cursor: isEditing ? "text" : "grab",
        position: "relative",
      }}
    >
      {showToolbar && (
        <div
          className="flex items-center gap-1 p-2 bg-background border rounded-lg shadow-lg mb-2"
          style={{ width: "fit-content" }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand("bold");
            }}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand("italic");
            }}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand("underline");
            }}
          >
            <Underline className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onMouseDown={(e) => {
              e.preventDefault();
              insertLink();
            }}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onMouseDown={(e) => {
              e.preventDefault();
              setProp((props: NodeRichTextProps) => {
                props.textAlign = "left";
              });
            }}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onMouseDown={(e) => {
              e.preventDefault();
              setProp((props: NodeRichTextProps) => {
                props.textAlign = "center";
              });
            }}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onMouseDown={(e) => {
              e.preventDefault();
              setProp((props: NodeRichTextProps) => {
                props.textAlign = "right";
              });
            }}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div
        ref={editorRef}
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        contentEditable={isEditing}
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: text }}
        style={{
          fontSize: `${fontSize}px`,
          color,
          textAlign,
          fontWeight,
          minHeight: "24px",
          outline: "none",
        }}
      />
    </div>
  );
};

NodeRichText.craft = {
  displayName: "Rich Text",
  props: {
    text: "Edit this rich text",
    fontSize: 16,
    color: "#000000",
    textAlign: "left",
    fontWeight: 400,
  },
  related: {},
};
