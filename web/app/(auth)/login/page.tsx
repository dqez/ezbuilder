import { LoginForm } from "@/components/auth/LoginForm";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: `Đăng nhập - ${APP_NAME}`,
  description: `Đăng nhập vào tài khoản ${APP_NAME} của bạn`,
};

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">Đăng nhập</h1>
      <LoginForm />
    </>
  );
}
