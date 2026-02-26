"use client";

import { useEditor } from "@craftjs/core";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { SettingsContentTab } from "./SettingsContentTab";
import { SettingsStyleTab } from "./SettingsStyleTab";
import { GlobalSettingsPanel } from "./GlobalSettingsPanel";

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
    return <GlobalSettingsPanel />;
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
          <SettingsContentTab
            selected={selected}
            handlePropChange={handlePropChange}
          />
        </TabsContent>

        <TabsContent value="style" className="space-y-4 mt-4">
          <SettingsStyleTab
            selected={selected}
            handlePropChange={handlePropChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
