import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MenuClient } from "./MenuClient";

export default function MenuPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-6">
        <Suspense fallback={<div className="mx-auto max-w-7xl text-muted-foreground">A carregar...</div>}>
          <MenuClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
