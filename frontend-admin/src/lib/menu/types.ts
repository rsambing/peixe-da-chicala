export type MenuCategoryId =
  | "peixes-grelhados"
  | "pratos-tradicionais"
  | "mariscos"
  | "bebidas"
  | "sobremesas"
  | "extras";

export interface MenuCategory {
  id: MenuCategoryId;
  name: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  categoryId: MenuCategoryId;
  name: string;
  shortDesc: string;
  description: string;
  ingredients?: string[];
  priceKz: number;
  imageUrl: string;
  isAvailable: boolean;
  tags?: string[];
  recommendedExtraIds?: string[];
}

export type OrderStatus =
  | "RECEBIDO"
  | "EM_PREPARACAO"
  | "SAIU_PARA_ENTREGA"
  | "ENTREGUE";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  RECEBIDO: "Pedido recebido",
  EM_PREPARACAO: "Em preparação",
  SAIU_PARA_ENTREGA: "Saiu para entrega",
  ENTREGUE: "Entregue",
};
