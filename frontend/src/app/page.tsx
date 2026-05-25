import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { Fish, Utensils, Waves, Coffee, Cookie, Plus } from "lucide-react";
import { Button, Card, CardContent, Badge, RevealOnScroll } from "@/components/ui";
import { MENU_CATEGORIES, MENU_ITEMS } from "@/lib/menu";
import { HeroSection } from "./_components/HeroSection";
import { PopularCard } from "./_components/PopularCard";
import type { MenuCategoryId } from "@/lib/menu";

const CATEGORY_ICONS: Record<MenuCategoryId, React.ElementType> = {
  "peixes-grelhados":    Fish,
  "pratos-tradicionais": Utensils,
  "mariscos":            Waves,
  "bebidas":             Coffee,
  "sobremesas":          Cookie,
  "extras":              Plus,
};

export default function Home() {
  const popular = MENU_ITEMS.filter((i) => i.tags?.includes("mais pedido"));

  return (
    <>
      <Header />
      <main>
        <HeroSection />

        {/* ── Pratos Mais Pedidos ──────────────────────────────────── */}
        <section id="mais-pedidos" className="py-16 overflow-hidden">
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
          </div>

          {/* Marquee — full bleed, sem padding lateral */}
          <div className="mt-6 overflow-hidden">
            <div className="flex gap-4 animate-marquee pl-6 hover:[animation-play-state:paused]">
              {[...popular, ...popular].map((item, i) => (
                <PopularCard key={`${item.id}-${i}`} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Sobre ───────────────────────────────────────────────── */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <RevealOnScroll className="h-full">
              <Card className="h-full">
                <CardContent className="p-8 space-y-4">
                  <Badge variant="primary">Sobre o restaurante</Badge>
                  <h2 className="text-3xl font-display font-black text-foreground">
                    O sabor da brasa, com tempero da casa
                  </h2>
                  <p className="text-muted-foreground">
                    No Peixe da Chicala, trabalhamos com ingredientes frescos e grelha no ponto.
                    O nosso objetivo é simples: servir bem e entregar rápido.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/menu" className="flex-1">
                      <Button variant="accent" size="lg" className="w-full">
                        Abrir Cardápio
                      </Button>
                    </Link>
                    <Link href="/acompanhar" className="flex-1">
                      <Button variant="outline" size="lg" className="w-full">
                        Acompanhar Pedido
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </RevealOnScroll>

            {/* overflow-hidden no Card garante que a imagem respeita o border-radius */}
            <RevealOnScroll delay={0.15} className="h-full">
              <Card className="h-full overflow-hidden">
                <CardContent className="p-0 h-full">
                  <div className="relative h-full min-h-[260px]">
                    <Image
                      src="https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80"
                      alt="Grelha e carvão"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </CardContent>
              </Card>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── Categorias ──────────────────────────────────────────── */}
        <section id="categorias" className="py-16 px-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <RevealOnScroll>
              <div>
                <h2 className="text-3xl font-display font-black text-foreground">Categorias</h2>
                <p className="text-muted-foreground">Encontre rápido o que procura.</p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {MENU_CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.id];
                return (
                  <Link key={cat.id} href={`/menu?categoria=${encodeURIComponent(cat.id)}`}>
                    <Card className="hover:bg-muted/60 transition-colors group h-full">
                      <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                        <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="size-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-display font-black text-sm text-foreground leading-snug">
                            {cat.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                            {cat.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </RevealOnScroll>
          </div>
        </section>

        {/* ── Combos e Promoções ──────────────────────────────────── */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-7xl space-y-6">
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
              <Card>
                <CardContent className="p-6 space-y-3">
                  <Badge variant="accent">Combo</Badge>
                  <p className="text-xl font-display font-black text-foreground">Brasa para 2</p>
                  <p className="text-muted-foreground">1 peixe grelhado + 2 bebidas + 2 extras.</p>
                  <Link href="/menu">
                    <Button variant="accent">Fazer Pedido</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-3">
                  <Badge variant="primary">Promo</Badge>
                  <p className="text-xl font-display font-black text-foreground">Marisco & Brasa</p>
                  <p className="text-muted-foreground">Camarão grelhado + extra piri-piri.</p>
                  <Link href="/menu">
                    <Button variant="accent">Pedir agora</Button>
                  </Link>
                </CardContent>
              </Card>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
