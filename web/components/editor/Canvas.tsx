"use client";

import React from "react";

interface CanvasProps {
  children: React.ReactNode;
}

export const Canvas = ({ children }: CanvasProps) => {
  return (
    <div className="min-h-full flex items-start justify-center">
      <div
        className="bg-white shadow-lg rounded-lg overflow-hidden"
        style={{
          width: "100%",
          maxWidth: "1200px",
          minHeight: "800px",
        }}
      >
        {children}
      </div>
    </div>
  );
};
