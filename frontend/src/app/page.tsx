import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { Button, RevealOnScroll } from "@/components/ui";
import { HeroSection } from "./_components/HeroSection";
import { PopularCarousel } from "./_components/PopularCarousel";
import { HowItWorks } from "./_components/HowItWorks";
import { SobreSection } from "./_components/SobreSection";
import { TestimonialsSection } from "./_components/TestimonialsSection";
import { CategoriesGrid } from "./_components/CategoriesGrid";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />

        {/* ── Pratos Mais Pedidos ──────────────────────────────────── */}
        <section id="mais-pedidos" className="py-16">
          <div className="mx-auto max-w-7xl px-6 space-y-6">
            <RevealOnScroll className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-3xl font-display font-black text-foreground">
                  Pratos Mais Pedidos
                </h2>
                <p className="text-muted-foreground">
                  Os favoritos da casa — rápidos, suculentos e bem servidos.
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
        <section id="categorias" className="py-16 px-6">
          <div className="mx-auto max-w-7xl space-y-8">
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

        {/* ── Combos e Promoções ──────────────────────────────────── */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-7xl space-y-8">
            <RevealOnScroll className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-3xl font-display font-black text-foreground">
                  Combos e Promoções
                </h2>
                <p className="text-muted-foreground">Perfeito para partilhar.</p>
              </div>
              <Link href="/menu">
                <Button variant="outline">Ver tudo</Button>
              </Link>
            </RevealOnScroll>

            <RevealOnScroll stagger className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Combo: Brasa para 2 */}
              <Link href="/menu" className="group relative h-[380px] rounded-2xl overflow-hidden block">
                <Image
                  src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=80"
                  alt="Brasa para 2"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 bg-accent/90 backdrop-blur-sm text-white text-xs font-display font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    <span className="size-1.5 rounded-full bg-white" />
                    Combo
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                  <div>
                    <h3 className="font-display font-black text-white text-2xl leading-tight mb-3">
                      Brasa para 2
                    </h3>
                    <ul className="space-y-1.5">
                      {["1 peixe grelhado", "2 bebidas", "2 extras"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-white/75 text-sm">
                          <span className="size-1 rounded-full bg-accent flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/15">
                    <span className="font-display font-black text-white text-xl">Kz 9.500</span>
                    <span className="inline-flex items-center gap-1.5 bg-white text-foreground text-sm font-display font-black px-4 py-2 rounded-full group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                      Pedir <span className="group-hover:translate-x-0.5 inline-block transition-transform duration-300"></span>
                    </span>
                  </div>
                </div>
              </Link>

              {/* Promo: Marisco & Brasa */}
              <Link href="/menu" className="group relative h-[380px] rounded-2xl overflow-hidden block">
                <Image
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
                  alt="Marisco & Brasa"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm text-white text-xs font-display font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    <span className="size-1.5 rounded-full bg-white" />
                    Promo
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                  <div>
                    <h3 className="font-display font-black text-white text-2xl leading-tight mb-3">
                      Marisco & Brasa
                    </h3>
                    <ul className="space-y-1.5">
                      {["Camarão grelhado", "Extra piri-piri"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-white/75 text-sm">
                          <span className="size-1 rounded-full bg-accent flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/15">
                    <span className="font-display font-black text-white text-xl">Kz 7.200</span>
                    <span className="inline-flex items-center gap-1.5 bg-white text-foreground text-sm font-display font-black px-4 py-2 rounded-full group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                      Pedir <span className="group-hover:translate-x-0.5 inline-block transition-transform duration-300"></span>
                    </span>
                  </div>
                </div>
              </Link>

            </RevealOnScroll>
          </div>
        </section>

        {/* ── Testemunhos ─────────────────────────────────────────── */}
        <TestimonialsSection />

      </main>
      <Footer />
    </>
  );
}
