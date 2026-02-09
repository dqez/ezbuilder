"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { websitesApi, type Website } from "@/lib/api/websites";
import { WebsiteCard } from "@/components/dashboard/WebsiteCard";
import { CreateWebsiteDialog } from "@/components/dashboard/CreateWebsiteDialog";

export default function DashboardPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchWebsites = async () => {
    try {
      const data = await websitesApi.getAll();
      setWebsites(data);
    } catch {
      setError("Không thể tải danh sách website");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  const handleCreateWebsite = async (data: {
    name: string;
    subdomain: string;
    description?: string;
  }) => {
    setCreating(true);
    try {
      const newWebsite = await websitesApi.create(data);
      setWebsites((prev) => [...prev, newWebsite]);
      setDialogOpen(false);
    } catch {
      setError("Không thể tạo website");
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

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Websites của tôi</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và chỉnh sửa các website của bạn
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo Website
        </Button>
      </div>

      {error && (
        <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {websites.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
          <h3 className="text-lg font-medium mb-2">Chưa có website nào</h3>
          <p className="text-muted-foreground mb-4">
            Bắt đầu bằng cách tạo website đầu tiên của bạn
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo Website
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {websites.map((website) => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </div>
      )}

      <CreateWebsiteDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreateWebsite}
        loading={creating}
      />
    </>
  );
}
