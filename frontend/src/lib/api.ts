import type { ApiProduct, ApiCategory, ApiOrder, CreateOrderPayload, SiteSettings, ApiTestimonial } from "./api-types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getProducts: () => request<ApiProduct[]>("/products"),

  getFeaturedProducts: () => request<ApiProduct[]>("/products/featured"),

  getProductById: (id: number) => request<ApiProduct>(`/products/${id}`),

  getCategories: () => request<ApiCategory[]>("/categories"),

  createOrder: (data: CreateOrderPayload) =>
    request<ApiOrder>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getOrderByTrackingCode: (code: string) =>
    request<ApiOrder>(`/orders/track/${encodeURIComponent(code)}`),

  getSettings: () => request<SiteSettings>("/settings"),

  getTestimonials: () => request<ApiTestimonial[]>("/testimonials"),
};
