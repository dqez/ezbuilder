import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Đăng nhập - EZBuilder",
  description: "Đăng nhập vào tài khoản EZBuilder của bạn",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">Đăng nhập</h1>
      <LoginForm />
    </>
  );
}
