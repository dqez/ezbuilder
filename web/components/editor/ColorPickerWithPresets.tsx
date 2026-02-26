"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const PRESET_COLORS = [
  "#000000",
  "#ffffff",
  "#f87171",
  "#fb923c",
  "#fbbf24",
  "#4ade80",
  "#38bdf8",
  "#818cf8",
  "#c084fc",
  "#f472b6",
  "#94a3b8",
  "#1e293b",
];

const RECENT_COLORS_KEY = "ezbuilder_recent_colors";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPickerWithPresets({
  value,
  onChange,
  label = "Chọn màu",
}: ColorPickerProps) {
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_COLORS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        requestAnimationFrame(() => setRecentColors(parsed));
      } catch {
        // Ignore
      }
    }
  }, []);

  const handleColorChange = (color: string) => {
    onChange(color);
  };

  const handleCommitColor = (color: string) => {
    // Add to recent colors when explicitly picked/selected from non-preset
    if (!PRESET_COLORS.includes(color) && !recentColors.includes(color)) {
      const newRecents = [color, ...recentColors].slice(0, 12);
      setRecentColors(newRecents);
      localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(newRecents));
    }
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal gap-2 h-9 px-3"
          >
            <div
              className="w-4 h-4 rounded-full border shadow-sm"
              style={{ backgroundColor: value || "#000000" }}
            />
            <span className="text-sm flex-1 truncate">{value || label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={value || "#000000"}
                onChange={(e) => handleColorChange(e.target.value)}
                onBlur={(e) => handleCommitColor(e.target.value)}
                className="w-8 h-8 p-1 cursor-pointer border-0"
              />
              <Input
                type="text"
                value={value}
                onChange={(e) => handleColorChange(e.target.value)}
                onBlur={(e) => handleCommitColor(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCommitColor(value);
                }}
                className="h-8 flex-1 uppercase text-xs font-mono"
                placeholder="#000000"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase">
                Màu có sẵn
              </span>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      handleColorChange(color);
                      setIsOpen(false);
                    }}
                    className="w-6 h-6 rounded-full border shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {recentColors.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground uppercase">
                  Sử dụng gần đây
                </span>
                <div className="grid grid-cols-6 gap-2">
                  {recentColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        handleColorChange(color);
                        setIsOpen(false);
                      }}
                      className="w-6 h-6 rounded-full border shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
