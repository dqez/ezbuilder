"use client";

import { useNode } from "@craftjs/core";
import {
  Twitter,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NodeSocialIconsProps {
  twitter: string;
  facebook: string;
  github: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

export const NodeSocialIcons = ({
  twitter = "#",
  facebook = "",
  github = "",
  instagram = "",
  linkedin = "",
  youtube = "",
}: NodeSocialIconsProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const icons = [
    { key: "twitter", url: twitter, Icon: Twitter },
    { key: "facebook", url: facebook, Icon: Facebook },
    { key: "github", url: github, Icon: Github },
    { key: "instagram", url: instagram, Icon: Instagram },
    { key: "linkedin", url: linkedin, Icon: Linkedin },
    { key: "youtube", url: youtube, Icon: Youtube },
  ].filter((i) => i.url);

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className="flex gap-4 justify-center py-4"
      style={{
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        cursor: "grab",
      }}
    >
      {icons.map(({ key, url, Icon }) => (
        <Button key={key} variant="ghost" size="icon" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Icon className="w-5 h-5" />
            <span className="sr-only">{key}</span>
          </a>
        </Button>
      ))}
      {icons.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Add social links in settings
        </p>
      )}
    </div>
  );
};

NodeSocialIcons.craft = {
  displayName: "Social Icons",
  props: {
    twitter: "https://twitter.com/shadcn",
    facebook: "",
    github: "https://github.com/shadcn-ui/ui",
    instagram: "",
    linkedin: "",
    youtube: "",
  },
  related: {},
};
