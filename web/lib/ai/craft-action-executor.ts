/**
 * useCraftActionExecutor
 * Hook to execute ezActions on Craft.js canvas
 */

import { useEditor } from "@craftjs/core";
import { useState } from "react";
import React from "react";
import { resolver } from "@/components/editor/components";
import type { EzAction } from "./response-parser";

export function useCraftActionExecutor() {
  const { actions, query } = useEditor();
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Execute a single ezAction
   */
  const executeAction = (action: EzAction): boolean => {
    try {
      setError(null);

      switch (action.type) {
        case "add": {
          const { component, props } = action.data;
          console.log("🔧 ADD Action - component:", component, "props:", props);

          if (!component) {
            throw new Error("Component name is required for add action");
          }

          // Get component from resolver with type assertion
          console.log("🔍 Looking up component in resolver:", component);
          console.log("📚 Available resolver keys:", Object.keys(resolver));

          const ComponentClass = (
            resolver as Record<string, React.ComponentType<any>>
          )[component];
          console.log("🎨 ComponentClass found:", ComponentClass);

          if (!ComponentClass) {
            throw new Error(`Unknown component: ${component}`);
          }

          // Create React element and parse to Craft.js Node
          const element = React.createElement(ComponentClass, props || {});
          const parentId = action.nodeId;
          console.log("➕ Creating node tree for parent:", parentId);

          const nodeTree = query.parseReactElement(element).toNodeTree();
          actions.addNodeTree(nodeTree, parentId);

          console.log(`✨ Added ${component} to ${parentId}`);
          return true;
        }

        case "update": {
          const { props } = action.data;
          if (!props) {
            throw new Error("Props are required for update action");
          }

          const nodeId = action.nodeId;

          // Check if node exists
          const node = query.node(nodeId).get();
          if (!node) {
            throw new Error(`Node ${nodeId} not found`);
          }

          // Update props
          actions.setProp(nodeId, (currentProps) => {
            Object.assign(currentProps, props);
          });

          console.log(`🔄 Updated ${nodeId}`);
          return true;
        }

        case "delete": {
          const nodeId = action.nodeId;

          // Check if node exists
          const node = query.node(nodeId).get();
          if (!node) {
            throw new Error(`Node ${nodeId} not found`);
          }

          // Don't allow deleting ROOT
          if (nodeId === "ROOT") {
            throw new Error("Cannot delete ROOT node");
          }

          actions.delete(nodeId);
          console.log(`🗑️ Deleted ${nodeId}`);
          return true;
        }

        case "move": {
          const { newParentId, index } = action.data;
          if (!newParentId) {
            throw new Error("newParentId is required for move action");
          }

          const nodeId = action.nodeId;

          // Check if node exists
          const node = query.node(nodeId).get();
          if (!node) {
            throw new Error(`Node ${nodeId} not found`);
          }

          // Check if new parent exists
          const parentNode = query.node(newParentId).get();
          if (!parentNode) {
            throw new Error(`Parent node ${newParentId} not found`);
          }

          actions.move(nodeId, newParentId, index ?? 0);
          console.log(`🔀 Moved ${nodeId} to ${newParentId}`);
          return true;
        }

        case "replace_all": {
          const { components } = action.data;
          if (!components || !Array.isArray(components)) {
            throw new Error("Components array is required for replace_all");
          }

          // Clear ROOT children
          const rootNode = query.node("ROOT").get();
          if (rootNode && rootNode.data.nodes) {
            rootNode.data.nodes.forEach((childId) => {
              actions.delete(childId);
            });
          }

          // Add new components using parseReactElement
          components.forEach((comp) => {
            const ComponentClass = (
              resolver as Record<string, React.ComponentType<any>>
            )[comp.component];
            if (ComponentClass) {
              const element = React.createElement(
                ComponentClass,
                comp.props || {},
              );
              const nodeTree = query.parseReactElement(element).toNodeTree();
              actions.addNodeTree(nodeTree, "ROOT");
            }
          });

          console.log(`🔁 Replaced all with ${components.length} components`);
          return true;
        }

        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Action execution failed:", errorMessage, action);
      setError(errorMessage);
      return false;
    }
  };

  /**
   * Execute multiple ezActions in sequence
   */
  const executeActions = async (actions: EzAction[]): Promise<void> => {
    setIsExecuting(true);
    setError(null);

    try {
      for (const action of actions) {
        const success = executeAction(action);
        if (!success) {
          break; // Stop on first error
        }
      }
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    executeAction,
    executeActions,
    isExecuting,
    error,
  };
}
