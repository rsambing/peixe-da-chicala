import type { ApiProduct, ApiCategory, ApiOrder, SiteSettings, ApiTestimonial } from "./api-types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const isFormData = options?.body instanceof FormData;

  const headers: Record<string, string> = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      window.location.href = "/login";
    }
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}

export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // Products
  getProducts: () => request<ApiProduct[]>("/products"),

  createProduct: (data: FormData) =>
    request<ApiProduct>("/products", { method: "POST", body: data }),

  updateProduct: (id: number, data: FormData) =>
    request<ApiProduct>(`/products/${id}`, { method: "PUT", body: data }),

  deleteProduct: (id: number) =>
    request<void>(`/products/${id}`, { method: "DELETE" }),

  deleteProductImage: (productId: number, imageId: number) =>
    request<void>(`/products/${productId}/images/${imageId}`, { method: "DELETE" }),

  // Categories
  getCategories: () => request<ApiCategory[]>("/categories"),

  createCategory: (name: string, image?: File) => {
    const fd = new FormData();
    fd.append("name", name);
    if (image) fd.append("image", image);
    return request<ApiCategory>("/categories", { method: "POST", body: fd });
  },

  updateCategory: (id: number, name?: string, image?: File) => {
    const fd = new FormData();
    if (name !== undefined) fd.append("name", name);
    if (image) fd.append("image", image);
    return request<ApiCategory>(`/categories/${id}`, { method: "PUT", body: fd });
  },

  deleteCategory: (id: number) =>
    request<void>(`/categories/${id}`, { method: "DELETE" }),

  // Orders
  getOrders: () => request<ApiOrder[]>("/orders"),

  updateOrderStatus: (id: number, status: string) =>
    request<ApiOrder>(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  deleteOrder: (id: number) =>
    request<void>(`/orders/${id}`, { method: "DELETE" }),

  // Testimonials
  getTestimonials: () => request<ApiTestimonial[]>("/testimonials"),

  createTestimonial: (data: FormData) =>
    request<ApiTestimonial>("/testimonials", { method: "POST", body: data }),

  updateTestimonial: (id: number, data: FormData) =>
    request<ApiTestimonial>(`/testimonials/${id}`, { method: "PUT", body: data }),

  deleteTestimonial: (id: number) =>
    request<void>(`/testimonials/${id}`, { method: "DELETE" }),

  // Site settings
  getSettings: () => request<SiteSettings>("/settings"),

  updateSetting: (key: string, value?: string, image?: File) => {
    if (image) {
      const fd = new FormData();
      fd.append("image", image);
      return request<{ key: string; value: string }>(`/settings/${key}`, { method: "PUT", body: fd });
    }
    return request<{ key: string; value: string }>(`/settings/${key}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    });
  },
};
