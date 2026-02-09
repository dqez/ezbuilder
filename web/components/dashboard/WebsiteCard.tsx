"use client";

import Link from "next/link";
import { Globe, Calendar, ArrowRight } from "lucide-react";
import type { Website } from "@/lib/api/websites";

type WebsiteCardProps = {
  website: Website;
};

export function WebsiteCard({ website }: WebsiteCardProps) {
  const createdDate = new Date(website.createdAt).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/sites/${website.id}`}
      className="group block p-6 bg-background border rounded-xl hover:border-primary/50 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              {website.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {website.subdomain}.ezbuilder.local
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {website.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {website.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {createdDate}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full ${
            website.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {website.isActive ? "Active" : "Inactive"}
        </span>
      </div>
    </Link>
  );
}
