"use client";

import { Builder } from "@/components/editor";

export default function EditorPage() {
  // In a real app, we would fetch the website data here based on websiteId
  // For now, render the Builder with no initial data

  const handleSave = (json: string) => {
    console.log("Auto-saving:", json.substring(0, 100) + "...");
    // TODO: Save to API
  };

  return (
    <div className="h-screen overflow-hidden">
      <Builder onSave={handleSave} />
    </div>
  );
}
