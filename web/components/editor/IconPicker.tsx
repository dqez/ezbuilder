"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Pre-define a list of popular icons to avoid rendering all 1000+
const POPULAR_ICONS = [
  "Star",
  "Heart",
  "ThumbsUp",
  "Award",
  "BadgeCheck",
  "Smile",
  "ArrowRight",
  "ArrowLeft",
  "ArrowUp",
  "ArrowDown",
  "Check",
  "X",
  "Plus",
  "Minus",
  "Home",
  "Settings",
  "User",
  "Search",
  "Menu",
  "Bell",
  "Mail",
  "Phone",
  "Camera",
  "Image",
  "Link",
  "ExternalLink",
  "Share2",
  "Download",
  "Upload",
  "Play",
  "Pause",
  "Square",
  "Circle",
  "Triangle",
  "Lock",
  "Unlock",
  "Key",
  "Shield",
  "Info",
  "AlertCircle",
  "AlertTriangle",
  "HelpCircle",
  "Clock",
  "Calendar",
  "Flag",
  "MapPin",
  "Globe",
  "ShoppingCart",
  "CreditCard",
  "DollarSign",
  "Percent",
  "Eye",
  "EyeOff",
  "Mic",
  "Video",
  "Monitor",
  "Smartphone",
];

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
}

export function IconPicker({
  value,
  onChange,
  label = "Chọn biểu tượng",
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredIcons = POPULAR_ICONS.filter((iconName) =>
    iconName.toLowerCase().includes(search.toLowerCase()),
  );

  // Safely render the selected icon
  const SelectedIconComponent =
    (LucideIcons as unknown as Record<string, React.ElementType>)[value] ||
    LucideIcons.Sparkles;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start font-normal gap-2 h-9 px-3"
          >
            <SelectedIconComponent className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm flex-1 truncate text-left">
              {value || label}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3" align="start">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm biểu tượng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-sm"
              />
            </div>

            <div className="h-48 overflow-y-auto pr-1">
              <div className="grid grid-cols-6 gap-1">
                {filteredIcons.map((iconName) => {
                  const Icon = (
                    LucideIcons as unknown as Record<string, React.ElementType>
                  )[iconName];
                  if (!Icon) return null;

                  return (
                    <button
                      key={iconName}
                      onClick={() => {
                        onChange(iconName);
                        setIsOpen(false);
                      }}
                      title={iconName}
                      className={`flex items-center justify-center h-8 w-8 rounded-md transition-colors ${
                        value === iconName
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>

              {filteredIcons.length === 0 && (
                <div className="text-center py-4 text-xs text-muted-foreground">
                  Không tìm thấy biểu tượng.
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
