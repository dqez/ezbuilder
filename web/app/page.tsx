import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Sẵn sàng xây dựng website đầu tiên?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Bắt đầu miễn phí ngay hôm nay. Không cần thẻ tín dụng.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background text-primary hover:bg-background/90 h-12 px-8 shadow-lg"
          >
            Bắt đầu miễn phí
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
