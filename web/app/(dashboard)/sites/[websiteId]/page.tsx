"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Loader2, Globe } from "lucide-react";
import { websitesApi, type Website } from "@/lib/api/websites";
import { pagesApi, type Page } from "@/lib/api/pages";
import { PageCard } from "@/components/dashboard/PageCard";
import { CreatePageDialog } from "@/components/dashboard/CreatePageDialog";

export default function WebsiteDetailPage() {
  const params = useParams();
  const websiteId = params.websiteId as string;

  const [website, setWebsite] = useState<Website | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const siteData = await websitesApi.getById(websiteId);
        setWebsite(siteData);

        // Get pages for this website - need to fetch from website detail
        // For now, we'll fetch the website which should include pages
        // If API doesn't return pages, we need a separate endpoint
        setPages((siteData as Website & { pages?: Page[] }).pages || []);
      } catch {
        setError("Không thể tải thông tin website");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [websiteId]);

  const handleCreatePage = async (data: { name: string; slug: string }) => {
    setCreating(true);
    try {
      const newPage = await pagesApi.create({
        ...data,
        websiteId,
      });
      setPages((prev) => [...prev, newPage]);
      setDialogOpen(false);
      // Navigate to editor
      window.location.href = `/editor/${newPage.id}`;
    } catch {
      setError("Không thể tạo trang");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!website) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Website không tồn tại</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Quay lại Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{website.name}</h1>
              <p className="text-muted-foreground">
                /public/{website.subdomain}/home
              </p>
            </div>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo Trang
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">
          Các Trang ({pages.length})
        </h2>

        {pages.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed">
            <h3 className="text-lg font-medium mb-2">Chưa có trang nào</h3>
            <p className="text-muted-foreground mb-4">
              Bắt đầu bằng cách tạo trang đầu tiên
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo Trang
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {pages.map((page) => (
              <PageCard
                key={page.id}
                page={page}
                subdomain={website.subdomain}
              />
            ))}
          </div>
        )}
      </div>

      <CreatePageDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreatePage}
        loading={creating}
      />
    </>
  );
}
