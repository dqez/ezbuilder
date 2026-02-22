"use client";

import { useEditor } from "@craftjs/core";
import { useEffect } from "react";

export const ShortcutsHandler = () => {
  const { actions, query } = useEditor();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (query.history.canUndo()) {
          actions.history.undo();
        }
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      const isRedo =
        ((e.ctrlKey || e.metaKey) && e.key === "y") ||
        ((e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          e.key === "z" &&
          e.key.toLowerCase() === "z"); // e.key is 'Z' if shift is held? Check browser behavior.

      // Actually e.key is case insensitive check if usually logic.
      // Easiest check:
      const meta = e.ctrlKey || e.metaKey;
      if (meta && e.key === "y") {
        // Ctrl+Y
        e.preventDefault();
        if (query.history.canRedo()) actions.history.redo();
        return;
      }
      if (meta && e.shiftKey && e.key.toLowerCase() === "z") {
        // Ctrl+Shift+Z
        e.preventDefault();
        if (query.history.canRedo()) actions.history.redo();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions, query]);

  return null;
};
