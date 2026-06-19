import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Button, RevealOnScroll } from "@/components/ui";
import { HeroSection } from "./_components/HeroSection";
import { PopularCarousel } from "./_components/PopularCarousel";
import { HowItWorks } from "./_components/HowItWorks";
import { SobreSection } from "./_components/SobreSection";
import { TestimonialsSection } from "./_components/TestimonialsSection";
import { CategoriesGrid } from "./_components/CategoriesGrid";
import { FeaturedSection } from "./_components/FeaturedSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />

        {/* ── Pratos Mais Pedidos ──────────────────────────────────── */}
        <section id="mais-pedidos" className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6 space-y-6">
            <RevealOnScroll className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-3xl font-display font-black text-foreground">
                  Pratos Mais Pedidos
                </h2>
                <p className="text-muted-foreground">
                  Os favoritos da casa - rápidos, suculentos e bem servidos.
                </p>
              </div>
              <Link href="/menu">
                <Button variant="outline">Ver Cardápio</Button>
              </Link>
            </RevealOnScroll>

            <PopularCarousel />
          </div>
        </section>

        {/* ── Como Funciona ───────────────────────────────────────── */}
        <HowItWorks />

        {/* ── Sobre ───────────────────────────────────────────────── */}
        <SobreSection />

        {/* ── Categorias (dinâmicas) ──────────────────────────── */}
        <section id="categorias" className="py-12 md:py-16 px-4 md:px-6">
          <div className="mx-auto max-w-7xl space-y-6 md:space-y-8">
            <RevealOnScroll>
              <div>
                <h2 className="text-3xl font-display font-black text-foreground">Categorias</h2>
                <p className="text-muted-foreground">Encontre rápido o que procura.</p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll>
              <CategoriesGrid />
            </RevealOnScroll>
          </div>
        </section>

        {/* ── Destaques da Casa (dinâmico - só aparece se houver produtos em destaque) ── */}
        <FeaturedSection />

        {/* ── Testemunhos ─────────────────────────────────────────── */}
        <TestimonialsSection />

      </main>
      <Footer />
    </>
  );
}
