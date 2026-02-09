import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, Palette, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      {/* Header */}
      <header className="container mx-auto max-w-6xl py-6 flex items-center justify-between">
        <div className="font-bold text-xl">EZBuilder</div>
        <nav className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Dashboard
          </Link>
          <Button asChild size="sm">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>

      {/* Hero */}
      <section className="container mx-auto max-w-6xl py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Build Websites
          <br />
          <span className="text-muted-foreground">Without Code</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Create beautiful landing pages with our intuitive drag-and-drop
          editor. No coding required. Publish in minutes.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/dashboard">
              Start Building
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/editor/demo">Try Demo</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto max-w-6xl py-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-card border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Drag & Drop</h3>
            <p className="text-muted-foreground text-sm">
              Simply drag components onto your page and arrange them exactly how
              you want.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Customizable</h3>
            <p className="text-muted-foreground text-sm">
              Change colors, fonts, spacing, and more with our intuitive style
              editor.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast & Simple</h3>
            <p className="text-muted-foreground text-sm">
              Create your first page in under 10 minutes. No learning curve.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto max-w-6xl py-8 border-t">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>© 2026 EZBuilder. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
