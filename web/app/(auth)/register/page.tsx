import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Đăng ký - EZBuilder",
  description: "Tạo tài khoản EZBuilder miễn phí",
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">Đăng ký</h1>
      <RegisterForm />
    </>
  );
}
