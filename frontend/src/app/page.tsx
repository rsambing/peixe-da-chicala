import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { Fish, Utensils, Waves, Coffee, Cookie, Plus } from "lucide-react";
import { Button, RevealOnScroll } from "@/components/ui";
import { HeroSection } from "./_components/HeroSection";
import { PopularCarousel } from "./_components/PopularCarousel";
import { HowItWorks } from "./_components/HowItWorks";
import { SobreSection } from "./_components/SobreSection";
import { TestimonialsSection } from "./_components/TestimonialsSection";

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

        {/* ── Categorias (bento grid) ──────────────────────────── */}
        <section id="categorias" className="py-16 px-6">
          <div className="mx-auto max-w-7xl space-y-8">
            <RevealOnScroll>
              <div>
                <h2 className="text-3xl font-display font-black text-foreground">Categorias</h2>
                <p className="text-muted-foreground">Encontre rápido o que procura.</p>
              </div>
            </RevealOnScroll>

            {/*
              Bento layout (desktop 4 cols):
                Col 1-2 / Rows 1-2: Peixes Grelhados (grande)
                Col 3   / Row  1  : Mariscos
                Col 4   / Rows 1-2: Pratos Tradicionais
                Col 3   / Row  2  : Bebidas
                Col 1   / Row  3  : Sobremesas
                Col 2-4 / Row  3  : Extras
            */}
            <RevealOnScroll className="grid grid-cols-2 md:grid-cols-4 gap-3">

              {/* 1. Peixes Grelhados — destaque */}
              <Link
                href="/menu?categoria=peixes-grelhados"
                className="group relative col-span-2 h-52 md:h-auto md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden"
              >
                <Image
                  src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=80"
                  alt="Peixes Grelhados"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-0 bg-primary/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 p-5 space-y-1">
                  <Fish className="size-6 text-accent mb-2" />
                  <p className="font-display font-black text-white text-xl leading-tight">Peixes Grelhados</p>
                  <p className="text-white/65 text-sm hidden md:block">Frescos, bem temperados e no ponto.</p>
                </div>
              </Link>

              {/* 2. Mariscos */}
              <Link
                href="/menu?categoria=mariscos"
                className="group relative h-40 md:h-[185px] rounded-2xl overflow-hidden"
              >
                <Image
                  src="https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80"
                  alt="Mariscos"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <Waves className="size-5 text-accent mb-1.5" />
                  <p className="font-display font-black text-white text-sm leading-tight">Mariscos</p>
                </div>
              </Link>

              {/* 3. Pratos Tradicionais — tall */}
              <Link
                href="/menu?categoria=pratos-tradicionais"
                className="group relative h-40 md:h-auto md:row-span-2 rounded-2xl overflow-hidden"
              >
                <Image
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80"
                  alt="Pratos Tradicionais"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 space-y-1">
                  <Utensils className="size-5 text-accent mb-1.5" />
                  <p className="font-display font-black text-white text-sm leading-tight">Pratos Tradicionais</p>
                  <p className="text-white/60 text-xs hidden md:block">Sabor caseiro com toque da casa.</p>
                </div>
              </Link>

              {/* 4. Bebidas */}
              <Link
                href="/menu?categoria=bebidas"
                className="group relative h-40 md:h-[185px] rounded-2xl overflow-hidden"
              >
                <Image
                  src="https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80"
                  alt="Bebidas"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <Coffee className="size-5 text-accent mb-1.5" />
                  <p className="font-display font-black text-white text-sm leading-tight">Bebidas</p>
                </div>
              </Link>

              {/* 5. Sobremesas */}
              <Link
                href="/menu?categoria=sobremesas"
                className="group relative h-40 md:h-[165px] rounded-2xl overflow-hidden"
              >
                <Image
                  src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80"
                  alt="Sobremesas"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <Cookie className="size-5 text-accent mb-1.5" />
                  <p className="font-display font-black text-white text-sm leading-tight">Sobremesas</p>
                </div>
              </Link>

              {/* 6. Extras — largo */}
              <Link
                href="/menu?categoria=extras"
                className="group relative col-span-1 md:col-span-3 h-40 md:h-[165px] rounded-2xl overflow-hidden"
              >
                <Image
                  src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80"
                  alt="Extras"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 75vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 md:p-5">
                  <Plus className="size-5 text-accent mb-1.5" />
                  <p className="font-display font-black text-white text-sm leading-tight">Extras</p>
                  <p className="text-white/60 text-xs hidden md:block">Acompanhamentos e molhos.</p>
                </div>
              </Link>

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
                      Pedir <span className="group-hover:translate-x-0.5 inline-block transition-transform duration-300">→</span>
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
                      Pedir <span className="group-hover:translate-x-0.5 inline-block transition-transform duration-300">→</span>
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
