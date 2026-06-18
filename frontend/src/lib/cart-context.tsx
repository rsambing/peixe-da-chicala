"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MenuItem } from "@/lib/menu";
import { useProducts } from "@/lib/products-context";

export interface CartLine {
  itemId: string;
  quantity: number;
  note?: string;
}

export interface CartLineDetailed extends CartLine {
  item: MenuItem;
  lineTotalKz: number;
}

interface CartContextValue {
  lines: CartLine[];
  detailedLines: CartLineDetailed[];
  itemsCount: number;
  subtotalKz: number;
  addItem: (itemId: string, quantity?: number, note?: string) => void;
  removeItem: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "peixe-da-chicala.cart.v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function safeParseLines(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((line) => {
        if (!isRecord(line)) return null;
        const itemId = line.itemId;
        const quantity = line.quantity;
        const note = line.note;
        if (typeof itemId !== "string") return null;
        if (typeof quantity !== "number" || !Number.isFinite(quantity)) return null;
        if (quantity <= 0) return null;
        return {
          itemId,
          quantity,
          note: typeof note === "string" ? note : undefined,
        } satisfies CartLine;
      })
      .filter(Boolean) as CartLine[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useProducts();

  const [lines, setLines] = useState<CartLine[]>(() => {
    if (typeof window === "undefined") return [];
    return safeParseLines(window.localStorage.getItem(STORAGE_KEY));
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const productMap = useMemo<Map<string, MenuItem>>(
    () => new Map(products.map((p) => [p.id, p])),
    [products]
  );

  const detailedLines = useMemo<CartLineDetailed[]>(() => {
    return lines
      .map((line) => {
        const item = productMap.get(line.itemId);
        if (!item) return null;
        return {
          ...line,
          item,
          lineTotalKz: item.priceKz * line.quantity,
        } satisfies CartLineDetailed;
      })
      .filter(Boolean) as CartLineDetailed[];
  }, [lines, productMap]);

  const itemsCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines]
  );

  const subtotalKz = useMemo(
    () => detailedLines.reduce((sum, line) => sum + line.lineTotalKz, 0),
    [detailedLines]
  );

  function addItem(itemId: string, quantity = 1, note?: string) {
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.itemId === itemId);
      if (idx === -1) return [...prev, { itemId, quantity, note }];

      const next = [...prev];
      next[idx] = {
        ...next[idx],
        quantity: next[idx].quantity + quantity,
        note: note ?? next[idx].note,
      };
      return next;
    });
  }

  function removeItem(itemId: string) {
    setLines((prev) => prev.filter((l) => l.itemId !== itemId));
  }

  function setQuantity(itemId: string, quantity: number) {
    const q = Math.max(0, Math.floor(quantity));
    setLines((prev) => {
      if (q <= 0) return prev.filter((l) => l.itemId !== itemId);
      return prev.map((l) => (l.itemId === itemId ? { ...l, quantity: q } : l));
    });
  }

  function clear() {
    setLines([]);
  }

  const value: CartContextValue = {
    lines,
    detailedLines,
    itemsCount,
    subtotalKz,
    addItem,
    removeItem,
    setQuantity,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
