"use client";

import { Button } from "@/components/ui/button";
import { MoveRight, Zap, Code, Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-r from-violet-500/30 via-fuchsia-500/30 to-cyan-500/30 blur-[100px] rounded-full mix-blend-multiply animate-pulse" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-muted-foreground">
              v1.0 Now Available
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-foreground via-foreground to-muted-foreground/70"
          >
            Xây dựng Website <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-600 to-indigo-600">
              Không cần Code
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Kéo thả, chỉnh sửa và xuất bản Landing Page chuyển nghiệp chỉ trong
            vài phút. Tối ưu SEO, tốc độ tải trang cực nhanh và giao diện chuẩn
            UI/UX.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="h-12 px-8 text-base rounded-full"
              asChild
            >
              <Link href="/dashboard">
                Bắt đầu miễn phí <MoveRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base rounded-full hover:bg-muted/50"
              asChild
            >
              <Link href="#features">Xem tính năng</Link>
            </Button>
          </motion.div>
        </div>

        {/* Builder Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
          className="relative max-w-6xl mx-auto perspective-1000"
        >
          <div className="rounded-xl border bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden aspect-video relative group ring-1 ring-border/50">
            {/* Mockup Header */}
            <div className="h-10 border-b bg-muted/30 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
              <div className="mx-auto bg-muted/50 h-5 w-64 rounded-md flex items-center justify-center text-[10px] text-muted-foreground font-mono">
                {process.env.NEXT_PUBLIC_APP_NAME?.toLowerCase() || "ezbuilder"}
                .com/editor/new-project
              </div>
            </div>

            {/* Mockup Body - Simulated UI */}
            <div className="flex h-full">
              {/* Simulated Sidebar */}
              <div className="w-64 border-r bg-muted/10 p-4 space-y-4 hidden md:block">
                <div className="h-8 bg-muted/20 rounded w-3/4 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-20 bg-muted/20 rounded animate-pulse delay-75" />
                  <div className="h-20 bg-muted/20 rounded animate-pulse delay-100" />
                  <div className="h-20 bg-muted/20 rounded animate-pulse delay-150" />
                </div>
              </div>
              {/* Simulated Canvas */}
              <div className="flex-1 bg-background p-8 flex items-center justify-center">
                <div className="w-[80%] h-[80%] border-2 border-dashed border-muted-foreground/20 rounded-lg flex flex-col items-center justify-center text-muted-foreground/50 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
                    <Code className="w-8 h-8 opacity-50" />
                  </div>
                  <p>Drag components here</p>
                </div>
              </div>
              {/* Simulated Properties */}
              <div className="w-64 border-l bg-muted/10 p-4 space-y-4 hidden lg:block">
                <div className="h-8 bg-muted/20 rounded w-1/2 mb-6 animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 bg-muted/20 rounded w-full animate-pulse" />
                  <div className="h-8 bg-muted/20 rounded w-full animate-pulse delay-75" />
                  <div className="h-4 bg-muted/20 rounded w-full animate-pulse delay-100" />
                  <div className="h-8 bg-muted/20 rounded w-full animate-pulse delay-150" />
                </div>
              </div>
            </div>

            {/* Floating Elements for 3D effect */}
            <motion.div
              className="absolute top-20 right-20 bg-background/80 backdrop-blur border shadow-lg p-4 rounded-lg z-20 hidden md:block"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">98/100</div>
                  <div className="text-xs text-muted-foreground">
                    Performance Score
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-20 left-20 bg-background/80 backdrop-blur border shadow-lg p-4 rounded-lg z-20 hidden md:block"
              animate={{ y: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">SSL Secured</div>
                  <div className="text-xs text-muted-foreground">
                    Auto-provisioned
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
