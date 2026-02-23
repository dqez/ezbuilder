import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <Link href="/" className="font-bold text-2xl mb-8">
        {APP_NAME}
      </Link>
      <div className="w-full max-w-md bg-background border rounded-xl p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
