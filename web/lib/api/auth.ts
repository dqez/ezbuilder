import { api } from "./client";
import type { User } from "../stores/auth-store";

type RegisterRequest = {
  email: string;
  password: string;
  name?: string;
};

type LoginRequest = {
  login: string;
  password: string;
};

type AuthResponse = {
  user: User;
  accessToken: string;
};

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", data),

  login: (data: LoginRequest) => api.post<AuthResponse>("/auth/login", data),

  getMe: () => api.get<User>("/auth/me"),
};
