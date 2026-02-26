"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPicker } from "./IconPicker";
import { MiniWysiwyg } from "./MiniWysiwyg";

// Remove unneeded generic any, properly type the props
export interface SettingsTabProps {
  selected: any;
  handlePropChange: (key: string, value: any) => void;
}

export const SettingsContentTab = ({ selected, handlePropChange }: SettingsTabProps) => {
  return (
    <>
          {/* Text/Heading Content */}
          {(selected.name === "Text" || selected.name === "Heading") && (
            <div className="space-y-2">
              <Label htmlFor="text">Text</Label>
              <Input
                id="text"
                value={selected.props.text || ""}
                onChange={(e) => handlePropChange("text", e.target.value)}
              />
            </div>
          )}

          {/* Heading Level */}
          {selected.name === "Heading" && (
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <select
                id="level"
                value={selected.props.level || 1}
                onChange={(e) =>
                  handlePropChange("level", parseInt(e.target.value))
                }
                className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
              >
                <option value={1}>H1</option>
                <option value={2}>H2</option>
                <option value={3}>H3</option>
              </select>
            </div>
          )}

          {/* Image Source */}
          {selected.name === "Image" && (
            <div className="space-y-2">
              <Label htmlFor="src">Image URL</Label>
              <Input
                id="src"
                value={selected.props.src || ""}
                onChange={(e) => handlePropChange("src", e.target.value)}
                placeholder="https://..."
              />
            </div>
          )}

          {/* Button Text */}
          {selected.name === "Button" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={selected.props.text || ""}
                  onChange={(e) => handlePropChange("text", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant">Variant</Label>
                <select
                  id="variant"
                  value={selected.props.variant || "default"}
                  onChange={(e) => handlePropChange("variant", e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                >
                  <option value="default">Default</option>
                  <option value="secondary">Secondary</option>
                  <option value="outline">Outline</option>
                  <option value="ghost">Ghost</option>
                  <option value="link">Link</option>
                  <option value="destructive">Destructive</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <select
                  id="size"
                  value={selected.props.size || "default"}
                  onChange={(e) => handlePropChange("size", e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                >
                  <option value="default">Default</option>
                  <option value="sm">Small</option>
                  <option value="lg">Large</option>
                  <option value="icon">Icon</option>
                </select>
              </div>
            </>
          )}

          {/* Hero Content */}
          {selected.name === "Hero" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={selected.props.title || ""}
                  onChange={(e) => handlePropChange("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={selected.props.subtitle || ""}
                  onChange={(e) => handlePropChange("subtitle", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaText">CTA Text</Label>
                <Input
                  id="ctaText"
                  value={selected.props.ctaText || ""}
                  onChange={(e) => handlePropChange("ctaText", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaUrl">CTA URL</Label>
                <Input
                  id="ctaUrl"
                  value={selected.props.ctaUrl || "#"}
                  onChange={(e) => handlePropChange("ctaUrl", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="layout">Layout</Label>
                <select
                  id="layout"
                  value={selected.props.layout || "center"}
                  onChange={(e) => handlePropChange("layout", e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                >
                  <option value="center">Center (Background)</option>
                  <option value="split-left">Split Left (Image Left)</option>
                  <option value="split-right">
                    Split Right (Content Left)
                  </option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="backgroundImage">Background Image URL</Label>
                <Input
                  id="backgroundImage"
                  value={selected.props.backgroundImage || ""}
                  onChange={(e) =>
                    handlePropChange("backgroundImage", e.target.value)
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Side Image URL (Split)</Label>
                <Input
                  id="imageUrl"
                  value={selected.props.imageUrl || ""}
                  onChange={(e) => handlePropChange("imageUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="overlayOpacity">Overlay Opacity (0-1)</Label>
                <Input
                  id="overlayOpacity"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={selected.props.overlayOpacity || 0.5}
                  onChange={(e) =>
                    handlePropChange(
                      "overlayOpacity",
                      parseFloat(e.target.value),
                    )
                  }
                />
              </div>
            </>
          )}

          {/* Card Content */}
          {selected.name === "Card" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cardTitle">Title</Label>
                <Input
                  id="cardTitle"
                  value={selected.props.title || ""}
                  onChange={(e) => handlePropChange("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={selected.props.description || ""}
                  onChange={(e) =>
                    handlePropChange("description", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardImageUrl">Image URL</Label>
                <Input
                  id="cardImageUrl"
                  value={selected.props.imageUrl || ""}
                  onChange={(e) => handlePropChange("imageUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardVariant">Variant</Label>
                <select
                  id="cardVariant"
                  value={selected.props.variant || "vertical"}
                  onChange={(e) => handlePropChange("variant", e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                >
                  <option value="vertical">Vertical</option>
                  <option value="horizontal">Horizontal</option>
                  <option value="overlay">Overlay</option>
                </select>
              </div>
            </>
          )}

          {/* Navbar Logo */}
          {selected.name === "Navbar" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo Text</Label>
                <Input
                  id="logo"
                  value={selected.props.logo || ""}
                  onChange={(e) => handlePropChange("logo", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="navbarVariant">Variant</Label>
                <select
                  id="navbarVariant"
                  value={selected.props.variant || "default"}
                  onChange={(e) => handlePropChange("variant", e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                >
                  <option value="default">Default (Logo Left)</option>
                  <option value="centered">Centered (Logo Center)</option>
                  <option value="minimal">Minimal (Logo + Button)</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="navbarSticky"
                  checked={selected.props.sticky || false}
                  onChange={(e) => handlePropChange("sticky", e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <Label htmlFor="navbarSticky" className="cursor-pointer">
                  Sticky Top
                </Label>
              </div>
            </>
          )}

          {/* Footer Copyright */}
          {selected.name === "Footer" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="copyright">Copyright Text</Label>
                <Input
                  id="copyright"
                  value={selected.props.copyright || ""}
                  onChange={(e) =>
                    handlePropChange("copyright", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerVariant">Variant</Label>
                <select
                  id="footerVariant"
                  value={selected.props.variant || "simple"}
                  onChange={(e) => handlePropChange("variant", e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                >
                  <option value="simple">Simple (Row)</option>
                  <option value="centered">Centered (Column)</option>
                  <option value="minimal">Minimal (Copyright Only)</option>
                </select>
              </div>
            </>
          )}

          {/* Spacer Height */}
          {selected.name === "Spacer" && (
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={selected.props.height || 32}
                onChange={(e) =>
                  handlePropChange("height", parseInt(e.target.value))
                }
              />
            </div>
          )}

          {/* Rich Text Content */}
          {selected.name === "Rich Text" && (
            <div className="space-y-2">
              <Label>Text (HTML)</Label>
              <MiniWysiwyg
                value={selected.props.text || ""}
                onChange={(val) => handlePropChange("text", val)}
                placeholder="Enter Rich Text content..."
              />
            </div>
          )}

          {/* Video URL */}
          {selected.name === "Video" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={selected.props.url || ""}
                  onChange={(e) => handlePropChange("url", e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoplay"
                    checked={selected.props.autoplay || false}
                    onChange={(e) =>
                      handlePropChange("autoplay", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <Label htmlFor="autoplay" className="cursor-pointer">
                    Autoplay
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="muted"
                    checked={selected.props.muted || false}
                    onChange={(e) =>
                      handlePropChange("muted", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <Label htmlFor="muted" className="cursor-pointer">
                    Muted
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <select
                  id="aspectRatio"
                  value={selected.props.aspectRatio || "16:9"}
                  onChange={(e) =>
                    handlePropChange("aspectRatio", e.target.value)
                  }
                  className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                >
                  <option value="16:9">16:9 (Widescreen)</option>
                  <option value="4:3">4:3 (Standard)</option>
                  <option value="1:1">1:1 (Square)</option>
                </select>
              </div>
            </>
          )}

          {/* Icon Name */}
          {selected.name === "Icon" && (
            <div className="space-y-2">
              <Label>Icon Name</Label>
              <IconPicker
                value={selected.props.iconName || "Star"}
                onChange={(val) => handlePropChange("iconName", val)}
                label="Chọn biểu tượng"
              />
            </div>
          )}

          {/* Embed Code */}
          {selected.name === "Embed" && (
            <div className="space-y-2">
              <Label htmlFor="embedCode">Embed Code (HTML)</Label>
              <textarea
                id="embedCode"
                value={selected.props.embedCode || ""}
                onChange={(e) => handlePropChange("embedCode", e.target.value)}
                className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-transparent text-sm font-mono"
                placeholder='<iframe src="..." ...></iframe>'
              />
            </div>
          )}

          {/* Form Container Settings */}
          {selected.name === "Form" && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-md text-sm text-muted-foreground">
                <p>Drag other form inputs into this container.</p>
              </div>
            </div>
          )}

          {/* Common Input Settings (Input, Textarea, Select) */}
          {["Input", "Textarea", "Select", "Checkbox"].includes(
            selected.name,
          ) && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inputLabel">Label</Label>
                <Input
                  id="inputLabel"
                  value={selected.props.label || ""}
                  onChange={(e) => handlePropChange("label", e.target.value)}
                />
              </div>

              {selected.name !== "Checkbox" && (
                <div className="space-y-2">
                  <Label htmlFor="inputPlaceholder">Placeholder</Label>
                  <Input
                    id="inputPlaceholder"
                    value={selected.props.placeholder || ""}
                    onChange={(e) =>
                      handlePropChange("placeholder", e.target.value)
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="inputName">Field Name (for submission)</Label>
                <Input
                  id="inputName"
                  value={selected.props.name || ""}
                  onChange={(e) => handlePropChange("name", e.target.value)}
                  placeholder="email, message, etc."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="inputRequired"
                  checked={selected.props.required || false}
                  onChange={(e) =>
                    handlePropChange("required", e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="inputRequired" className="cursor-pointer">
                  Required field
                </Label>
              </div>
            </div>
          )}

          {/* Specific Input Settings */}
          {selected.name === "Input" && (
            <div className="space-y-2">
              <Label htmlFor="inputType">Input Type</Label>
              <select
                id="inputType"
                value={selected.props.inputType || "text"}
                onChange={(e) => handlePropChange("inputType", e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
                <option value="number">Number</option>
                <option value="tel">Phone</option>
                <option value="url">URL</option>
              </select>
            </div>
          )}

          {/* Textarea Settings */}
          {selected.name === "Textarea" && (
            <div className="space-y-2">
              <Label htmlFor="textareaRows">Rows</Label>
              <Input
                id="textareaRows"
                type="number"
                value={selected.props.rows || 4}
                onChange={(e) =>
                  handlePropChange("rows", parseInt(e.target.value))
                }
              />
            </div>
          )}

          {/* Select Settings */}
          {selected.name === "Select" && (
            <div className="space-y-2">
              <Label htmlFor="selectOptions">Options (comma separated)</Label>
              <textarea
                id="selectOptions"
                value={selected.props.options || ""}
                onChange={(e) => handlePropChange("options", e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-transparent text-sm"
                placeholder="Option 1, Option 2, Option 3"
              />
            </div>
          )}

          {/* Checkbox Settings */}
          {selected.name === "Checkbox" && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="defaultChecked"
                checked={selected.props.defaultChecked || false}
                onChange={(e) =>
                  handlePropChange("defaultChecked", e.target.checked)
                }
                className="w-4 h-4"
              />
              <Label htmlFor="defaultChecked" className="cursor-pointer">
                Checked by default
              </Label>
            </div>
          )}

          {/* Grid Settings */}
          {selected.name === "Grid" && (
            <div className="space-y-2">
              <Label htmlFor="columns">Columns</Label>
              <Input
                id="columns"
                type="number"
                min={1}
                max={12}
                value={selected.props.columns || 3}
                onChange={(e) =>
                  handlePropChange("columns", parseInt(e.target.value))
                }
              />
            </div>
          )}

          {/* Columns Settings */}
          {selected.name === "Columns" && (
            <div className="space-y-2">
              <Label htmlFor="numColumns">Number of Columns</Label>
              <Input
                id="numColumns"
                type="number"
                min={1}
                max={12}
                value={selected.props.columns || 2}
                onChange={(e) =>
                  handlePropChange("columns", parseInt(e.target.value))
                }
              />
            </div>
          )}

          {/* Accordion Settings */}
          {selected.name === "Accordion" && (
            <div className="space-y-2">
              <Label htmlFor="accordionItems">
                Section Titles (comma separated)
              </Label>
              <textarea
                id="accordionItems"
                value={
                  Array.isArray(selected.props.items)
                    ? selected.props.items.join(", ")
                    : selected.props.items
                }
                onChange={(e) =>
                  handlePropChange(
                    "items",
                    e.target.value.split(",").map((i) => i.trim()),
                  )
                }
                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-transparent text-sm"
                placeholder="Section 1, Section 2"
              />
            </div>
          )}

          {/* Tabs Settings */}
          {selected.name === "Tabs" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="tabsList">Tab Names (comma separated)</Label>
                <textarea
                  id="tabsList"
                  value={
                    Array.isArray(selected.props.tabs)
                      ? selected.props.tabs.join(", ")
                      : selected.props.tabs
                  }
                  onChange={(e) =>
                    handlePropChange(
                      "tabs",
                      e.target.value.split(",").map((i) => i.trim()),
                    )
                  }
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-transparent text-sm"
                  placeholder="Tab 1, Tab 2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultValue">Default Active Tab</Label>
                <select
                  id="defaultValue"
                  value={selected.props.defaultValue || "tab-0"}
                  onChange={(e) =>
                    handlePropChange("defaultValue", e.target.value)
                  }
                  className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
                >
                  {Array.isArray(selected.props.tabs) &&
                    selected.props.tabs.map((_: string, i: number) => (
                      <option key={i} value={`tab-${i}`}>
                        Tab {i + 1}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}

          {/* Testimonial Settings */}
          {selected.name === "Testimonial" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="author">Author Name</Label>
                <Input
                  id="author"
                  value={selected.props.author || ""}
                  onChange={(e) => handlePropChange("author", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={selected.props.role || ""}
                  onChange={(e) => handlePropChange("role", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quote">Quote</Label>
                <textarea
                  id="quote"
                  value={selected.props.quote || ""}
                  onChange={(e) => handlePropChange("quote", e.target.value)}
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-transparent text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  value={selected.props.avatarUrl || ""}
                  onChange={(e) =>
                    handlePropChange("avatarUrl", e.target.value)
                  }
                />
              </div>
            </>
          )}

          {/* Pricing Settings */}
          {selected.name === "Pricing" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={selected.props.title || ""}
                  onChange={(e) => handlePropChange("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={selected.props.price || ""}
                  onChange={(e) => handlePropChange("price", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (comma separated)</Label>
                <textarea
                  id="benefits"
                  value={selected.props.benefits || ""}
                  onChange={(e) => handlePropChange("benefits", e.target.value)}
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-transparent text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={selected.props.buttonText || ""}
                  onChange={(e) =>
                    handlePropChange("buttonText", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={selected.props.isPopular || false}
                  onChange={(e) =>
                    handlePropChange("isPopular", e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="isPopular" className="cursor-pointer">
                  Most Popular Badge
                </Label>
              </div>
            </>
          )}

          {/* CTA Settings */}
          {selected.name === "CTA" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={selected.props.title || ""}
                  onChange={(e) => handlePropChange("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <textarea
                  id="subtitle"
                  value={selected.props.subtitle || ""}
                  onChange={(e) => handlePropChange("subtitle", e.target.value)}
                  className="w-full min-h-[60px] px-3 py-2 rounded-md border border-input bg-transparent text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={selected.props.buttonText || ""}
                  onChange={(e) =>
                    handlePropChange("buttonText", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonLink">Button Link</Label>
                <Input
                  id="buttonLink"
                  value={selected.props.buttonLink || "#"}
                  onChange={(e) =>
                    handlePropChange("buttonLink", e.target.value)
                  }
                />
              </div>
            </>
          )}

          {/* Stats, Features Settings */}
          {(selected.name === "Stats" || selected.name === "Features") && (
            <div className="space-y-2">
              <Label htmlFor="listContent">
                {selected.name === "Stats"
                  ? "Stats (Value: Label)"
                  : "Features (Title: Desc)"}
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                {selected.name === "Stats"
                  ? "Separate items with comma (e.g. 1k: Users, 50: Files)"
                  : "Separate items with pipe | (e.g. Title: Desc | Title: Desc)"}
              </p>
              <textarea
                id="listContent"
                value={
                  selected.name === "Stats"
                    ? selected.props.stats || ""
                    : selected.props.features || ""
                }
                onChange={(e) =>
                  handlePropChange(
                    selected.name === "Stats" ? "stats" : "features",
                    e.target.value,
                  )
                }
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-transparent text-sm font-mono"
              />
            </div>
          )}

          {/* Social Icons Settings */}
          {selected.name === "Social Icons" && (
            <>
              {[
                "twitter",
                "facebook",
                "github",
                "instagram",
                "linkedin",
                "youtube",
              ].map((platform) => (
                <div key={platform} className="space-y-2">
                  <Label htmlFor={platform} className="capitalize">
                    {platform} URL
                  </Label>
                  <Input
                    id={platform}
                    value={selected.props[platform] || ""}
                    onChange={(e) => handlePropChange(platform, e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              ))}
            </>
          )}

    </>
  );
};
