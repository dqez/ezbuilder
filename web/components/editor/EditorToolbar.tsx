"use client";

import { useState } from "react";

import { useEditor } from "@craftjs/core";
import { Button } from "@/components/ui/button";
import {
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Bot,
  Check,
  Loader2,
  ArrowLeft,
  Upload,
  EyeOff,
} from "lucide-react";
import { useAiStore } from "@/lib/stores/ai-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PublishWizardDialog } from "./PublishWizardDialog";

type SaveStatus = "idle" | "saving" | "saved";

interface EditorToolbarProps {
  onDeviceChange?: (device: "desktop" | "tablet" | "mobile") => void;
  currentDevice?: "desktop" | "tablet" | "mobile";
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  saveStatus?: SaveStatus;
  restartTour?: React.ReactNode;
  onPublish?: () => void;
  isPublished?: boolean;
  isPublishing?: boolean;
  pageName?: string;
  pageSlug?: string;
  websiteId?: string;
}

export const EditorToolbar = ({
  onDeviceChange,
  currentDevice = "desktop",
  zoom = 1,
  onZoomChange,
  saveStatus = "idle",
  restartTour,
  onPublish,
  isPublished,
  isPublishing,
  pageName,
  pageSlug,
  websiteId,
}: EditorToolbarProps) => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const { actions, canUndo, canRedo } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const handleUndo = () => {
    if (canUndo) {
      actions.history.undo();
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      actions.history.redo();
    }
  };

  return (
    <TooltipProvider>
      <div className="h-14 border-b bg-background flex items-center justify-between px-4">
        {/* Left: Undo/Redo & Navigation */}
        <div className="flex items-center gap-4">
          {websiteId && (
            <>
              <a
                href={`/sites/${websiteId}`}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </a>
              <span className="text-muted-foreground">/</span>
              {pageName && (
                <span className="font-medium text-sm">{pageName}</span>
              )}
              <div className="w-px h-4 bg-border mx-2"></div>
            </>
          )}

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className="h-9 w-9"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hoàn tác (Ctrl+Z)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRedo}
                  disabled={!canRedo}
                  className="h-9 w-9"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Làm lại (Ctrl+Y)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Center: Device Preview + Zoom */}
        <div className="flex items-center gap-4">
          {onDeviceChange && (
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={
                      currentDevice === "desktop" ? "secondary" : "ghost"
                    }
                    size="icon"
                    onClick={() => onDeviceChange("desktop")}
                    className="h-8 w-8"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Máy tính</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={currentDevice === "tablet" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => onDeviceChange("tablet")}
                    className="h-8 w-8"
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Máy tính bảng (768px)</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={currentDevice === "mobile" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => onDeviceChange("mobile")}
                    className="h-8 w-8"
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Điện thoại (375px)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {onZoomChange && (
            <div className="flex items-center gap-1 border-l pl-4">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs font-mono w-12 text-center text-muted-foreground select-none">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => onZoomChange(Math.min(1.5, zoom + 0.1))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Save Status Indicator */}
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
              <Loader2 className="h-3 w-3 animate-spin" />
              Đang lưu...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1.5 text-xs text-green-600">
              <Check className="h-3 w-3" />
              Đã lưu
            </span>
          )}

          {restartTour}

          <Button
            data-tour="ai-button"
            variant={useAiStore().isPanelOpen ? "default" : "outline"}
            size="sm"
            onClick={useAiStore().togglePanel}
            className="gap-2"
          >
            <Bot className="h-4 w-4" />
            Trợ lý AI
          </Button>

          <Button variant="outline" size="sm">
            Xem trước
          </Button>

          {onPublish && (
            <>
              <Button
                variant={isPublished ? "outline" : "default"}
                size="sm"
                onClick={() =>
                  isPublished ? onPublish() : setIsWizardOpen(true)
                }
                disabled={isPublishing}
              >
                {isPublishing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : isPublished ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Hủy xuất bản
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-1" />
                    Xuất bản
                  </>
                )}
              </Button>
              <PublishWizardDialog
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                onConfirm={onPublish}
                isPublishing={!!isPublishing}
                isPublished={!!isPublished}
                websiteId={websiteId}
                pageName={pageName}
                pageSlug={pageSlug}
              />
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
