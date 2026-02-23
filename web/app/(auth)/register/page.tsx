import { RegisterForm } from "@/components/auth/RegisterForm";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: `Đăng ký - ${APP_NAME}`,
  description: `Tạo tài khoản ${APP_NAME} miễn phí`,
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">Đăng ký</h1>
      <RegisterForm />
    </>
  );
}
