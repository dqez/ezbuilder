"use client";

export function AiStreamingIndicator() {
  return (
    <div className="flex items-center gap-2 text-gray-500 text-sm">
      <div className="flex gap-1">
        <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
          ●
        </span>
        <span className="animate-bounce" style={{ animationDelay: "150ms" }}>
          ●
        </span>
        <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
          ●
        </span>
      </div>
      <span>AI đang suy nghĩ...</span>
    </div>
  );
}
