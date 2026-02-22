"use client";

import Link from "next/link";
import {
  MoreVertical,
  ExternalLink,
  Pencil,
  Trash2,
  Calendar,
  Globe,
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
};

export function WebsiteCard({ website }: WebsiteCardProps) {
  const createdDate = new Date(website.createdAt).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 relative">
      {/* Thumbnail Placeholder */}
      <div className="h-40 bg-muted/50 w-full relative overflow-hidden group-hover:bg-muted/80 transition-colors">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
          <Globe className="w-16 h-16" />
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/sites/${website.id}`}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="line-clamp-1 text-lg">
              <Link href={`/sites/${website.id}`} className="hover:underline">
                {website.name}
              </Link>
            </CardTitle>
            <a
              href={`http://${website.subdomain}.ezbuilder.local`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors mt-1 block"
            >
              {website.subdomain}.ezbuilder.local
            </a>
          </div>
          <Badge variant={website.isActive ? "default" : "secondary"}>
            {website.isActive ? "Active" : "Draft"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {website.description || "Chưa có mô tả"}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-2 border-t bg-muted/10 text-xs text-muted-foreground flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {createdDate}
        </span>
        <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
          <Link href={`/sites/${website.id}`}>
            Edit <Pencil className="w-3 h-3 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
