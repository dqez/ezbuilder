"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ColorPickerWithPresets } from "./ColorPickerWithPresets";
import { VisualSlider } from "./VisualSlider";
import { SettingsTabProps } from "./SettingsContentTab";

export const SettingsStyleTab = ({ selected, handlePropChange }: SettingsTabProps) => {
  return (
    <>
          {/* Font Size */}
          {selected.name === "Text" && (
            <div className="space-y-2">
              <Label>Font Size (px)</Label>
              <VisualSlider
                value={selected.props.fontSize || 16}
                onChange={(val) => handlePropChange("fontSize", val)}
                min={8}
                max={120}
              />
            </div>
          )}

          {/* Color */}
          {(selected.name === "Text" || selected.name === "Heading") && (
            <div className="space-y-2">
              <Label>Color</Label>
              <ColorPickerWithPresets
                value={selected.props.color || "#000000"}
                onChange={(color) => handlePropChange("color", color)}
                label="Chọn màu chữ"
              />
            </div>
          )}

          {/* Text Align */}
          {(selected.name === "Text" || selected.name === "Heading") && (
            <div className="space-y-2">
              <Label htmlFor="textAlign">Alignment</Label>
              <select
                id="textAlign"
                value={selected.props.textAlign || "left"}
                onChange={(e) => handlePropChange("textAlign", e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          )}

          {/* Typography Settings */}
          {(selected.name === "Text" || selected.name === "Heading") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fontWeight">Font Weight</Label>
                <select
                  id="fontWeight"
                  value={selected.props.fontWeight || "400"}
                  onChange={(e) =>
                    handlePropChange("fontWeight", e.target.value)
                  }
                  className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                >
                  <option value="300">Light (300)</option>
                  <option value="400">Regular (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="900">Black (900)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <select
                  id="fontFamily"
                  value={selected.props.fontFamily || "inherit"}
                  onChange={(e) =>
                    handlePropChange("fontFamily", e.target.value)
                  }
                  className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                >
                  <option value="inherit">Default</option>
                  <option value="Inter, sans-serif">Inter</option>
                  <option value="'Roboto', sans-serif">Roboto</option>
                  <option value="'Open Sans', sans-serif">Open Sans</option>
                  <option value="'Merriweather', serif">Merriweather</option>
                  <option value="'Courier New', monospace">Monospace</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lineHeight">Line Height</Label>
                <Input
                  id="lineHeight"
                  type="number"
                  step="0.1"
                  value={selected.props.lineHeight || 1.5}
                  onChange={(e) =>
                    handlePropChange("lineHeight", parseFloat(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marginTop">Margin Top (px)</Label>
                <Input
                  id="marginTop"
                  type="number"
                  value={selected.props.marginTop || 0}
                  onChange={(e) =>
                    handlePropChange("marginTop", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marginBottom">Margin Bottom (px)</Label>
                <Input
                  id="marginBottom"
                  type="number"
                  value={selected.props.marginBottom || 0}
                  onChange={(e) =>
                    handlePropChange("marginBottom", parseInt(e.target.value))
                  }
                />
              </div>
            </>
          )}

          {/* Container Padding */}
          {selected.name === "Container" && (
            <>
              <div className="space-y-2">
                <Label>Padding (px)</Label>
                <VisualSlider
                  value={selected.props.padding || 16}
                  onChange={(val) => handlePropChange("padding", val)}
                  min={0}
                  max={200}
                />
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <ColorPickerWithPresets
                  value={selected.props.backgroundColor || "#ffffff"}
                  onChange={(color) =>
                    handlePropChange("backgroundColor", color)
                  }
                  label="Chọn màu nền"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backgroundImage">Background Gradient</Label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  <button
                    className="h-8 rounded border bg-white flex items-center justify-center text-xs text-muted-foreground hover:border-blue-500"
                    onClick={() => handlePropChange("backgroundImage", "")}
                    title="None"
                  >
                    None
                  </button>
                  <button
                    className="h-8 rounded border hover:border-blue-500"
                    style={{
                      background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                    }}
                    onClick={() =>
                      handlePropChange(
                        "backgroundImage",
                        "linear-gradient(to right, #3b82f6, #8b5cf6)",
                      )
                    }
                    title="Blue-Purple"
                  />
                  <button
                    className="h-8 rounded border hover:border-blue-500"
                    style={{
                      background: "linear-gradient(to right, #ef4444, #f97316)",
                    }}
                    onClick={() =>
                      handlePropChange(
                        "backgroundImage",
                        "linear-gradient(to right, #ef4444, #f97316)",
                      )
                    }
                    title="Red-Orange"
                  />
                  <button
                    className="h-8 rounded border hover:border-blue-500"
                    style={{
                      background: "linear-gradient(to right, #10b981, #06b6d4)",
                    }}
                    onClick={() =>
                      handlePropChange(
                        "backgroundImage",
                        "linear-gradient(to right, #10b981, #06b6d4)",
                      )
                    }
                    title="Green-Cyan"
                  />
                </div>
                <Input
                  id="backgroundImage"
                  value={selected.props.backgroundImage || ""}
                  onChange={(e) =>
                    handlePropChange("backgroundImage", e.target.value)
                  }
                  placeholder="linear-gradient(...)"
                  className="text-xs font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label>Gap (px)</Label>
                <VisualSlider
                  value={selected.props.gap || 8}
                  onChange={(val) => handlePropChange("gap", val)}
                  min={0}
                  max={100}
                />
              </div>
            </>
          )}

          {/* Effects Settings */}
          {["Container", "Grid", "Columns"].includes(selected.name) && (
            <>
              <Separator className="my-4" />
              <h4 className="font-medium text-sm mb-3">Effects</h4>

              <div className="space-y-2">
                <Label>Corner Radius (px)</Label>
                <VisualSlider
                  value={selected.props.borderRadius || 0}
                  onChange={(val) => handlePropChange("borderRadius", val)}
                  min={0}
                  max={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="boxShadow">Shadow</Label>
                <select
                  id="boxShadow"
                  value={selected.props.boxShadow || "none"}
                  onChange={(e) =>
                    handlePropChange("boxShadow", e.target.value)
                  }
                  className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                >
                  <option value="none">None</option>
                  <option value="0 1px 2px 0 rgb(0 0 0 / 0.05)">Small</option>
                  <option value="0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)">
                    Medium
                  </option>
                  <option value="0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)">
                    Large
                  </option>
                  <option value="0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)">
                    Extra Large
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Border Width (px)</Label>
                <VisualSlider
                  value={selected.props.borderWidth || 0}
                  onChange={(val) => handlePropChange("borderWidth", val)}
                  min={0}
                  max={24}
                />
              </div>
              <div className="space-y-2">
                <Label>Border Color</Label>
                <ColorPickerWithPresets
                  value={selected.props.borderColor || "transparent"}
                  onChange={(color) => handlePropChange("borderColor", color)}
                  label="Chọn màu viền"
                />
              </div>
            </>
          )}

          {/* Border Radius for Image */}
          {selected.name === "Image" && (
            <div className="space-y-2">
              <Label>Border Radius (px)</Label>
              <VisualSlider
                value={selected.props.borderRadius || 8}
                onChange={(val) => handlePropChange("borderRadius", val)}
                min={0}
                max={200}
              />
            </div>
          )}

          {/* Divider Styles */}
          {selected.name === "Divider" && (
            <>
              <div className="space-y-2">
                <Label>Color</Label>
                <ColorPickerWithPresets
                  value={selected.props.color || "#e5e7eb"}
                  onChange={(color) => handlePropChange("color", color)}
                  label="Chọn màu kẻ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thickness">Thickness (px)</Label>
                <Input
                  id="thickness"
                  type="number"
                  value={selected.props.thickness || 1}
                  onChange={(e) =>
                    handlePropChange("thickness", parseInt(e.target.value))
                  }
                />
              </div>
            </>
          )}

          {/* Gallery Columns */}
          {selected.name === "Gallery" && (
            <div className="space-y-2">
              <Label htmlFor="columns">Columns</Label>
              <select
                id="columns"
                value={selected.props.columns || 2}
                onChange={(e) =>
                  handlePropChange("columns", parseInt(e.target.value))
                }
                className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
              >
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
              </select>
            </div>
          )}

          {/* Rich Text Styles */}
          {selected.name === "Rich Text" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="richTextFontSize">Font Size (px)</Label>
                <Input
                  id="richTextFontSize"
                  type="number"
                  value={selected.props.fontSize || 16}
                  onChange={(e) =>
                    handlePropChange("fontSize", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <ColorPickerWithPresets
                  value={selected.props.color || "#000000"}
                  onChange={(color) => handlePropChange("color", color)}
                  label="Chọn màu chữ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="richTextAlign">Alignment</Label>
                <select
                  id="richTextAlign"
                  value={selected.props.textAlign || "left"}
                  onChange={(e) =>
                    handlePropChange("textAlign", e.target.value)
                  }
                  className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fontWeight">Font Weight</Label>
                <select
                  id="fontWeight"
                  value={selected.props.fontWeight || 400}
                  onChange={(e) =>
                    handlePropChange("fontWeight", parseInt(e.target.value))
                  }
                  className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                >
                  <option value={300}>Light (300)</option>
                  <option value={400}>Regular (400)</option>
                  <option value={500}>Medium (500)</option>
                  <option value={600}>Semibold (600)</option>
                  <option value={700}>Bold (700)</option>
                </select>
              </div>
            </>
          )}

          {/* Icon Styles */}
          {selected.name === "Icon" && (
            <>
              <div className="space-y-2">
                <Label>Size (px)</Label>
                <VisualSlider
                  value={selected.props.size || 24}
                  onChange={(val) => handlePropChange("size", val)}
                  min={12}
                  max={200}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <ColorPickerWithPresets
                  value={selected.props.color || "#000000"}
                  onChange={(color) => handlePropChange("color", color)}
                  label="Chọn màu biểu tượng"
                />
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <ColorPickerWithPresets
                  value={selected.props.backgroundColor || "#ffffff"}
                  onChange={(color) =>
                    handlePropChange("backgroundColor", color)
                  }
                  label="Chọn màu nền"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iconBorderRadius">Border Radius (px)</Label>
                <Input
                  id="iconBorderRadius"
                  type="number"
                  value={selected.props.borderRadius || 0}
                  onChange={(e) =>
                    handlePropChange("borderRadius", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iconPadding">Padding (px)</Label>
                <Input
                  id="iconPadding"
                  type="number"
                  value={selected.props.padding || 8}
                  onChange={(e) =>
                    handlePropChange("padding", parseInt(e.target.value))
                  }
                />
              </div>
            </>
          )}

          {/* Embed Dimensions */}
          {selected.name === "Embed" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="embedWidth">Width</Label>
                <Input
                  id="embedWidth"
                  value={selected.props.width || "100%"}
                  onChange={(e) => handlePropChange("width", e.target.value)}
                  placeholder="100% or 500px"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="embedHeight">Height</Label>
                <Input
                  id="embedHeight"
                  value={selected.props.height || "400px"}
                  onChange={(e) => handlePropChange("height", e.target.value)}
                  placeholder="400px"
                />
              </div>
            </>
          )}

          {/* Form Container Styles */}
          {selected.name === "Form" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="padding">Padding (px)</Label>
                <Input
                  id="padding"
                  type="number"
                  value={selected.props.padding || 16}
                  onChange={(e) =>
                    handlePropChange("padding", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gap">Gap (px)</Label>
                <Input
                  id="gap"
                  type="number"
                  value={selected.props.gap || 16}
                  onChange={(e) =>
                    handlePropChange("gap", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={selected.props.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      handlePropChange("backgroundColor", e.target.value)
                    }
                    className="w-12 h-9 p-1"
                  />
                  <Input
                    value={selected.props.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      handlePropChange("backgroundColor", e.target.value)
                    }
                    className="flex-1"
                    placeholder="transparent"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="borderColor">Border Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="borderColor"
                    type="color"
                    value={selected.props.borderColor || "#000000"}
                    onChange={(e) =>
                      handlePropChange("borderColor", e.target.value)
                    }
                    className="w-12 h-9 p-1"
                  />
                  <Input
                    value={selected.props.borderColor || "#000000"}
                    onChange={(e) =>
                      handlePropChange("borderColor", e.target.value)
                    }
                    className="flex-1"
                    placeholder="transparent"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="borderWidth">Border Width (px)</Label>
                <Input
                  id="borderWidth"
                  type="number"
                  value={selected.props.borderWidth || 0}
                  onChange={(e) =>
                    handlePropChange("borderWidth", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="borderRadius">Border Radius (px)</Label>
                <Input
                  id="borderRadius"
                  type="number"
                  value={selected.props.borderRadius || 0}
                  onChange={(e) =>
                    handlePropChange("borderRadius", parseInt(e.target.value))
                  }
                />
              </div>
            </>
          )}

          {/* Grid, Columns Styles */}
          {["Grid", "Columns"].includes(selected.name) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="layoutPadding">Padding (px)</Label>
                <Input
                  id="layoutPadding"
                  type="number"
                  value={selected.props.padding || 16}
                  onChange={(e) =>
                    handlePropChange("padding", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="layoutGap">Gap (px)</Label>
                <Input
                  id="layoutGap"
                  type="number"
                  value={selected.props.gap || 16}
                  onChange={(e) =>
                    handlePropChange("gap", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="layoutBg">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="layoutBg"
                    type="color"
                    value={selected.props.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      handlePropChange("backgroundColor", e.target.value)
                    }
                    className="w-12 h-9 p-1"
                  />
                  <Input
                    value={selected.props.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      handlePropChange("backgroundColor", e.target.value)
                    }
                    className="flex-1"
                    placeholder="transparent"
                  />
                </div>
              </div>
            </>
          )}

          {/* Note: Inputs rely on shadcn defaults for now, but wrapper padding/margin could be added here */}
          {["Input", "Textarea", "Select", "Checkbox"].includes(
            selected.name,
          ) && (
            <div className="p-3 bg-muted/50 rounded-md text-sm text-muted-foreground">
              <p>
                Style customization for individual inputs is limited. Use the
                Form container to control layout.
              </p>
            </div>
          )}

          {/* Responsive Settings */}
          {["Container", "Grid", "Columns"].includes(selected.name) && (
            <>
              <Separator className="my-4" />
              <h4 className="font-medium text-sm mb-3">Mobile Overrides</h4>
              <div className="space-y-2">
                <Label htmlFor="mobilePadding">Mobile Padding (px)</Label>
                <Input
                  id="mobilePadding"
                  type="number"
                  value={
                    selected.props.mobilePadding || selected.props.padding || 0
                  }
                  onChange={(e) =>
                    handlePropChange("mobilePadding", parseInt(e.target.value))
                  }
                  placeholder="Inherit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileGap">Mobile Gap (px)</Label>
                <Input
                  id="mobileGap"
                  type="number"
                  value={selected.props.mobileGap || selected.props.gap || 0}
                  onChange={(e) =>
                    handlePropChange("mobileGap", parseInt(e.target.value))
                  }
                  placeholder="Inherit"
                />
              </div>
            </>
          )}

          {/* Animation Settings */}
          {[
            "Container",
            "Grid",
            "Columns",
            "Text",
            "Heading",
            "Image",
            "Card",
          ].includes(selected.name) && (
            <>
              <Separator className="my-4" />
              <h4 className="font-medium text-sm mb-3">Animation</h4>
              <div className="space-y-2">
                <Label htmlFor="animation">Entrance Animation</Label>
                <select
                  id="animation"
                  value={selected.props.animation || ""}
                  onChange={(e) =>
                    handlePropChange("animation", e.target.value)
                  }
                  className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                >
                  <option value="">None</option>
                  <option value="animate-fade-in">Fade In</option>
                  <option value="animate-slide-up">Slide Up</option>
                  <option value="animate-slide-right">Slide Right</option>
                  <option value="animate-zoom-in">Zoom In</option>
                  <option value="animate-bounce-in">Bounce In</option>
                </select>
              </div>
            </>
          )}

    </>
  );
};
