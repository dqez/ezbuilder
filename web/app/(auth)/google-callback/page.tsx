"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/auth-store";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setError("Đăng nhập bằng Google thất bại. Không tìm thấy token.");
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      try {
        // Temporarily set the token so apiClient can use it to fetch /auth/me
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token);
        }

        const user = await authApi.getMe();

        // Formally set auth state in store
        setAuth(user, token);

        router.push("/dashboard");
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Lỗi khi xác thực tải khoản Google. Vui lòng thử lại.");
        localStorage.removeItem("auth_token");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    handleCallback();
  }, [router, searchParams, setAuth]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
          <p className="font-medium">{error}</p>
          <p className="text-sm mt-2">
            Đang chuyển hướng về trang đăng nhập...
          </p>
        </div>
      ) : (
        <>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">
            Đang xử lý đăng nhập...
          </p>
        </>
      )}
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground mt-4">Đang tải...</p>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
