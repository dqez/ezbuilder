"use client";

import { Editor, Frame, Element } from "@craftjs/core";
import { useState, useEffect } from "react";
import { EditorToolbar } from "./EditorToolbar";
import { Toolbox } from "./Toolbox";
import { SettingsPanel } from "./SettingsPanel";
import { resolver } from "./components";
import { NodeContainer } from "./components/NodeContainer";
import { LayersPanel } from "./LayersPanel";
import { RenderNode } from "./RenderNode";
import { ShortcutsHandler } from "./ShortcutsHandler";
import { AiChatPanel } from "../ai/AiChatPanel";
import { useAiStore } from "@/lib/stores/ai-store";

interface BuilderProps {
  initialData?: string | null;
  onSave?: (json: string) => void;
  pageId: string; // Required for AI chat
}

type DeviceType = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTHS = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export const Builder = ({ onSave, pageId }: BuilderProps) => {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [zoom, setZoom] = useState(1);

  // Keyboard shortcuts for undo/redo are handled by Craft.js automatically
  const [activeTab, setActiveTab] = useState<"components" | "layers">(
    "components",
  );

  const togglePanel = useAiStore((state) => state.togglePanel);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + I
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
        e.preventDefault();
        togglePanel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePanel]);

  // Keyboard shortcuts managed by ShortcutsHandler component inside Editor context

  return (
    <Editor
      resolver={resolver}
      onRender={RenderNode}
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
      <ShortcutsHandler />
      <div className="flex flex-col h-screen bg-muted/30">
        {/* Toolbar */}
        <EditorToolbar
          onDeviceChange={setDevice}
          currentDevice={device}
          zoom={zoom}
          onZoomChange={setZoom}
        />

        {/* Main Editor Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Toolbox & Layers */}
          <aside className="w-64 bg-background border-r flex flex-col overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="p-2 border-b bg-background z-10">
                <div className="w-full grid grid-cols-2 bg-muted p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab("components")}
                    className={`text-sm font-medium py-1.5 rounded-md transition-all ${
                      activeTab === "components"
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Components
                  </button>
                  <button
                    onClick={() => setActiveTab("layers")}
                    className={`text-sm font-medium py-1.5 rounded-md transition-all ${
                      activeTab === "layers"
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Layers
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {activeTab === "components" ? (
                  <Toolbox />
                ) : (
                  <div className="p-2">
                    <LayersPanel />
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Center - Canvas */}
          <main className="flex-1 overflow-auto p-8 bg-muted/30">
            <div className="min-h-full flex items-start justify-center pb-20">
              <div
                className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 origin-top"
                style={{
                  width: DEVICE_WIDTHS[device],
                  maxWidth: "100%",
                  minHeight: "800px",
                  transform: `scale(${zoom})`,
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

          {/* AI Chat Panel */}
          <AiChatPanel pageId={pageId} />
        </div>
      </div>
    </Editor>
  );
};
