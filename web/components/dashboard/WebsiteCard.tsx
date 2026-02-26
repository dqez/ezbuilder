"use client";

import { memo } from "react";
import Link from "next/link";
import {
  MoreVertical,
  ExternalLink,
  Pencil,
  Trash2,
  Calendar,
  Globe,
  Layout,
} from "lucide-react";
import type { Website } from "@/lib/api/websites";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type WebsiteCardProps = {
  website: Website;
  onDelete?: (id: string) => void;
};

/** Generate a deterministic hue from a string for variety */
function hashHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

/** Simple SVG preview that represents the website with colors derived from its name */
const WebsitePreview = memo(function WebsitePreview({
  website,
}: {
  website: Website;
}) {
  const hue = hashHue(website.id || website.name);
  const primary = `hsl(${hue}, 60%, 40%)`;
  const accent = `hsl(${(hue + 40) % 360}, 50%, 90%)`;
  const light = `hsl(${hue}, 20%, 96%)`;

  return (
    <svg
      viewBox="0 0 200 120"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <rect width="200" height="120" fill={light} />
      {/* Navbar bar */}
      <rect width="200" height="18" fill={primary} />
      <rect
        x="8"
        y="5"
        width="36"
        height="8"
        rx="2"
        fill="white"
        opacity="0.9"
      />
      <rect
        x="120"
        y="6"
        width="20"
        height="6"
        rx="2"
        fill="white"
        opacity="0.5"
      />
      <rect
        x="148"
        y="6"
        width="20"
        height="6"
        rx="2"
        fill="white"
        opacity="0.5"
      />
      <rect
        x="176"
        y="6"
        width="16"
        height="6"
        rx="2"
        fill="white"
        opacity="0.5"
      />
      {/* Hero section */}
      <rect y="18" width="200" height="44" fill={primary} opacity="0.15" />
      <rect
        x="20"
        y="28"
        width="100"
        height="10"
        rx="3"
        fill={primary}
        opacity="0.7"
      />
      <rect
        x="20"
        y="44"
        width="70"
        height="6"
        rx="2"
        fill={primary}
        opacity="0.4"
      />
      {/* Content cards */}
      <rect x="8" y="72" width="56" height="32" rx="4" fill={accent} />
      <rect x="72" y="72" width="56" height="32" rx="4" fill={accent} />
      <rect x="136" y="72" width="56" height="32" rx="4" fill={accent} />
      {/* Inner lines in cards */}
      <rect
        x="14"
        y="80"
        width="30"
        height="4"
        rx="1"
        fill={primary}
        opacity="0.35"
      />
      <rect
        x="14"
        y="88"
        width="20"
        height="3"
        rx="1"
        fill={primary}
        opacity="0.2"
      />
      <rect
        x="78"
        y="80"
        width="30"
        height="4"
        rx="1"
        fill={primary}
        opacity="0.35"
      />
      <rect
        x="78"
        y="88"
        width="20"
        height="3"
        rx="1"
        fill={primary}
        opacity="0.2"
      />
      <rect
        x="142"
        y="80"
        width="30"
        height="4"
        rx="1"
        fill={primary}
        opacity="0.35"
      />
      <rect
        x="142"
        y="88"
        width="20"
        height="3"
        rx="1"
        fill={primary}
        opacity="0.2"
      />
      {/* Domain watermark */}
      <text
        x="100"
        y="113"
        textAnchor="middle"
        fontSize="5"
        fill={primary}
        opacity="0.4"
        fontFamily="monospace"
      >
        /public/{website.subdomain}/home
      </text>
    </svg>
  );
});

export const WebsiteCard = memo(function WebsiteCard({
  website,
  onDelete,
}: WebsiteCardProps) {
  const createdDate = new Date(website.createdAt).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-xl hover:border-primary/40 hover:-translate-y-0.5 relative border">
      {/* Preview Thumbnail */}
      <div className="h-40 w-full relative overflow-hidden bg-muted/20">
        <div className="absolute inset-0">
          <WebsitePreview website={website} />
        </div>

        {/* Hover overlay with quick actions */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            <Button size="sm" className="flex-1 h-8 text-xs" asChild>
              <Link href={`/sites/${website.id}`}>
                <Layout className="w-3 h-3 mr-1" />
                Chỉnh sửa
              </Link>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 px-2.5"
              asChild
            >
              <a
                href={`/public/${website.subdomain}/home`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          </div>
        </div>

        {/* 3-dot menu top right */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="h-7 w-7 shadow"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-xs">
                Hành động
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/sites/${website.id}`}>
                  <Pencil className="w-3.5 h-3.5 mr-2" />
                  Chỉnh sửa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={`/public/${website.subdomain}/home`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-2" />
                  Xem trực tiếp
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete?.(website.id)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Xóa website
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader className="p-4 pb-1.5">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight line-clamp-1">
            <Link
              href={`/sites/${website.id}`}
              className="hover:text-primary transition-colors"
            >
              {website.name}
            </Link>
          </CardTitle>
          <Badge
            variant={website.isActive ? "default" : "secondary"}
            className="shrink-0 text-[10px] px-1.5 py-0"
          >
            {website.isActive ? "Hoạt động" : "Nháp"}
          </Badge>
        </div>
        <a
          href={`/public/${website.subdomain}/home`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors mt-0.5"
        >
          <Globe className="w-3 h-3" />
          /public/{website.subdomain}/home
        </a>
      </CardHeader>

      <CardContent className="p-4 pt-1.5">
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
          {website.description || "Chưa có mô tả"}
        </p>
      </CardContent>

      <CardFooter className="p-3 pt-0 border-t bg-muted/10 text-xs text-muted-foreground flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {createdDate}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-[11px] px-2"
          asChild
        >
          <Link href={`/sites/${website.id}`}>Quản lý</Link>
        </Button>
      </CardFooter>
    </Card>
  );
});
