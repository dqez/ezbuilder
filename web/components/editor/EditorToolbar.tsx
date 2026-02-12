"use client";

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
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditorToolbarProps {
  onDeviceChange?: (device: "desktop" | "tablet" | "mobile") => void;
  currentDevice?: "desktop" | "tablet" | "mobile";
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
}

export const EditorToolbar = ({
  onDeviceChange,
  currentDevice = "desktop",
  zoom = 1,
  onZoomChange,
}: EditorToolbarProps) => {
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
        {/* Left: Undo/Redo */}
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
              <p>Undo (Ctrl+Z)</p>
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
              <p>Redo (Ctrl+Y)</p>
            </TooltipContent>
          </Tooltip>
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
                  <p>Desktop View</p>
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
                  <p>Tablet View (768px)</p>
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
                  <p>Mobile View (375px)</p>
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
          <Button variant="outline" size="sm">
            Preview
          </Button>
          <Button size="sm">Publish</Button>
        </div>
      </div>
    </TooltipProvider>
  );
};
