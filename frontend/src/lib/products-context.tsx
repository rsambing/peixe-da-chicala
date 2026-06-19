"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";
import type { MenuItem, MenuCategory } from "./menu";

interface ProductsContextValue {
  products: MenuItem[];
  categories: MenuCategory[];
  isLoading: boolean;
  error: string | null;
}

const ProductsContext = createContext<ProductsContextValue>({
  products: [],
  categories: [],
  isLoading: true,
  error: null,
});

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [apiProducts, apiCategories] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ]);

        const catMap = new Map(apiCategories.map((c) => [c.id, c.name]));

        const adaptedCategories: MenuCategory[] = apiCategories.map((c) => ({
          id: slugify(c.name) as MenuCategory["id"],
          name: c.name,
          imageUrl: c.imageUrl ?? undefined,
        }));

        const adaptedProducts: MenuItem[] = apiProducts
          .filter((p) => p.available)
          .map((p) => {
            const allImages = p.images?.length
              ? p.images.map((img) => img.imageUrl)
              : p.imageUrl
              ? [p.imageUrl]
              : [PLACEHOLDER_IMAGE];

            return {
              id: String(p.id),
              categoryId: slugify(catMap.get(p.categoryId) ?? "outros") as MenuItem["categoryId"],
              name: p.name,
              shortDesc:
                p.description.length > 100
                  ? p.description.slice(0, 100) + "…"
                  : p.description,
              description: p.description,
              priceKz: p.price,
              imageUrl: allImages[0],
              images: allImages,
              isAvailable: p.available,
            };
          });

        setCategories(adaptedCategories);
        setProducts(adaptedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar produtos");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, categories, isLoading, error }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
