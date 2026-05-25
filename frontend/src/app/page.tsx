import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { Fish, Utensils, Waves, Coffee, Cookie, Plus } from "lucide-react";
import { Button, Card, CardContent, Badge, RevealOnScroll } from "@/components/ui";
import { MENU_CATEGORIES, MENU_ITEMS } from "@/lib/menu";
import { HeroSection } from "./_components/HeroSection";
import { PopularCard } from "./_components/PopularCard";
import { SobreSection } from "./_components/SobreSection";
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

          {/* Marquee — full bleed. w-max é obrigatório para translateX(-50%) ser calculado
              em relação ao conteúdo e não ao viewport */}
          <div className="mt-6 overflow-hidden">
            <div className="flex gap-4 w-max animate-marquee pl-6 hover:[animation-play-state:paused]">
              {[...popular, ...popular].map((item, i) => (
                <PopularCard key={`${item.id}-${i}`} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Sobre ───────────────────────────────────────────────── */}
        <SobreSection />

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
