"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "ezbuilder_onboarding_complete";

interface TourStep {
  target: string; // CSS selector
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right" | "center";
}

const TOUR_STEPS: TourStep[] = [
  {
    target: "[data-tour='toolbox']",
    title: "Thành phần",
    description:
      "Kéo các thành phần từ đây vào trang web của bạn. Bắt đầu với Hero, Văn bản hoặc Hình ảnh!",
    position: "right",
  },
  {
    target: "[data-tour='canvas']",
    title: "Trang web của bạn",
    description:
      "Đây là nơi bạn thiết kế trang web. Kéo thả thành phần vào đây và bấm vào chúng để chỉnh sửa.",
    position: "center",
  },
  {
    target: "[data-tour='settings']",
    title: "Thuộc tính",
    description:
      "Khi bấm vào một thành phần, bạn có thể chỉnh sửa nội dung và kiểu dáng tại đây.",
    position: "left",
  },
  {
    target: "[data-tour='ai-button']",
    title: "Trợ lý AI",
    description:
      "Nhờ trợ lý AI giúp bạn thiết kế website! Nhấn Ctrl+I để mở nhanh.",
    position: "bottom",
  },
];

export function OnboardingTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      // Delay start to let the editor mount
      const timer = setTimeout(() => setIsActive(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const updatePosition = useCallback(() => {
    if (!isActive) return;
    const step = TOUR_STEPS[currentStep];
    const el = document.querySelector(step.target);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const pos = { top: 0, left: 0 };

    switch (step.position) {
      case "right":
        pos.top = rect.top + rect.height / 2 - 80;
        pos.left = rect.right + 16;
        break;
      case "left":
        pos.top = rect.top + rect.height / 2 - 80;
        pos.left = rect.left - 340;
        break;
      case "bottom":
        pos.top = rect.bottom + 16;
        pos.left = rect.left + rect.width / 2 - 160;
        break;
      case "top":
        pos.top = rect.top - 180;
        pos.left = rect.left + rect.width / 2 - 160;
        break;
      case "center":
        pos.top = rect.top + rect.height / 2 - 100;
        pos.left = rect.left + rect.width / 2 - 160;
        break;
    }

    setTooltipPos(pos);
  }, [currentStep, isActive]);

  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous setState in effect
    const frame = requestAnimationFrame(() => updatePosition());
    window.addEventListener("resize", updatePosition);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);
    };
  }, [updatePosition]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isActive) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-9998" onClick={handleSkip} />

      {/* Highlight target */}
      <HighlightElement selector={step.target} />

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed z-10000 w-[320px] bg-background rounded-xl shadow-2xl border p-5"
          style={{ top: tooltipPos.top, left: tooltipPos.left }}
        >
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>

          <h3 className="font-semibold text-base mb-2">{step.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {step.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {currentStep + 1} / {TOUR_STEPS.length}
            </span>
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button variant="ghost" size="sm" onClick={handlePrev}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Quay lại
                </Button>
              )}
              <Button size="sm" onClick={handleNext}>
                {currentStep === TOUR_STEPS.length - 1
                  ? "Hoàn tất"
                  : "Tiếp theo"}
                {currentStep < TOUR_STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 ml-1" />
                )}
              </Button>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentStep ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// Helper to highlight targeted element
function HighlightElement({ selector }: { selector: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = document.querySelector(selector);
    if (el) {
      // Use requestAnimationFrame to avoid synchronous setState in effect
      requestAnimationFrame(() => {
        setRect(el.getBoundingClientRect());
      });
    }
  }, [selector]);

  if (!rect) return null;

  return (
    <div
      className="fixed z-9999 rounded-lg ring-4 ring-primary/50 pointer-events-none"
      style={{
        top: rect.top - 4,
        left: rect.left - 4,
        width: rect.width + 8,
        height: rect.height + 8,
        boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.4)",
      }}
    />
  );
}

// Export a button to restart the tour
export function RestartTourButton() {
  const handleRestart = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRestart}
      className="gap-1.5 text-xs"
    >
      <Sparkles className="w-3 h-3" />
      Xem hướng dẫn
    </Button>
  );
}
