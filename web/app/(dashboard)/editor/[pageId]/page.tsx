"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pagesApi, type Page } from "@/lib/api/pages";
import { Builder } from "@/components/editor/Builder";

export default function EditorPage() {
  const params = useParams();
  const pageId = params.pageId as string;

  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const data = await pagesApi.getById(pageId);
        setPage(data);
      } catch {
        setError("Không thể tải trang");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [pageId]);

  const handleSave = useCallback(
    async (contentStr: string) => {
      try {
        const content = JSON.parse(contentStr);
        await pagesApi.update(pageId, { content });
      } catch (e) {
        console.error("Failed to save:", e);
      }
    },
    [pageId],
  );

  const handlePublish = async () => {
    if (!page) return;
    setPublishing(true);
    try {
      const updated = page.isPublished
        ? await pagesApi.unpublish(pageId)
        : await pagesApi.publish(pageId);
      setPage(updated);
    } catch {
      setError("Không thể publish/unpublish trang");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Trang không tồn tại"}</p>
          <Button asChild variant="outline">
            <Link href="/dashboard">Quay lại Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Builder
      pageId={pageId}
      pageName={page.name}
      websiteId={page.websiteId}
      isPublished={page.isPublished}
      isPublishing={publishing}
      onPublish={handlePublish}
      onSave={handleSave}
      initialData={page.content ? JSON.stringify(page.content) : undefined}
    />
  );
}
