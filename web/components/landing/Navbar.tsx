"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            EZ
          </div>
          <span>EZBuilder</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Tính năng
          </Link>
          <Link
            href="#templates"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Mẫu giao diện
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Bảng giá
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Đăng nhập
          </Link>
          <Button asChild className="rounded-full px-6">
            <Link href="/dashboard">Bắt đầu ngay</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background border-b"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="#features"
              className="text-sm font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tính năng
            </Link>
            <Link
              href="#templates"
              className="text-sm font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mẫu giao diện
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Bảng giá
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Button
                variant="outline"
                asChild
                className="w-full justify-start"
              >
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button asChild className="w-full justify-start">
                <Link href="/dashboard">Bắt đầu miễn phí</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
