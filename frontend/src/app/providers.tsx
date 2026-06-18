"use client";

import type { ReactNode } from "react";
import { ProductsProvider } from "@/lib/products-context";
import { CartProvider } from "@/lib/cart-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ProductsProvider>
      <CartProvider>{children}</CartProvider>
    </ProductsProvider>
  );
}
