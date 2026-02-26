"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Rocket,
  Globe,
  Share2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { websitesApi, type Website } from "@/lib/api/websites";
import { Input } from "@/components/ui/input";

interface PublishWizardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPublishing: boolean;
  isPublished: boolean;
  websiteId?: string;
  pageName?: string;
  pageSlug?: string;
}

type Step = "review" | "publishing" | "success";

export function PublishWizardDialog({
  isOpen,
  onClose,
  onConfirm,
  isPublishing,
  isPublished,
  websiteId,
  pageName,
  pageSlug,
}: PublishWizardDialogProps) {
  const [step, setStep] = useState<Step>("review");
  const [website, setWebsite] = useState<Website | null>(null);

  // Fetch website data to get subdomain when dialog opens
  useEffect(() => {
    if (isOpen && websiteId && !website) {
      websitesApi.getById(websiteId).then(setWebsite).catch(console.error);
    }
  }, [isOpen, websiteId, website]);

  // Handle transition from publishing to success
  useEffect(() => {
    if (step === "publishing" && !isPublishing && isPublished) {
      const timer = setTimeout(() => setStep("success"), 500);
      return () => clearTimeout(timer);
    }
  }, [isPublishing, isPublished, step]);

  // Reset step when opening
  useEffect(() => {
    if (isOpen) {
      // If already published, we are re-publishing or just showing success?
      // For this workflow, if they click publish while it's NOT published, we start at review.
      const timer = setTimeout(() => setStep("review"), 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    setStep("publishing");
    onConfirm();
  };

  const handleClose = () => {
    if (isPublishing) return; // Prevent closing while API call is pending
    onClose();
  };

  const publicUrl = website
    ? `${window.location.origin}/public/${website.subdomain}/${pageSlug || "home"}`
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {step === "review" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Rocket className="w-5 h-5 text-primary" />
                Xuất bản {pageName || "trang"}
              </DialogTitle>
              <DialogDescription>
                Bạn sắp công bố các thay đổi mới nhất của trang web này. Mọi
                người có thể truy cập thông qua link chia sẻ.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 flex flex-col items-center justify-center gap-4 bg-muted/20 border rounded-xl my-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Globe className="w-8 h-8" />
              </div>
              <div className="text-center px-4">
                <p className="font-medium text-sm">
                  Gắn kết lên mạng lưới toàn cầu
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Trang sẽ được tối ưu và cung cấp theo đường dẫn có chứa
                  subdomain của bạn.
                </p>
              </div>
            </div>

            <DialogFooter className="flex gap-2 sm:justify-between">
              <Button variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button onClick={handleConfirm} className="gap-2">
                Tiến hành xuất bản
                <ArrowRight className="w-4 h-4" />
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "publishing" && (
          <div className="py-12 flex flex-col items-center justify-center gap-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center relative">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">
                Đang đóng gói và Xuất bản...
              </h3>
              <p className="text-sm text-muted-foreground animate-pulse">
                Vui lòng không đóng cửa sổ này
              </p>
            </div>
          </div>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce-in">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Xuất bản Thành công!
              </DialogTitle>
              <DialogDescription className="text-center">
                Trang web của bạn đã được cập nhật bản lưu mới nhất và sẵn sàng
                ra mắt.
              </DialogDescription>
            </DialogHeader>

            <div className="my-6 space-y-3">
              <p className="text-sm font-medium">Đường dẫn truy cập:</p>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={publicUrl || "Đang tải URL..."}
                  className="text-xs font-mono bg-muted/50"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => navigator.clipboard.writeText(publicUrl)}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button className="w-full" onClick={handleClose}>
                Hoàn tất
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
