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

        {/* ── Testemunhos ─────────────────────────────────────────── */}
        <TestimonialsSection />

        {/* ── Destaques da Casa (dinâmico - só aparece se houver produtos em destaque) ── */}
        <FeaturedSection />

        {/* ── CTA Final ───────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-zinc-950 py-24 md:py-36 px-6">
          {/* Glow blobs */}
          <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-primary/25 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/15 blur-[80px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary/10 blur-[80px]" />

          <div className="relative mx-auto max-w-4xl text-center space-y-8">
            <p className="text-accent font-display font-bold tracking-widest uppercase text-sm">
              Pronto para pedir?
            </p>

            <h2 className="font-display font-black text-5xl sm:text-6xl md:text-7xl text-white leading-[1.0] tracking-tight">
              Peixe na brasa,{" "}
              <span className="text-primary">entregue</span>
              <br />
              até ti.
            </h2>

            <p className="text-white/55 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Escolhe o teu prato, confirma o pedido e acompanha tudo com um código único - sem apps, sem complicações.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/menu">
                <Button variant="primary" size="xl" className="px-12 shadow-lg shadow-primary/30">
                  Fazer Pedido Agora
                </Button>
              </Link>
              <Link href="/acompanhar">
                <Button
                  variant="outline"
                  size="xl"
                  className="px-10 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                >
                  Acompanhar Pedido
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
