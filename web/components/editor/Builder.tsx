"use client";

import { Editor, Frame, Element } from "@craftjs/core";
import { useState, useEffect } from "react";
import { EditorToolbar } from "./EditorToolbar";
import { Toolbox } from "./Toolbox";
import { SettingsPanel } from "./SettingsPanel";
import { resolver } from "./components";
import { NodeContainer } from "./components/NodeContainer";

interface BuilderProps {
  initialData?: string | null;
  onSave?: (json: string) => void;
}

type DeviceType = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTHS = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export const Builder = ({ initialData, onSave }: BuilderProps) => {
  const [device, setDevice] = useState<DeviceType>("desktop");

  // Keyboard shortcuts for undo/redo are handled by Craft.js automatically
  // But we can add custom shortcuts here if needed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default browser behavior for Ctrl+Z/Y
      if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "y")) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Editor
      resolver={resolver}
      onNodesChange={(query) => {
        // Auto-save debounced
        if (onSave) {
          const timer = setTimeout(() => {
            const json = query.serialize();
            onSave(json);
          }, 2000);
          return () => clearTimeout(timer);
        }
      }}
    >
      <div className="flex flex-col h-screen bg-muted/30">
        {/* Toolbar */}
        <EditorToolbar onDeviceChange={setDevice} currentDevice={device} />

        {/* Main Editor Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Toolbox */}
          <aside className="w-64 bg-background border-r flex flex-col overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Components
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Toolbox />
            </div>
          </aside>

          {/* Center - Canvas */}
          <main className="flex-1 overflow-auto p-8">
            <div className="min-h-full flex items-start justify-center">
              <div
                className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
                style={{
                  width: DEVICE_WIDTHS[device],
                  maxWidth: "100%",
                  minHeight: "800px",
                }}
              >
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
              </div>
            </div>
          </main>

          {/* Right Sidebar - Settings */}
          <aside className="w-72 bg-background border-l flex flex-col overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Properties
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SettingsPanel />
            </div>
          </aside>
        </div>
      </div>
    </Editor>
  );
};
