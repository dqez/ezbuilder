"use client";

import Markdown from "react-markdown";

interface AiChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  actions?: Array<{
    type: string;
    component?: string;
    nodeId?: string;
  }>;
}

export function AiChatMessage({ role, content, actions }: AiChatMessageProps) {
  // Strip ezAction tags from content
  const cleanContent = content.replace(
    /<ezAction\s+type="[^"]+"\s+nodeId="[^"]+">[\s\S]*?<\/ezAction>/g,
    "",
  );

  return (
    <div className={`mb-4 ${role === "user" ? "text-right" : "text-left"}`}>
      <div
        className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
          role === "user"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="prose prose-sm max-w-none">
          <Markdown>{cleanContent}</Markdown>
        </div>

        {/* Render applied actions */}
        {actions && actions.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-300 space-y-1">
            {actions.map((action, index) => (
              <div
                key={index}
                className="text-xs flex items-center gap-1 text-blue-600"
              >
                <span>✨</span>
                <span className="font-medium">{action.type}</span>
                {action.component && (
                  <span className="text-gray-600">{action.component}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
