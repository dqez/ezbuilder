"use client";

import { useNode } from "@craftjs/core";
import { useState } from "react";

interface NodeVideoProps {
  url: string;
  autoplay: boolean;
  muted: boolean;
  aspectRatio: "16:9" | "4:3" | "1:1";
}

const getEmbedUrl = (url: string): string => {
  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/,
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return url;
};

export const NodeVideo = ({
  url = "",
  autoplay = false,
  muted = false,
  aspectRatio = "16:9",
}: NodeVideoProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const aspectRatioValues = {
    "16:9": "56.25%",
    "4:3": "75%",
    "1:1": "100%",
  };

  const embedUrl = url
    ? getEmbedUrl(url) + `?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}`
    : "";

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        padding: "8px",
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        borderRadius: "4px",
        cursor: "grab",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: aspectRatioValues[aspectRatio],
          backgroundColor: "#f3f4f6",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {url ? (
          <iframe
            src={embedUrl}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            Enter video URL in settings
          </div>
        )}
      </div>
    </div>
  );
};

NodeVideo.craft = {
  displayName: "Video",
  props: {
    url: "",
    autoplay: false,
    muted: false,
    aspectRatio: "16:9",
  },
  related: {},
};
