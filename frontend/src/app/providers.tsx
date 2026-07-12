"use client";

import type { ReactNode } from "react";
import { ProductsProvider } from "@/lib/products-context";
import { CartProvider } from "@/lib/cart-context";
import { FloatingCart } from "@/components/ui/FloatingCart";
import { BackendLoader } from "@/components/ui/BackendLoader";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <BackendLoader>
      <ProductsProvider>
        <CartProvider>
          {children}
          <FloatingCart />
        </CartProvider>
      </ProductsProvider>
    </BackendLoader>
  );
}
