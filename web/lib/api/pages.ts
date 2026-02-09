import { api } from "./client";

export type Page = {
  id: string;
  name: string;
  slug: string;
  content: Record<string, unknown>;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  websiteId: string;
};

type CreatePageRequest = {
  name: string;
  slug: string;
  websiteId: string;
  content?: Record<string, unknown>;
};

type UpdatePageRequest = {
  name?: string;
  content?: Record<string, unknown>;
};

export const pagesApi = {
  getById: (id: string) => api.get<Page>(`/pages/${id}`),

  create: (data: CreatePageRequest) => api.post<Page>("/pages", data),

  update: (id: string, data: UpdatePageRequest) =>
    api.patch<Page>(`/pages/${id}`, data),

  publish: (id: string) => api.post<Page>(`/pages/${id}/publish`),

  unpublish: (id: string) => api.post<Page>(`/pages/${id}/unpublish`),

  // Get public page (no auth required)
  getPublic: (subdomain: string, slug: string) =>
    api.get<Page>(`/public/${subdomain}/${slug}`),
};
