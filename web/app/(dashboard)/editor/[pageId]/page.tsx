"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import { ArrowLeft, Loader2, Save, Upload, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pagesApi, type Page } from "@/lib/api/pages";
import { Toolbox } from "@/components/editor/Toolbox";
import { SettingsPanel } from "@/components/editor/SettingsPanel";
import { resolver } from "@/components/editor/components";
import { NodeContainer } from "@/components/editor/components/NodeContainer";

type DeviceType = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTHS = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

function SaveStatus({
  saving,
  lastSaved,
}: {
  saving: boolean;
  lastSaved: Date | null;
}) {
  if (saving) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Save className="w-3 h-3 animate-pulse" />
        Đang lưu...
      </span>
    );
  }
  if (lastSaved) {
    return (
      <span className="text-xs text-muted-foreground">
        Đã lưu lúc {lastSaved.toLocaleTimeString("vi-VN")}
      </span>
    );
  }
  return null;
}

function EditorContent({
  page,
  onSave,
  device,
}: {
  page: Page;
  onSave: (content: Record<string, unknown>) => void;
  device: DeviceType;
}) {
  const { query, actions } = useEditor();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadRef = useRef(false);

  // Load initial content
  useEffect(() => {
    // Only attempt to load if:
    // 1. Content exists
    // 2. Content has been previously saved by Craft.js (has special marker)
    // 3. Not already loaded
    if (
      page.content &&
      typeof page.content === "object" &&
      "ROOT" in page.content &&
      !initialLoadRef.current
    ) {
      // Check if this is real Craft.js serialized content or just backend default
      // Real Craft.js content will have specific structure that backend default lacks
      const rootNode = page.content.ROOT as Record<string, unknown>;

      // If ROOT node has 'type.resolvedName', it's from backend default
      // Real Craft.js serialized content has more complex type structure
      const isBackendDefault =
        rootNode?.type &&
        typeof rootNode.type === "object" &&
        "resolvedName" in rootNode.type &&
        (rootNode.type as { resolvedName: string }).resolvedName ===
          "NodeContainer" &&
        Array.isArray(rootNode.nodes) &&
        rootNode.nodes.length === 0;

      if (!isBackendDefault) {
        try {
          actions.deserialize(JSON.stringify(page.content));
          initialLoadRef.current = true;
        } catch (e) {
          console.error("Failed to load page content:", e);
          // Set flag anyway to prevent retry loop
          initialLoadRef.current = true;
        }
      } else {
        // Don't deserialize - let Frame initialize naturally
        initialLoadRef.current = true;
      }
    } else if (!initialLoadRef.current) {
      // Empty content - mark as loaded to prevent retry
      initialLoadRef.current = true;
    }
  }, [page.content, actions]);

  // Auto-save on changes - use interval to check for changes
  useEffect(() => {
    let lastContent = "";

    const checkChanges = () => {
      if (!initialLoadRef.current) return;

      try {
        const json = query.serialize();
        if (json !== lastContent && lastContent !== "") {
          if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
          }
          saveTimeoutRef.current = setTimeout(() => {
            try {
              const content = JSON.parse(json);
              onSave(content);
            } catch (e) {
              console.error("Failed to serialize content:", e);
            }
          }, 2000);
        }
        lastContent = json;
      } catch (e) {
        console.error("Failed to check changes:", e);
      }
    };

    const interval = setInterval(checkChanges, 1000);

    return () => {
      clearInterval(interval);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [query, onSave]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z (Windows) or Cmd+Z (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (query.history.canUndo()) {
          actions.history.undo();
        }
      }

      // Redo: Ctrl+Y (Windows) or Cmd+Shift+Z (Mac/Windows)
      if (
        ((e.ctrlKey || e.metaKey) && e.key === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        if (query.history.canRedo()) {
          actions.history.redo();
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [actions, query]);

  return (
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
  );
}

export default function EditorPage() {
  const params = useParams();
  const pageId = params.pageId as string;

  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const data = await pagesApi.getById(pageId);
        setPage(data);
      } catch {
        setError("Không thể tải trang");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [pageId]);

  const handleSave = useCallback(
    async (content: Record<string, unknown>) => {
      setSaving(true);
      try {
        await pagesApi.update(pageId, { content });
        setLastSaved(new Date());
      } catch (e) {
        console.error("Failed to save:", e);
      } finally {
        setSaving(false);
      }
    },
    [pageId],
  );

  const handlePublish = async () => {
    if (!page) return;
    setPublishing(true);
    try {
      const updated = page.isPublished
        ? await pagesApi.unpublish(pageId)
        : await pagesApi.publish(pageId);
      setPage(updated);
    } catch {
      setError("Không thể publish/unpublish trang");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Trang không tồn tại"}</p>
          <Button asChild variant="outline">
            <Link href="/dashboard">Quay lại Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Editor resolver={resolver}>
      <div className="flex flex-col h-screen bg-muted/30">
        {/* Header */}
        <header className="h-14 px-4 bg-background border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/sites/${page.websiteId}`}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{page.name}</span>
            <SaveStatus saving={saving} lastSaved={lastSaved} />
          </div>

          <div className="flex items-center gap-2">
            {/* Device Toggle */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              {(["desktop", "tablet", "mobile"] as DeviceType[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  className={`px-3 py-1 text-xs rounded ${
                    device === d
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>

            {/* Publish Button */}
            <Button
              variant={page.isPublished ? "outline" : "default"}
              size="sm"
              onClick={handlePublish}
              disabled={publishing}
            >
              {publishing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : page.isPublished ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" />
                  Unpublish
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-1" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </header>

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
          <EditorContent page={page} onSave={handleSave} device={device} />

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
}
