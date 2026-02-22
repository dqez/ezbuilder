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
import { TEMPLATES, type Template } from "@/lib/templates";
import { ArrowLeft, Check, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateWebsiteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    subdomain: string;
    description?: string;
    template: Template;
  }) => void;
  loading?: boolean;
}

export function CreateWebsiteDialog({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: CreateWebsiteDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(
    TEMPLATES[0],
  );
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setStep(1);
    setSelectedTemplate(TEMPLATES[0]);
    setName("");
    setSubdomain("");
    setDescription("");
  };

  const handleClose = () => {
    onClose();
    // Delay reset to allow animation to finish
    setTimeout(resetForm, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      subdomain: subdomain.toLowerCase().replace(/[^a-z0-9-]/g, ""),
      description: description || undefined,
      template: selectedTemplate,
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={cn(step === 1 ? "sm:max-w-[800px]" : "sm:max-w-[425px]")}
      >
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Chọn Mẫu Website" : "Thông Tin Website"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Bắt đầu với một mẫu có sẵn hoặc trang trắng."
              : "Điền các thông tin cơ bản để bắt đầu xây dựng."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-1">
              {TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className={cn(
                    "cursor-pointer rounded-xl border-2 transition-all overflow-hidden relative group",
                    selectedTemplate.id === template.id
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50",
                  )}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="aspect-3/4 bg-muted relative">
                    {/* Placeholder for thumbnail */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
                      {template.thumbnail ? (
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="object-cover w-full h-full opacity-80"
                        />
                      ) : (
                        <LayoutTemplate className="w-8 h-8 opacity-20" />
                      )}
                    </div>
                    {selectedTemplate.id === template.id && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3
                      className="font-medium text-sm truncate"
                      title={template.name}
                    >
                      {template.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 h-8">
                      {template.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form
            id="create-site-form"
            onSubmit={handleSubmit}
            className="grid gap-4 py-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="name">Tên Website</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Portfolio của tôi"
                className="col-span-3"
                required
                autoFocus
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
          </form>
        )}

        <DialogFooter className="flex justify-between sm:justify-between items-center w-full">
          {step === 2 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          ) : (
            <div></div> // Spacer
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </Button>
            {step === 1 ? (
              <Button type="button" onClick={() => setStep(2)}>
                Tiếp tục
              </Button>
            ) : (
              <Button type="submit" form="create-site-form" disabled={loading}>
                {loading ? "Đang tạo..." : "Tạo Website"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
