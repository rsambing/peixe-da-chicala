"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button, Card, CardContent, Input, Textarea, Badge } from "@/components/ui";
import { useProducts } from "@/lib/products-context";
import { formatCurrency } from "@/lib/mock/helpers";
import { useCart } from "@/lib/cart-context";

export default function MenuItemDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { products, isLoading } = useProducts();

  const item = useMemo(() => products.find((p) => p.id === id), [products, id]);

  const relatedItems = useMemo(
    () =>
      item
        ? products.filter((p) => p.categoryId === item.categoryId && p.id !== item.id).slice(0, 4)
        : [],
    [products, item]
  );

  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 px-6">
          <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded-xl animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded-xl animate-pulse w-full" />
              <div className="h-4 bg-muted rounded-xl animate-pulse w-2/3" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 px-6">
          <div className="mx-auto max-w-3xl">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h1 className="text-2xl font-display font-black">Item não encontrado</h1>
                <p className="text-muted-foreground">
                  Este prato pode ter sido removido do cardápio.
                </p>
                <Link href="/menu">
                  <Button variant="primary">Voltar ao Cardápio</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Link href="/menu" className="text-sm text-muted-foreground hover:text-foreground">
                  ← Voltar ao Cardápio
                </Link>
                <div className="flex items-start justify-between gap-4 mt-3">
                  <div>
                    <h1 className="text-3xl font-display font-black text-foreground">
                      {item.name}
                    </h1>
                    <p className="text-muted-foreground mt-2">{item.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-2xl font-display font-black text-primary">
                      {formatCurrency(item.priceKz)}
                    </p>
                    {!item.isAvailable && <Badge variant="warning">Indisponível</Badge>}
                  </div>
                </div>
              </div>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Quantidade"
                      type="number"
                      min={1}
                      value={String(quantity)}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || "1")))}
                    />
                    <Input
                      label="Total"
                      value={formatCurrency(item.priceKz * quantity)}
                      readOnly
                    />
                  </div>

                  <Textarea
                    label="Observações (opcional)"
                    placeholder="Ex.: mais picante, sem cebola, bem passado..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="accent"
                      size="lg"
                      className="flex-1"
                      disabled={!item.isAvailable}
                      onClick={() => addItem(item.id, quantity, note.trim() || undefined)}
                    >
                      Adicionar ao Carrinho
                    </Button>
                    <Link href="/carrinho" className="flex-1">
                      <Button variant="outline" size="lg" className="w-full">
                        Ver Carrinho
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {relatedItems.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-display font-black text-foreground">
                Outros da mesma categoria
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedItems.map((related) => (
                  <Link
                    key={related.id}
                    href={`/menu/${related.id}`}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted"
                  >
                    <Image
                      src={related.imageUrl}
                      alt={related.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
                      <p className="font-display font-black text-white text-sm leading-tight">
                        {related.name}
                      </p>
                      <p className="font-display font-black text-accent text-sm">
                        {formatCurrency(related.priceKz)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
