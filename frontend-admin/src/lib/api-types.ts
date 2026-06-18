export interface ApiCategory {
  id: number;
  name: string;
  imageUrl: string | null;
  imageDeleteUrl: string | null;
}

export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  imageDeleteUrl: string | null;
  available: boolean;
  categoryId: number;
  category: ApiCategory;
  createdAt: string;
}

export interface ApiOrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: ApiProduct;
}

export interface ApiOrder {
  id: number;
  trackingCode: string;
  customerName: string;
  phone: string;
  address: string;
  status: string;
  total: number;
  createdAt: string;
  items: ApiOrderItem[];
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "ATENDENTE";
  createdAt: string;
}
