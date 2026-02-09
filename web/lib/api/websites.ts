import { api } from "./client";

export type Website = {
  id: string;
  name: string;
  subdomain: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

type CreateWebsiteRequest = {
  name: string;
  subdomain: string;
  description?: string;
};

type UpdateWebsiteRequest = {
  name?: string;
  description?: string;
  isActive?: boolean;
};

export const websitesApi = {
  getAll: () => api.get<Website[]>("/websites"),

  getById: (id: string) => api.get<Website>(`/websites/${id}`),

  create: (data: CreateWebsiteRequest) => api.post<Website>("/websites", data),

  update: (id: string, data: UpdateWebsiteRequest) =>
    api.patch<Website>(`/websites/${id}`, data),

  delete: (id: string) => api.delete<void>(`/websites/${id}`),
};
