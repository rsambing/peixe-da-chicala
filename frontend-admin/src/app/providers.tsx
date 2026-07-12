"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { NewOrdersProvider } from "@/lib/new-orders-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NewOrdersProvider>{children}</NewOrdersProvider>
    </AuthProvider>
  );
}
