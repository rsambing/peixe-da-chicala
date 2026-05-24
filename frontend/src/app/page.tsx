import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { Button, Card, CardContent, Badge, RevealOnScroll } from "@/components/ui";
import { MENU_CATEGORIES, MENU_ITEMS } from "@/lib/menu";
import { MenuItemCard } from "@/components/features/menu/MenuItemCard";
import { HeroSection } from "./_components/HeroSection";

export default function Home() {
  const popular = MENU_ITEMS.filter((i) => i.tags?.includes("mais pedido")).slice(0, 3);

  return (
    <>
      <Header />
      <main>
        <HeroSection />

        {/* Mais pedidos */}
        <section id="mais-pedidos" className="py-16 px-6">
          <div className="mx-auto max-w-7xl space-y-6">
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

            <RevealOnScroll stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popular.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </RevealOnScroll>
          </div>
        </section>

        {/* Sobre */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <RevealOnScroll>
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

            <RevealOnScroll delay={0.15}>
              <Card className="h-full">
                <CardContent className="p-0 overflow-hidden h-full">
                  <div className="relative aspect-[16/10] bg-muted h-full min-h-[220px]">
                    <Image
                      src="https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=2200&q=80"
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

        {/* Categorias */}
        <section id="categorias" className="py-16 px-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <RevealOnScroll>
              <div>
                <h2 className="text-3xl font-display font-black text-foreground">Categorias</h2>
                <p className="text-muted-foreground">Encontre rápido o que procura.</p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {MENU_CATEGORIES.map((cat) => (
                <Link key={cat.id} href={`/menu?categoria=${encodeURIComponent(cat.id)}`}>
                  <Card className="hover:bg-muted/60 transition-colors">
                    <CardContent className="p-6 space-y-2">
                      <p className="font-display font-black text-foreground">{cat.name}</p>
                      <p className="text-sm text-muted-foreground">{cat.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </RevealOnScroll>
          </div>
        </section>

        {/* Promoções */}
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
                  <p className="text-xl font-display font-black text-foreground">
                    Brasa para 2
                  </p>
                  <p className="text-muted-foreground">
                    1 peixe grelhado + 2 bebidas + 2 extras.
                  </p>
                  <Link href="/menu">
                    <Button variant="accent">Fazer Pedido</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 space-y-3">
                  <Badge variant="primary">Promo</Badge>
                  <p className="text-xl font-display font-black text-foreground">
                    Marisco & Brasa
                  </p>
                  <p className="text-muted-foreground">
                    Camarão grelhado + extra piri-piri.
                  </p>
                  <Link href="/menu">
                    <Button variant="accent">Pedir agora</Button>
                  </Link>
                </CardContent>
              </Card>
            </RevealOnScroll>
          </div>
        </section>

        {/* Contactos */}
        <section id="contactos" className="py-16 px-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <RevealOnScroll className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-3xl font-display font-black text-foreground">Contactos</h2>
                <p className="text-muted-foreground">Localização, horário e atendimento.</p>
              </div>
              <Link href="/contactos">
                <Button variant="outline">Ver página</Button>
              </Link>
            </RevealOnScroll>

            <RevealOnScroll stagger className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Card>
                <CardContent className="p-6 space-y-3">
                  <p className="font-display font-black text-foreground">Peixe da Chicala</p>
                  <p className="text-sm text-muted-foreground">
                    Chicala, Luanda · 11:00 – 22:00
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Telefone/WhatsApp: (+244) 9XX XXX XXX
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link href="/menu" className="flex-1">
                      <Button variant="accent" className="w-full">
                        Fazer Pedido
                      </Button>
                    </Link>
                    <Link href="/acompanhar" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Acompanhar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-0 overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <iframe
                      title="Mapa"
                      className="w-full h-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src="https://www.google.com/maps?q=Chicala%2C%20Luanda&output=embed"
                    />
                  </div>
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
