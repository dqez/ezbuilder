import Link from "next/link";
import { MailIcon } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container px-4 md:px-6 py-16 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl mb-4"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                EZ
              </div>
              <span>{APP_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Xây dựng landing page chuyên nghiệp không cần code. Nhanh chóng,
              đẹp mắt và tối ưu SEO.
            </p>
            <div className="flex gap-4">
              <Link
                href="mailto:trandinhquy04@gmail.com"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                <MailIcon className="w-5 h-5" />
                <span className="text-sm">Liên hệ với tôi</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Sản phẩm</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  Tính năng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Showcase
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Tài nguyên</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  Tài liệu
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Community
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Pháp lý</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
