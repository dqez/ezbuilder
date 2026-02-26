"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Search, Ghost } from "lucide-react";
import { websitesApi, type Website } from "@/lib/api/websites";
import { pagesApi } from "@/lib/api/pages";
import { type Template } from "@/lib/templates";
import { WebsiteCard } from "@/components/dashboard/WebsiteCard";
import { CreateWebsiteDialog } from "@/components/dashboard/CreateWebsiteDialog";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const fetchWebsites = async () => {
    try {
      const data = await websitesApi.getAll();
      setWebsites(data);
      setFilteredWebsites(data);
    } catch {
      setError("Không thể tải danh sách website");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  useEffect(() => {
    const filtered = websites.filter(
      (site) =>
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.subdomain.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredWebsites(filtered);
  }, [searchTerm, websites]);

  const handleCreateWebsite = async (data: {
    name: string;
    subdomain: string;
    description?: string;
    template: Template;
  }) => {
    setCreating(true);
    try {
      // 1. Create website
      const newWebsite = await websitesApi.create({
        name: data.name,
        subdomain: data.subdomain,
        description: data.description,
      });

      // 2. Create home page with template content
      try {
        await pagesApi.create({
          name: "Trang chủ",
          slug: "home",
          websiteId: newWebsite.id,
          content: data.template.data,
        });
      } catch (e) {
        console.error("Failed to create home page:", e);
        // We still continue as the website was created
      }

      setWebsites((prev) => [newWebsite, ...prev]);
      setDialogOpen(false);
      setSearchTerm(""); // Reset search to show new website
    } catch {
      setError("Không thể tạo website");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteWebsite = async (id: string) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa website này?");
    if (!confirmed) return;
    try {
      await websitesApi.delete(id);
      setWebsites((prev) => prev.filter((w) => w.id !== id));
    } catch {
      setError("Không thể xóa website");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
        <DashboardStats
          totalWebsites={websites.length}
          activeWebsites={websites.filter((w) => w.isActive).length}
        />
      </div>

      {/* Main Content Area */}
      <div className="bg-background rounded-xl border shadow-sm p-6 min-h-[500px]">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm website..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo Website Mới
          </Button>
        </div>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Website Grid */}
        {websites.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-4">
              <Ghost className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-medium mb-2">Chưa có website nào</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Bạn chưa tạo bất kỳ website nào. Hãy bắt đầu xây dựng trang web
              đầu tiên của bạn ngay hôm nay!
            </p>
            <Button size="lg" onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo Website Đầu Tiên
            </Button>
          </div>
        ) : filteredWebsites.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Không tìm thấy website nào khớp với từ khóa &quot;{searchTerm}&quot;
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWebsites.map((website) => (
              <WebsiteCard
                key={website.id}
                website={website}
                onDelete={handleDeleteWebsite}
              />
            ))}
          </div>
        )}
      </div>

      <CreateWebsiteDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreateWebsite}
        loading={creating}
      />
    </div>
  );
}
