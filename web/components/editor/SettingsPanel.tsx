"use client";

import { useEditor } from "@craftjs/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { SettingsContentTab } from "./SettingsContentTab";
import { SettingsStyleTab } from "./SettingsStyleTab";

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
      const confirmed = window.confirm("Bạn có chắc muốn xóa thành phần này?");
      if (confirmed) {
        actions.delete(selected.id);
      }
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
          <h3 className="font-medium mb-1">Cài đặt chung</h3>
          <p className="text-sm text-muted-foreground">
            Tùy chỉnh giao diện và kiểu dáng trang web.
          </p>
        </div>
        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Màu chủ đạo</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                className="w-12 h-10 p-1 cursor-pointer"
                onChange={(e) => {
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
                Bấm chọn màu
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Bo góc (rem)</Label>
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
            <Label>Cỡ chữ cơ bản</Label>
            <select
              className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm"
              onChange={(e) => {
                document.documentElement.style.fontSize = e.target.value;
              }}
            >
              <option value="16px">16px (Mặc định)</option>
              <option value="14px">14px (Nhỏ gọn)</option>
              <option value="18px">18px (Lớn)</option>
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
          <TabsTrigger value="content">Nội dung</TabsTrigger>
          <TabsTrigger value="style">Kiểu dáng</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          <SettingsContentTab selected={selected} handlePropChange={handlePropChange} />
        </TabsContent>

        <TabsContent value="style" className="space-y-4 mt-4">
          <SettingsStyleTab selected={selected} handlePropChange={handlePropChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
