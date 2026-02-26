"use client";

import { useEditor } from "@craftjs/core";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  LayoutTemplate,
  Type,
  Palette,
  MoveHorizontal,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VisualSlider } from "./VisualSlider";

const COLOR_SCHEMES = [
  {
    name: "Mặc định",
    primary: "oklch(0.205 0 0)",
    ring: "oklch(0.708 0 0)",
    bg: "#000000",
  },
  {
    name: "Đại dương",
    primary: "oklch(0.45 0.15 250)",
    ring: "oklch(0.6 0.1 250)",
    bg: "#2563eb",
  },
  {
    name: "Rừng sâu",
    primary: "oklch(0.4 0.1 140)",
    ring: "oklch(0.6 0.1 140)",
    bg: "#16a34a",
  },
  {
    name: "Hoàng hôn",
    primary: "oklch(0.5 0.2 30)",
    ring: "oklch(0.7 0.15 30)",
    bg: "#ea580c",
  },
  {
    name: "Doanh nghiệp",
    primary: "oklch(0.3 0.05 220)",
    ring: "oklch(0.5 0.05 220)",
    bg: "#1e3a8a",
  },
  {
    name: "Hiện đại",
    primary: "oklch(0.6 0.2 340)",
    ring: "oklch(0.8 0.15 340)",
    bg: "#db2777",
  },
];

const FONT_FAMILIES = [
  { name: "Geist Sans", value: "var(--font-geist-sans)" },
  {
    name: "Inter",
    value: "Inter, sans-serif",
    import:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  },
  {
    name: "Roboto",
    value: "Roboto, sans-serif",
    import:
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
  },
  {
    name: "Playfair Display",
    value: "'Playfair Display', serif",
    import:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap",
  },
  {
    name: "Space Grotesk",
    value: "'Space Grotesk', sans-serif",
    import:
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",
  },
];

const SPACING_SCALES = [
  { name: "Nhỏ gọn", value: "14px", label: "S" },
  { name: "Chuẩn", value: "16px", label: "M" },
  { name: "Rộng rãi", value: "18px", label: "L" },
];

export const GlobalSettingsPanel = () => {
  const { actions, themeProps } = useEditor((state) => ({
    themeProps: state.nodes["ROOT"]?.data.custom?.theme || {},
  }));

  const [activeFont, setActiveFont] = useState(
    themeProps.fontFamily || FONT_FAMILIES[0].value,
  );
  const [activeColorScheme, setActiveColorScheme] = useState(
    themeProps.colorScheme || "Mặc định",
  );
  const [activeSpacing, setActiveSpacing] = useState(
    themeProps.baseSize || "16px",
  );

  // Load font stylesheet if needed
  useEffect(() => {
    const font = FONT_FAMILIES.find((f) => f.value === activeFont);
    if (font?.import) {
      const id = `font-${font.name.replace(/\s+/g, "-")}`;
      if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = font.import;
        document.head.appendChild(link);
      }
    }
  }, [activeFont]);

  // Apply visual changes and save to ROOT custom data
  const updateTheme = (updates: Record<string, unknown>) => {
    actions.setCustom("ROOT", (custom) => {
      custom.theme = { ...custom.theme, ...updates };
    });
  };

  const handleColorChange = (
    schemeName: string,
    primary: string,
    ring: string,
  ) => {
    setActiveColorScheme(schemeName);
    document.documentElement.style.setProperty("--primary", primary);
    document.documentElement.style.setProperty("--ring", ring);
    updateTheme({ colorScheme: schemeName, primary, ring });
  };

  const handleFontChange = (fontValue: string) => {
    setActiveFont(fontValue);
    // Apply globally to canvas wrapper, but since the editor is in the same DOM,
    // we set it at root but it might affect editor UI. Better to inject styling for the preview container.
    // For simplicity & MVP, let's just set body class or let them know it applies to the preview.
    const canvas = document.querySelector(
      '[data-tour="canvas"]',
    ) as HTMLElement;
    if (canvas) {
      canvas.style.fontFamily = fontValue;
    }
    updateTheme({ fontFamily: fontValue });
  };

  const handleSpacingChange = (size: string) => {
    setActiveSpacing(size);
    // Alter root font-size scales all rem units (padding, margin, etc.)
    const canvas = document.querySelector(
      '[data-tour="canvas"] .bg-white',
    ) as HTMLElement;
    if (canvas) {
      canvas.style.fontSize = size;
    }
    updateTheme({ baseSize: size });
  };

  // Border Radius using VisualSlider
  const [radius, setRadius] = useState(themeProps.radius || 0.5);

  const handleRadiusChange = (val: number) => {
    setRadius(val);
    document.documentElement.style.setProperty("--radius", `${val}rem`);
    updateTheme({ radius: val });
  };

  return (
    <div className="p-4 space-y-6 bg-muted/10 h-full overflow-y-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Thiết kế Tổng thể</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Đồng bộ phong cách trên toàn bộ trang web.
        </p>
      </div>

      <Separator />

      {/* 1. Color Scheme */}
      <div className="space-y-3">
        <Label className="flex items-center justify-between text-sm font-medium">
          Màu nền tảng (Theme)
          <span className="text-xs text-muted-foreground font-normal">
            {activeColorScheme}
          </span>
        </Label>
        <div className="grid grid-cols-6 gap-2">
          {COLOR_SCHEMES.map((scheme) => (
            <button
              key={scheme.name}
              title={scheme.name}
              onClick={() =>
                handleColorChange(scheme.name, scheme.primary, scheme.ring)
              }
              className={cn(
                "w-full aspect-square rounded-full flex items-center justify-center transition-all",
                activeColorScheme === scheme.name
                  ? "ring-2 ring-primary ring-offset-2 scale-110"
                  : "hover:scale-105 ring-1 ring-border shadow-sm",
              )}
              style={{ backgroundColor: scheme.bg }}
            >
              {activeColorScheme === scheme.name && (
                <CheckCircle2 className="w-4 h-4 text-white drop-shadow-md" />
              )}
            </button>
          ))}
        </div>
        <div className="pt-2 flex items-center justify-between bg-muted/40 p-2 rounded-md border">
          <Label
            className="text-xs text-muted-foreground cursor-pointer"
            htmlFor="customBgColor"
          >
            Màu tuỳ chỉnh
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="customBgColor"
              type="color"
              className="w-8 h-8 p-0 cursor-pointer rounded overflow-hidden border-0"
              onChange={(e) => {
                const hex = e.target.value;
                // Extremely rough okclh mapping for MVP custom color
                handleColorChange("Tùy chỉnh", hex, hex);
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Typography */}
      <div className="space-y-3 pt-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Type className="w-4 h-4 text-muted-foreground" />
          Kiểu chữ (Font)
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {FONT_FAMILIES.map((font) => (
            <button
              key={font.name}
              onClick={() => handleFontChange(font.value)}
              className={cn(
                "px-3 py-2 rounded-md text-sm border text-left transition-all",
                activeFont === font.value
                  ? "border-primary bg-primary/5 font-medium text-primary shadow-sm"
                  : "border-border hover:border-muted-foreground/30 bg-background text-muted-foreground",
              )}
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Spacing Scale */}
      <div className="space-y-3 pt-2">
        <Label className="flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2">
            <MoveHorizontal className="w-4 h-4 text-muted-foreground" />
            Tỷ lệ không gian
          </div>
          <span className="text-xs text-muted-foreground font-normal">
            {SPACING_SCALES.find((s) => s.value === activeSpacing)?.name}
          </span>
        </Label>
        <div className="grid grid-cols-3 gap-2 bg-muted/40 p-1 rounded-lg border">
          {SPACING_SCALES.map((scale) => (
            <button
              key={scale.value}
              onClick={() => handleSpacingChange(scale.value)}
              className={cn(
                "px-2 py-1.5 rounded-md text-xs transition-all flex flex-col items-center gap-1",
                activeSpacing === scale.value
                  ? "bg-background shadow-sm font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="text-[10px] font-bold opacity-50">
                {scale.label}
              </span>
              {scale.name}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground leading-tight">
          Ảnh hưởng đến khoảng cách, lề và kích thước chữ tổng thể.
        </p>
      </div>

      {/* 4. Global Border Radius */}
      <div className="space-y-3 pt-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
          Độ bo cong góc (Border Radius)
        </Label>
        <VisualSlider
          value={radius}
          onChange={handleRadiusChange}
          min={0}
          max={2}
          step={0.1}
        />
      </div>
    </div>
  );
};
