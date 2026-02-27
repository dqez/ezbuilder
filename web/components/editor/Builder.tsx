"use client";

import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import { useState, useEffect, useRef } from "react";
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
import { OnboardingTour, RestartTourButton } from "./OnboardingTour";
import { CanvasEmptyState } from "./CanvasEmptyState";

interface BuilderProps {
  initialData?: string | null;
  onSave?: (json: string) => void;
  pageId: string;
  pageName?: string;
  pageSlug?: string;
  websiteId?: string;
  isPublished?: boolean;
  isPublishing?: boolean;
  onPublish?: () => void;
}

const DataDeserializer = ({ initialData }: { initialData?: string | null }) => {
  const { actions } = useEditor();
  const initialLoadRef = useRef(false);

  useEffect(() => {
    if (initialData && !initialLoadRef.current) {
      try {
        const content = JSON.parse(initialData);
        if (typeof content === "object" && "ROOT" in content) {
          const rootNode = content.ROOT as Record<string, unknown>;
          const isBackendDefault =
            rootNode?.type &&
            typeof rootNode.type === "object" &&
            "resolvedName" in rootNode.type &&
            (rootNode.type as { resolvedName: string }).resolvedName ===
              "NodeContainer" &&
            Array.isArray(rootNode.nodes) &&
            rootNode.nodes.length === 0;

          if (!isBackendDefault) {
            actions.deserialize(initialData);
          }
        }
        initialLoadRef.current = true;
      } catch (e) {
        console.error("Failed to load page content:", e);
        initialLoadRef.current = true;
      }
    }
  }, [initialData, actions]);

  return null;
};

type DeviceType = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTHS = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export const Builder = ({
  onSave,
  pageId,
  pageName,
  pageSlug,
  websiteId,
  isPublished,
  isPublishing,
  onPublish,
  initialData,
}: BuilderProps) => {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [zoom, setZoom] = useState(1);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  // Keyboard shortcuts for undo/redo are handled by Craft.js automatically
  const [activeTab, setActiveTab] = useState<"components" | "layers">(
    "components",
  );

  const togglePanel = useAiStore((state) => state.togglePanel);
  const setCurrentPageId = useAiStore((state) => state.setCurrentPageId);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDirtyRef = useRef(false);

  // Store pageId so RenderNode (CraftJS subtree) can access it without prop drilling
  useEffect(() => {
    setCurrentPageId(pageId);
  }, [pageId, setCurrentPageId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + I
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
        e.preventDefault();
        togglePanel();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
        e.returnValue = "Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời đi?";
        return e.returnValue;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [togglePanel]);

  // Keyboard shortcuts managed by ShortcutsHandler component inside Editor context

  return (
    <Editor
      resolver={resolver}
      onRender={RenderNode}
      onNodesChange={(query) => {
        // Auto-save debounced
        if (onSave) {
          isDirtyRef.current = true;

          if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
          }

          setSaveStatus("saving");

          saveTimeoutRef.current = setTimeout(async () => {
            try {
              const json = query.serialize();
              await onSave(json);
              isDirtyRef.current = false;
              setSaveStatus("saved");
              // Reset to idle after 2 seconds
              setTimeout(() => setSaveStatus("idle"), 2000);
            } catch (error) {
              console.error("Auto-save failed:", error);
              setSaveStatus("idle");
            }
          }, 1000); // Debounce for 1 second
        }
      }}
    >
      <DataDeserializer initialData={initialData} />
      <ShortcutsHandler />
      <OnboardingTour />
      <div className="flex flex-col h-screen bg-muted/30">
        {/* Toolbar */}
        <EditorToolbar
          onDeviceChange={setDevice}
          currentDevice={device}
          zoom={zoom}
          onZoomChange={setZoom}
          saveStatus={saveStatus}
          restartTour={<RestartTourButton />}
          onPublish={onPublish}
          isPublished={isPublished}
          isPublishing={isPublishing}
          pageName={pageName}
          pageSlug={pageSlug}
          websiteId={websiteId}
        />

        {/* Main Editor Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Toolbox & Layers */}
          <aside
            data-tour="toolbox"
            className="w-64 bg-background border-r flex flex-col overflow-hidden"
          >
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
                    Thành phần
                  </button>
                  <button
                    onClick={() => setActiveTab("layers")}
                    className={`text-sm font-medium py-1.5 rounded-md transition-all ${
                      activeTab === "layers"
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Lớp
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
          <main
            data-tour="canvas"
            className="flex-1 overflow-auto p-8 bg-muted/20 relative"
            style={{
              backgroundImage: `radial-gradient(circle, var(--border) 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
              backgroundPosition: "0 0",
            }}
          >
            <div className="min-h-full flex items-start justify-center pb-20">
              <div
                className="bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300 origin-top ring-1 ring-border"
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
            <CanvasEmptyState />
          </main>

          {/* Right Sidebar - Settings */}
          <aside
            data-tour="settings"
            className="w-72 bg-background border-l flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b">
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Thuộc tính
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
