import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Suspense } from "react";
import { TrackOrderClient } from "./TrackOrderClient";

export default function TrackOrderPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-24 pb-16 px-6">
        <Suspense fallback={<div className="mx-auto max-w-3xl text-muted-foreground">A carregar...</div>}>
          <TrackOrderClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
