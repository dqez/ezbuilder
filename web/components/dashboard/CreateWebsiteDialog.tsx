"use client";

import { useState, useMemo, memo, useCallback } from "react";
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
import {
  ArrowLeft,
  Check,
  Eye,
  FileText,
  Briefcase,
  ShoppingBag,
  Calendar,
  BookOpen,
  User,
  X,
} from "lucide-react";
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

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  blank: <FileText className="w-4 h-4" />,
  portfolio: <User className="w-4 h-4" />,
  business: <Briefcase className="w-4 h-4" />,
  blog: <BookOpen className="w-4 h-4" />,
  ecommerce: <ShoppingBag className="w-4 h-4" />,
  event: <Calendar className="w-4 h-4" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  blank: "Trống",
  portfolio: "Portfolio",
  business: "Kinh doanh",
  blog: "Blog",
  ecommerce: "Cửa hàng",
  event: "Sự kiện",
};

/** SVG thumbnail minh họa layout của từng mẫu */
const TemplateThumbnail = memo(function TemplateThumbnail({
  template,
}: {
  template: Template;
}) {
  const { primary, secondary, text, bg } = template.colors;

  if (template.id === "blank") {
    return (
      <svg
        viewBox="0 0 200 150"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect width="200" height="150" fill={bg} />
        <rect x="16" y="16" width="168" height="20" rx="4" fill={secondary} />
        <rect x="16" y="46" width="120" height="8" rx="2" fill={secondary} />
        <rect x="16" y="62" width="90" height="8" rx="2" fill={secondary} />
        <rect x="16" y="78" width="140" height="8" rx="2" fill={secondary} />
        <rect x="60" y="110" width="80" height="24" rx="6" fill={primary} />
      </svg>
    );
  }

  if (template.id === "portfolio") {
    return (
      <svg
        viewBox="0 0 200 150"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect width="200" height="150" fill={bg} />
        {/* Hero */}
        <rect width="200" height="60" fill={primary} />
        <rect
          x="30"
          y="14"
          width="140"
          height="10"
          rx="3"
          fill={text}
          opacity="0.9"
        />
        <rect
          x="55"
          y="30"
          width="90"
          height="8"
          rx="2"
          fill={text}
          opacity="0.5"
        />
        {/* Project Grid */}
        <rect x="10" y="72" width="58" height="40" rx="4" fill={secondary} />
        <rect x="76" y="72" width="58" height="40" rx="4" fill={secondary} />
        <rect x="142" y="72" width="58" height="40" rx="4" fill={secondary} />
        {/* Footer */}
        <rect width="200" height="28" y="122" fill={primary} opacity="0.8" />
      </svg>
    );
  }

  if (template.id === "landing-page") {
    return (
      <svg
        viewBox="0 0 200 150"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect width="200" height="150" fill={bg} />
        {/* Hero */}
        <rect width="200" height="56" fill={primary} />
        <rect
          x="40"
          y="12"
          width="120"
          height="12"
          rx="3"
          fill="white"
          opacity="0.95"
        />
        <rect
          x="60"
          y="30"
          width="80"
          height="8"
          rx="2"
          fill="white"
          opacity="0.5"
        />
        {/* Features */}
        <rect x="10" y="66" width="56" height="48" rx="6" fill={secondary} />
        <rect x="74" y="66" width="56" height="48" rx="6" fill={secondary} />
        <rect x="138" y="66" width="56" height="48" rx="6" fill={secondary} />
        {/* inner icon boxes */}
        <rect
          x="26"
          y="78"
          width="24"
          height="12"
          rx="3"
          fill={primary}
          opacity="0.3"
        />
        <rect
          x="90"
          y="78"
          width="24"
          height="12"
          rx="3"
          fill={primary}
          opacity="0.3"
        />
        <rect
          x="154"
          y="78"
          width="24"
          height="12"
          rx="3"
          fill={primary}
          opacity="0.3"
        />
        {/* CTA */}
        <rect x="62" y="126" width="76" height="18" rx="6" fill={primary} />
      </svg>
    );
  }

  if (template.id === "business") {
    return (
      <svg
        viewBox="0 0 200 150"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect width="200" height="150" fill={bg} />
        {/* Nav */}
        <rect width="200" height="22" fill={primary} />
        <rect
          x="10"
          y="6"
          width="40"
          height="10"
          rx="2"
          fill="white"
          opacity="0.9"
        />
        {/* Hero Image Placeholder */}
        <rect y="22" width="200" height="50" fill={primary} opacity="0.7" />
        <rect
          x="30"
          y="34"
          width="140"
          height="12"
          rx="3"
          fill="white"
          opacity="0.9"
        />
        {/* Services row */}
        <rect x="10" y="84" width="42" height="36" rx="4" fill={secondary} />
        <rect x="60" y="84" width="42" height="36" rx="4" fill={secondary} />
        <rect x="110" y="84" width="42" height="36" rx="4" fill={secondary} />
        <rect x="160" y="84" width="32" height="36" rx="4" fill={secondary} />
        {/* Footer */}
        <rect width="200" height="18" y="132" fill="#1e3a5f" />
      </svg>
    );
  }

  if (template.id === "blog") {
    return (
      <svg
        viewBox="0 0 200 150"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect width="200" height="150" fill={bg} />
        {/* Header */}
        <rect width="200" height="28" fill={secondary} />
        <rect x="10" y="8" width="60" height="12" rx="3" fill={primary} />
        {/* Post cards */}
        <rect x="8" y="38" width="184" height="32" rx="4" fill={secondary} />
        <rect
          x="16"
          y="44"
          width="100"
          height="8"
          rx="2"
          fill="#111827"
          opacity="0.7"
        />
        <rect
          x="16"
          y="56"
          width="140"
          height="5"
          rx="1"
          fill="#111827"
          opacity="0.3"
        />
        <rect x="8" y="78" width="184" height="32" rx="4" fill={secondary} />
        <rect
          x="16"
          y="84"
          width="80"
          height="8"
          rx="2"
          fill="#111827"
          opacity="0.7"
        />
        <rect
          x="16"
          y="96"
          width="120"
          height="5"
          rx="1"
          fill="#111827"
          opacity="0.3"
        />
        {/* Tag badges */}
        <rect
          x="8"
          y="120"
          width="38"
          height="14"
          rx="7"
          fill={primary}
          opacity="0.6"
        />
        <rect
          x="52"
          y="120"
          width="48"
          height="14"
          rx="7"
          fill={primary}
          opacity="0.4"
        />
      </svg>
    );
  }

  if (template.id === "ecommerce") {
    return (
      <svg
        viewBox="0 0 200 150"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect width="200" height="150" fill={bg} />
        {/* Hero banner */}
        <rect width="200" height="46" fill={primary} />
        <rect
          x="30"
          y="12"
          width="140"
          height="10"
          rx="3"
          fill="white"
          opacity="0.9"
        />
        <rect
          x="70"
          y="28"
          width="60"
          height="12"
          rx="6"
          fill="white"
          opacity="0.8"
        />
        {/* Product grid 2x2 */}
        <rect x="8" y="56" width="88" height="40" rx="4" fill={secondary} />
        <rect x="104" y="56" width="88" height="40" rx="4" fill={secondary} />
        <rect x="8" y="104" width="88" height="40" rx="4" fill={secondary} />
        <rect x="104" y="104" width="88" height="40" rx="4" fill={secondary} />
        {/* Price tags */}
        <rect
          x="14"
          y="84"
          width="30"
          height="8"
          rx="2"
          fill={primary}
          opacity="0.5"
        />
        <rect
          x="110"
          y="84"
          width="30"
          height="8"
          rx="2"
          fill={primary}
          opacity="0.5"
        />
      </svg>
    );
  }

  if (template.id === "event") {
    return (
      <svg
        viewBox="0 0 200 150"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect width="200" height="150" fill={bg} />
        {/* Event hero */}
        <rect width="200" height="64" fill={primary} />
        <rect
          x="20"
          y="14"
          width="160"
          height="12"
          rx="3"
          fill="white"
          opacity="0.95"
        />
        <rect
          x="60"
          y="32"
          width="80"
          height="8"
          rx="2"
          fill="white"
          opacity="0.6"
        />
        <rect
          x="70"
          y="46"
          width="60"
          height="14"
          rx="7"
          fill="white"
          opacity="0.2"
        />
        {/* Schedule */}
        <rect x="10" y="74" width="180" height="18" rx="4" fill={secondary} />
        <rect x="10" y="98" width="180" height="18" rx="4" fill={secondary} />
        {/* Time labels */}
        <rect
          x="18"
          y="80"
          width="30"
          height="6"
          rx="2"
          fill={primary}
          opacity="0.4"
        />
        <rect
          x="18"
          y="104"
          width="30"
          height="6"
          rx="2"
          fill={primary}
          opacity="0.4"
        />
        {/* Register CTA */}
        <rect x="54" y="126" width="92" height="18" rx="6" fill={primary} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 200 150"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <rect width="200" height="150" fill={secondary} />
    </svg>
  );
});

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
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [description, setDescription] = useState("");
  const [showSubdomain, setShowSubdomain] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const resetForm = useCallback(() => {
    setStep(1);
    setSelectedTemplate(TEMPLATES[0]);
    setPreviewTemplate(null);
    setName("");
    setSubdomain("");
    setDescription("");
    setShowSubdomain(false);
    setActiveCategory("all");
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(resetForm, 300);
  }, [onClose, resetForm]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        name,
        subdomain: subdomain.toLowerCase().replace(/[^a-z0-9-]/g, ""),
        description: description || undefined,
        template: selectedTemplate,
      });
    },
    [name, subdomain, description, selectedTemplate, onSubmit],
  );

  const handleNameChange = useCallback((value: string) => {
    setName(value);
    setSubdomain(
      value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 30),
    );
  }, []);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(TEMPLATES.map((t) => t.category)))],
    [],
  );

  const filteredTemplates = useMemo(
    () =>
      activeCategory === "all"
        ? TEMPLATES
        : TEMPLATES.filter((t) => t.category === activeCategory),
    [activeCategory],
  );

  return (
    <>
      {/* Template Full-size Preview Modal */}
      {/* Template Full-size Preview Modal */}
      <Dialog
        open={!!previewTemplate}
        onOpenChange={(open) => !open && setPreviewTemplate(null)}
      >
        <DialogContent
          className="sm:max-w-2xl p-0 gap-0 overflow-hidden"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">
            Xem trước giao diện {previewTemplate?.name}
          </DialogTitle>
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h2 className="font-bold text-lg">{previewTemplate?.name}</h2>
              <p className="text-sm text-muted-foreground">
                {previewTemplate?.description}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setPreviewTemplate(null)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="p-6 bg-muted/30">
            <div className="rounded-xl overflow-hidden border shadow-sm aspect-video">
              {previewTemplate && (
                <TemplateThumbnail template={previewTemplate} />
              )}
            </div>
          </div>
          <div className="px-6 py-4 flex justify-end gap-2 border-t">
            <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
              Đóng
            </Button>
            <Button
              onClick={() => {
                if (previewTemplate) {
                  setSelectedTemplate(previewTemplate);
                  setPreviewTemplate(null);
                  setStep(2);
                }
              }}
            >
              Dùng mẫu này
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className={cn(step === 1 ? "sm:max-w-[860px]" : "sm:max-w-[440px]")}
        >
          <DialogHeader>
            <DialogTitle>
              {step === 1 ? "Chọn Mẫu Website" : "Thông Tin Website"}
            </DialogTitle>
            <DialogDescription>
              {step === 1
                ? "Bắt đầu với một mẫu có sẵn hoặc trang trắng."
                : `Mẫu đang dùng: ${selectedTemplate.name}`}
            </DialogDescription>
          </DialogHeader>

          {step === 1 ? (
            <div className="py-2">
              {/* Category filter pills */}
              <div className="flex gap-2 flex-wrap mb-4 pb-3 border-b">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-muted-foreground/20 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {cat !== "all" && CATEGORY_ICONS[cat]}
                    {cat === "all" ? "Tất cả" : (CATEGORY_LABELS[cat] ?? cat)}
                  </button>
                ))}
              </div>

              {/* Template grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[52vh] overflow-y-auto p-1">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={cn(
                      "group cursor-pointer rounded-xl border-2 transition-all overflow-hidden relative",
                      selectedTemplate.id === template.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-muted hover:border-primary/40 hover:shadow-md",
                    )}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    {/* SVG Thumbnail */}
                    <div className="aspect-4/3 bg-muted/30 relative overflow-hidden">
                      <TemplateThumbnail template={template} />

                      {/* Preview button on hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewTemplate(template);
                          }}
                          className="flex items-center gap-1 bg-white text-foreground px-3 py-1.5 rounded-full text-xs font-medium shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          Xem trước
                        </button>
                      </div>

                      {/* Selected checkmark */}
                      {selectedTemplate.id === template.id && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                          <Check className="w-3 h-3" />
                        </div>
                      )}

                      {/* Category badge */}
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white px-2 py-0.5 rounded-full text-[10px]">
                        {CATEGORY_ICONS[template.category]}
                        {CATEGORY_LABELS[template.category]}
                      </div>
                    </div>

                    <div className="p-2.5">
                      <h3
                        className="font-semibold text-sm truncate"
                        title={template.name}
                      >
                        {template.name}
                      </h3>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
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
              {/* Selected template preview */}
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border">
                <div className="w-16 h-12 rounded-lg overflow-hidden border shrink-0">
                  <TemplateThumbnail template={selectedTemplate} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{selectedTemplate.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {selectedTemplate.description}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs shrink-0"
                  onClick={() => setStep(1)}
                >
                  Đổi mẫu
                </Button>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Tên Website</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Portfolio của tôi"
                  required
                  autoFocus
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Địa chỉ website</Label>
                  <button
                    type="button"
                    onClick={() => setShowSubdomain(!showSubdomain)}
                    className="text-xs text-primary hover:underline"
                  >
                    {showSubdomain ? "Ẩn" : "Chỉnh sửa"}
                  </button>
                </div>
                {showSubdomain ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      /public/
                    </span>
                    <Input
                      id="subdomain"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value)}
                      placeholder="my-portfolio"
                      className="flex-1"
                      required
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      /home
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
                    {subdomain ? (
                      <>
                        /public/
                        <span className="font-medium text-foreground mx-1">
                          {subdomain}
                        </span>
                        /home
                      </>
                    ) : (
                      <span className="italic">
                        Nhập tên website ở trên để tạo địa chỉ
                      </span>
                    )}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả (Tùy chọn)</Label>
                <textarea
                  id="description"
                  className="flex min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
              <div />
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
                <Button
                  type="submit"
                  form="create-site-form"
                  disabled={loading}
                >
                  {loading ? "Đang tạo..." : "Tạo Website"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
