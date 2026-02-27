"use client";

import Link from "next/link";
import {
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  ExternalLink,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Page } from "@/lib/api/pages";

type PageCardProps = {
  page: Page;
  subdomain: string;
};

export function PageCard({ page, subdomain }: PageCardProps) {
  const updatedDate = new Date(page.updatedAt).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="p-4 bg-background border rounded-lg hover:border-primary/50 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium">{page.name}</h3>
            <p className="text-sm text-muted-foreground">/{page.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {page.isPublished ? (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle className="w-3 h-3" />
              Đã xuất bản
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <XCircle className="w-3 h-3" />
              Bản nháp
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {updatedDate}
        </span>

        <div className="flex gap-2">
          {page.isPublished && (
            <Button asChild variant="ghost" size="sm">
              <a
                href={`/public/${subdomain}/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href={`/editor/${page.id}`}>
              <Edit className="w-3 h-3 mr-1" />
              Chỉnh sửa
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
