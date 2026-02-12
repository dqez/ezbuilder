"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateWebsiteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    subdomain: string;
    description?: string;
  }) => void;
  loading?: boolean;
}

export function CreateWebsiteDialog({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: CreateWebsiteDialogProps) {
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [description, setDescription] = useState("");

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo Website Mới</DialogTitle>
          <DialogDescription>
            Điền các thông tin cơ bản để bắt đầu xây dựng trang web của bạn.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Tên Website</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Portfolio của tôi"
              className="col-span-3"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subdomain">Subdomain</Label>
            <div className="flex items-center gap-2">
              <Input
                id="subdomain"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                placeholder="my-portfolio"
                className="flex-1"
                required
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                .ezbuilder.local
              </span>
            </div>
            <p className="text-[0.8rem] text-muted-foreground">
              Chỉ dùng chữ thường, số và dấu gạch ngang (-)
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Mô tả (Tùy chọn)</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả trang web của bạn..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo Website"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
