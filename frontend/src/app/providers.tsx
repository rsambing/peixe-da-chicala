"use client";

import type { ReactNode } from "react";
import { ProductsProvider } from "@/lib/products-context";
import { CartProvider } from "@/lib/cart-context";
import { FloatingCart } from "@/components/ui/FloatingCart";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ProductsProvider>
      <CartProvider>
        {children}
        <FloatingCart />
      </CartProvider>
    </ProductsProvider>
  );
}
