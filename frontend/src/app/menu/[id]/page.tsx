"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button, Card, CardContent, Input, Textarea, Badge } from "@/components/ui";
import { getMenuItemById, getMenuItemsByCategory } from "@/lib/menu";
import { formatCurrency } from "@/lib/mock/helpers";
import { useCart } from "@/lib/cart-context";

export default function MenuItemDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const item = useMemo(() => getMenuItemById(id), [id]);

  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const suggestedExtras = useMemo(() => {
    if (!item?.recommendedExtraIds?.length) return [];
    const extras = getMenuItemsByCategory("extras");
    return item.recommendedExtraIds
      .map((extraId) => extras.find((e) => e.id === extraId))
      .filter(Boolean);
  }, [item]);

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
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              <Link
                href="/menu"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
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
                {item.ingredients?.length ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Ingredientes</p>
                    <div className="flex flex-wrap gap-2">
                      {item.ingredients.map((ing) => (
                        <Badge key={ing} variant="default">
                          {ing}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}

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

                {suggestedExtras.length ? (
                  <div className="pt-2 space-y-3">
                    <p className="text-sm font-medium text-foreground">Sugestões de extras</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {suggestedExtras.map((extra) => (
                        <button
                          key={extra!.id}
                          type="button"
                          onClick={() => addItem(extra!.id, 1)}
                          className="text-left rounded-xl border border-border bg-muted hover:bg-muted/80 transition-colors p-3"
                        >
                          <p className="font-display font-black text-foreground">
                            {extra!.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(extra!.priceKz)}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
