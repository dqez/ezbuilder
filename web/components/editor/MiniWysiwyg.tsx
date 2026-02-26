"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading1,
  Heading2,
  RemoveFormatting,
} from "lucide-react";

interface MiniWysiwygProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MiniWysiwyg({
  value,
  onChange,
  placeholder = "Enter text here...",
}: MiniWysiwygProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.innerHTML !== value &&
      !isActive
    ) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value, isActive]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    handleInput();
  };

  const handleLink = () => {
    const url = prompt("Enter link URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  return (
    <div className="border border-input rounded-md overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
      <div className="flex flex-wrap items-center gap-1 p-1 bg-muted/50 border-b border-input">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-sm"
          onClick={() => execCommand("bold")}
          title="Bold"
          type="button"
        >
          <Bold className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-sm"
          onClick={() => execCommand("italic")}
          title="Italic"
          type="button"
        >
          <Italic className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-sm"
          onClick={() => execCommand("underline")}
          title="Underline"
          type="button"
        >
          <Underline className="w-3.5 h-3.5" />
        </Button>

        <div className="w-px h-4 bg-border mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-sm"
          onClick={() => execCommand("formatBlock", "H1")}
          title="Heading 1"
          type="button"
        >
          <Heading1 className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-sm"
          onClick={() => execCommand("formatBlock", "H2")}
          title="Heading 2"
          type="button"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </Button>

        <div className="w-px h-4 bg-border mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-sm"
          onClick={() => execCommand("insertUnorderedList")}
          title="Bullet List"
          type="button"
        >
          <List className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-sm"
          onClick={() => execCommand("insertOrderedList")}
          title="Numbered List"
          type="button"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </Button>

        <div className="w-px h-4 bg-border mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-sm"
          onClick={handleLink}
          title="Insert Link"
          type="button"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-sm"
          onClick={() => execCommand("removeFormat")}
          title="Remove Formatting"
          type="button"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        className="min-h-[120px] max-h-[300px] overflow-y-auto p-3 text-sm focus:outline-none focus:ring-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h2]:text-xl [&>h2]:font-bold [&>h3]:text-lg [&>h3]:font-bold [&>a]:text-blue-500 [&>a]:underline"
        data-placeholder={placeholder}
      />
    </div>
  );
}
