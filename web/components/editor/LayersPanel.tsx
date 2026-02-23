"use client";

import { useEditor } from "@craftjs/core";
import { ChevronRight, ChevronDown, Box } from "lucide-react";
import { useState } from "react";

// Helper to map component names to icons?
// For now generic Box.

const LayerItem = ({
  nodeId,
  depth = 0,
}: {
  nodeId: string;
  depth: number;
}) => {
  const { node, selected, hasChildren, actions } = useEditor((state) => {
    const node = state.nodes[nodeId];
    return {
      node,
      selected: state.events.selected.has(nodeId),
      expanded: false, // We need local state for expansion
      hasChildren: node?.data.nodes && node.data.nodes.length > 0,
    };
  });

  const [isExpanded, setIsExpanded] = useState(true);

  if (!node) return null;

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.selectNode(nodeId);
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Skip rendering internal/hidden nodes if needed?
  // Craft nodes are rarely hidden unless auxiliary.

  return (
    <div className="select-none">
      <div
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-muted/50 rounded-sm transition-colors ${
          selected ? "bg-accent text-accent-foreground" : ""
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleSelect}
      >
        <div
          className="w-4 h-4 mr-1 flex items-center justify-center cursor-pointer"
          onClick={hasChildren ? toggleExpand : undefined}
        >
          {hasChildren &&
            (isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            ))}
        </div>

        <Box className="w-3 h-3 mr-2 opacity-70" />
        <span className="text-xs truncate max-w-[120px]">
          {node.data.displayName || node.data.name || "Node"}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.data.nodes.map((childId) => (
            <LayerItem key={childId} nodeId={childId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const LayersPanel = () => {
  const { nodes } = useEditor((state) => ({
    nodes: state.nodes,
  }));

  // Find root node(s) - usually "ROOT"
  const rootNodeId = "ROOT"; // CraftJS default
  const rootNode = nodes[rootNodeId];

  if (!rootNode)
    return (
      <div className="p-4 text-xs text-muted-foreground">No layers found</div>
    );

  return (
    <div className="w-full">
      <LayerItem nodeId={rootNodeId} depth={0} />
    </div>
  );
};
