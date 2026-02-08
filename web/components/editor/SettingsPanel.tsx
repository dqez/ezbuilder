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

  const handlePropChange = (key: string, value: any) => {
    if (selected?.id) {
      actions.setProp(selected.id, (props) => {
        props[key] = value;
      });
    }
  };

  if (!selected) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p className="text-sm">Click on a component to edit its properties</p>
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
            </>
          )}

          {/* Navbar Logo */}
          {selected.name === "Navbar" && (
            <div className="space-y-2">
              <Label htmlFor="logo">Logo Text</Label>
              <Input
                id="logo"
                value={selected.props.logo || ""}
                onChange={(e) => handlePropChange("logo", e.target.value)}
              />
            </div>
          )}

          {/* Footer Copyright */}
          {selected.name === "Footer" && (
            <div className="space-y-2">
              <Label htmlFor="copyright">Copyright Text</Label>
              <Input
                id="copyright"
                value={selected.props.copyright || ""}
                onChange={(e) => handlePropChange("copyright", e.target.value)}
              />
            </div>
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
                  />
                </div>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
