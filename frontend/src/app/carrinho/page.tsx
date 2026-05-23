"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button, Card, CardContent, Input, Badge } from "@/components/ui";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/mock/helpers";

const DELIVERY_FEE_KZ = 1000;

export default function CartPage() {
  const { detailedLines, subtotalKz, setQuantity, removeItem, itemsCount } = useCart();

  const totalKz = subtotalKz + (detailedLines.length ? DELIVERY_FEE_KZ : 0);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <header>
              <h1 className="text-3xl font-display font-black text-foreground">Carrinho</h1>
              <p className="text-muted-foreground">
                {itemsCount ? `${itemsCount} item(s) no carrinho` : "O seu carrinho está vazio."}
              </p>
            </header>

            {detailedLines.length === 0 ? (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <p className="text-muted-foreground">Adicione pratos do cardápio para continuar.</p>
                  <Link href="/menu">
                    <Button variant="primary">Ver Cardápio</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {detailedLines.map((line) => (
                  <Card key={line.itemId}>
                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-black text-foreground truncate">
                          {line.item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(line.item.priceKz)} · {line.item.shortDesc}
                        </p>
                        {line.note && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Observações: {line.note}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={1}
                          value={String(line.quantity)}
                          onChange={(e) => setQuantity(line.itemId, parseInt(e.target.value || "1"))}
                          className="w-24"
                        />
                        <Badge variant="default">{formatCurrency(line.lineTotalKz)}</Badge>
                        <Button variant="ghost" size="sm" onClick={() => removeItem(line.itemId)}>
                          Remover
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-3">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-display font-black text-foreground">Resumo</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-display font-black">{formatCurrency(subtotalKz)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Taxa de entrega</span>
                    <span className="font-display font-black">
                      {detailedLines.length ? formatCurrency(DELIVERY_FEE_KZ) : formatCurrency(0)}
                    </span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-primary font-display font-black text-lg">
                      {formatCurrency(totalKz)}
                    </span>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button variant="accent" size="lg" className="w-full" disabled={!detailedLines.length}>
                    Finalizar Pedido
                  </Button>
                </Link>

                <Link href="/menu">
                  <Button variant="outline" size="lg" className="w-full">
                    Continuar a Escolher
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
