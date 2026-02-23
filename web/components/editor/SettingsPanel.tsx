"use client";

import { useEditor } from "@craftjs/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";

export const SettingsPanel = () => {
  const { selected, actions } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.displayName,
        props: state.nodes[currentNodeId].data.props,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }

    return { selected };
  });

  const handleDelete = () => {
    if (selected?.id) {
      actions.delete(selected.id);
    }
  };

  const handlePropChange = (key: string, value: unknown) => {
    if (selected?.id) {
      actions.setProp(selected.id, (props) => {
        props[key] = value;
      });
    }
  };

  if (!selected) {
    return (
      <div className="p-4 space-y-6">
        <div>
          <h3 className="font-medium mb-1">Global Settings</h3>
          <p className="text-sm text-muted-foreground">
            Customize your site&apos;s theme and styles.
          </p>
        </div>
        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme Color (Primary)</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                className="w-12 h-10 p-1 cursor-pointer"
                onChange={(e) => {
                  // This is a naive implementation for OKLCH or HSL.
                  // CSS variables in globals.css might be complex.
                  // For now, let's try setting --primary directly to hex?
                  // Tailwind v4 uses --color-primary: <color>.
                  // But globals.css uses oklch.
                  // If I set --primary: #hex, it overrides oklch if defined via @theme?
                  // No, @theme maps --color-primary to var(--primary).
                  // So setting --primary on :root works.
                  document.documentElement.style.setProperty(
                    "--primary",
                    e.target.value,
                  );
                  document.documentElement.style.setProperty(
                    "--ring",
                    e.target.value,
                  );
                }}
              />
              <span className="text-xs text-muted-foreground self-center">
                Click color picker
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Radius (rem)</Label>
            <Input
              type="number"
              step="0.1"
              defaultValue={0.5}
              onChange={(e) => {
                document.documentElement.style.setProperty(
                  "--radius",
                  `${e.target.value}rem`,
                );
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Base Font Size</Label>
            <select
              className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
              onChange={(e) => {
                document.documentElement.style.fontSize = e.target.value;
              }}
            >
              <option value="16px">16px (Default)</option>
              <option value="14px">14px (Compact)</option>
              <option value="18px">18px (Large)</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Component Name */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{selected.name}</h3>
        {selected.isDeletable && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
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
              <Label htmlFor="richText">Text (HTML)</Label>
              <textarea
                id="richText"
                value={selected.props.text || ""}
                onChange={(e) => handlePropChange("text", e.target.value)}
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-transparent text-sm"
                placeholder="Enter HTML content"
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
              <Label htmlFor="iconName">Icon Name</Label>
              <Input
                id="iconName"
                value={selected.props.iconName || "Star"}
                onChange={(e) => handlePropChange("iconName", e.target.value)}
                placeholder="Star, Heart, Zap, etc."
              />
              <p className="text-xs text-muted-foreground">
                Browse icons at{" "}
                <a
                  href="https://lucide.dev"
                  target="_blank"
                  rel="noopener"
                  className="underline"
                >
                  lucide.dev
                </a>
              </p>
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
        </TabsContent>

        <TabsContent value="style" className="space-y-4 mt-4">
          {/* Font Size */}
          {selected.name === "Text" && (
            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size (px)</Label>
              <Input
                id="fontSize"
                type="number"
                value={selected.props.fontSize || 16}
                onChange={(e) =>
                  handlePropChange("fontSize", parseInt(e.target.value))
                }
              />
            </div>
          )}

          {/* Color */}
          {(selected.name === "Text" || selected.name === "Heading") && (
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={selected.props.color || "#000000"}
                  onChange={(e) => handlePropChange("color", e.target.value)}
                  className="w-12 h-9 p-1"
                />
                <Input
                  value={selected.props.color || "#000000"}
                  onChange={(e) => handlePropChange("color", e.target.value)}
                  className="flex-1"
                />
              </div>
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
                <Label htmlFor="gap">Gap (px)</Label>
                <Input
                  id="gap"
                  type="number"
                  value={selected.props.gap || 8}
                  onChange={(e) =>
                    handlePropChange("gap", parseInt(e.target.value))
                  }
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
                <Label htmlFor="borderRadius">Corner Radius (px)</Label>
                <Input
                  id="borderRadius"
                  type="number"
                  value={selected.props.borderRadius || 0}
                  onChange={(e) =>
                    handlePropChange("borderRadius", parseInt(e.target.value))
                  }
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
                <Label htmlFor="borderColor">Border Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="borderColor"
                    type="color"
                    value={selected.props.borderColor || "transparent"}
                    onChange={(e) =>
                      handlePropChange("borderColor", e.target.value)
                    }
                    className="w-12 h-9 p-1"
                  />
                  <Input
                    value={selected.props.borderColor || "transparent"}
                    onChange={(e) =>
                      handlePropChange("borderColor", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </>
          )}

          {/* Border Radius for Image */}
          {selected.name === "Image" && (
            <div className="space-y-2">
              <Label htmlFor="borderRadius">Border Radius (px)</Label>
              <Input
                id="borderRadius"
                type="number"
                value={selected.props.borderRadius || 8}
                onChange={(e) =>
                  handlePropChange("borderRadius", parseInt(e.target.value))
                }
              />
            </div>
          )}

          {/* Divider Styles */}
          {selected.name === "Divider" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="dividerColor">Color</Label>
                <Input
                  id="dividerColor"
                  type="color"
                  value={selected.props.color || "#e5e7eb"}
                  onChange={(e) => handlePropChange("color", e.target.value)}
                  className="w-12 h-9 p-1"
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
                <Label htmlFor="richTextColor">Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="richTextColor"
                    type="color"
                    value={selected.props.color || "#000000"}
                    onChange={(e) => handlePropChange("color", e.target.value)}
                    className="w-12 h-9 p-1"
                  />
                  <Input
                    value={selected.props.color || "#000000"}
                    onChange={(e) => handlePropChange("color", e.target.value)}
                    className="flex-1"
                  />
                </div>
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
                <Label htmlFor="iconSize">Size (px)</Label>
                <Input
                  id="iconSize"
                  type="number"
                  value={selected.props.size || 24}
                  onChange={(e) =>
                    handlePropChange("size", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iconColor">Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="iconColor"
                    type="color"
                    value={selected.props.color || "#000000"}
                    onChange={(e) => handlePropChange("color", e.target.value)}
                    className="w-12 h-9 p-1"
                  />
                  <Input
                    value={selected.props.color || "#000000"}
                    onChange={(e) => handlePropChange("color", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="iconBgColor">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="iconBgColor"
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
