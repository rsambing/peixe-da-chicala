"use client";

import Image from "next/image";
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
      <main className="min-h-screen pt-24 pb-16 px-4 md:px-6">
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
                    <CardContent className="p-3 md:p-4 flex gap-3 md:gap-4 items-center">
                      {/* Imagem do prato */}
                      <div className="relative size-20 shrink-0 rounded-xl overflow-hidden bg-muted">
                        <Image
                          src={line.item.imageUrl}
                          alt={line.item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="font-display font-black text-foreground truncate">
                          {line.item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(line.item.priceKz)} · {line.item.shortDesc}
                        </p>
                        {line.note && (
                          <p className="text-xs text-muted-foreground">
                            Obs: {line.note}
                          </p>
                        )}
                      </div>

                      {/* Quantidade + total + remover */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge variant="default">{formatCurrency(line.lineTotalKz)}</Badge>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setQuantity(line.itemId, line.quantity - 1)}
                            className="size-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-sm font-bold transition-colors"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-display font-black text-sm">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(line.itemId, line.quantity + 1)}
                            className="size-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-sm font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(line.itemId)}
                          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          Remover
                        </button>
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
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={!detailedLines.length}
                  >
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
