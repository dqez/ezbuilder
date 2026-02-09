"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type CreateWebsiteDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    subdomain: string;
    description?: string;
  }) => void;
  loading?: boolean;
};

export function CreateWebsiteDialog({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: CreateWebsiteDialogProps) {
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      subdomain: subdomain.toLowerCase().replace(/[^a-z0-9-]/g, ""),
      description: description || undefined,
    });
  };

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate subdomain from name
    if (!subdomain) {
      setSubdomain(
        value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 30),
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-background rounded-xl shadow-xl w-full max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-6">Tạo Website Mới</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Tên website
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Portfolio của tôi"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subdomain" className="text-sm font-medium">
              Subdomain
            </label>
            <div className="flex items-center gap-2">
              <input
                id="subdomain"
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                placeholder="my-portfolio"
                required
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="text-sm text-muted-foreground">
                .ezbuilder.local
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Chỉ dùng chữ thường, số và dấu gạch ngang
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Mô tả (tùy chọn)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Một website portfolio đơn giản..."
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo Website"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
