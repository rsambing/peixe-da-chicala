"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/mock/helpers";

const DELIVERY_FEE_KZ = 1000;

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { detailedLines, subtotalKz, setQuantity, removeItem, itemsCount } = useCart();

  useEffect(() => { setMounted(true); }, []);

  const lines = mounted ? detailedLines : [];
  const total = mounted ? subtotalKz + (lines.length ? DELIVERY_FEE_KZ : 0) : 0;
  const count = mounted ? itemsCount : 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-24 pb-16 px-4 md:px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Lista */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-display font-black text-gray-900">Carrinho</h1>
              <p className="text-gray-500 mt-1">
                {count ? `${count} item(s) no carrinho` : "O seu carrinho está vazio."}
              </p>
            </div>

            {!mounted ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : lines.length === 0 ? (
              <div className="py-12 text-center space-y-4">
                <p className="text-4xl">🛒</p>
                <p className="text-gray-400">Adicione pratos do cardápio para continuar.</p>
                <Link href="/menu">
                  <Button variant="primary">Ver Cardápio</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {lines.map((line) => (
                  <div key={line.itemId} className="flex gap-3 md:gap-4 items-center py-4 border-b border-gray-100 last:border-0">
                    <div className="relative size-20 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={line.item.imageUrl}
                        alt={line.item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="font-display font-black text-gray-900 truncate">{line.item.name}</p>
                      <p className="text-sm text-gray-400">{formatCurrency(line.item.priceKz)}</p>
                      {line.note && (
                        <p className="text-xs text-gray-400">Obs: {line.note}</p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="font-display font-black text-gray-900">
                        {formatCurrency(line.lineTotalKz)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.itemId, line.quantity - 1)}
                          className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold transition-colors"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-display font-black text-sm">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.itemId, line.quantity + 1)}
                          className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.itemId)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumo */}
          <aside>
            <div className="bg-gray-50 rounded-2xl p-6 space-y-5 sticky top-28">
              <h2 className="text-xl font-display font-black text-gray-900">Resumo</h2>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-display font-black">{formatCurrency(mounted ? subtotalKz : 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Taxa de entrega</span>
                  <span className="font-display font-black">
                    {formatCurrency(lines.length ? DELIVERY_FEE_KZ : 0)}
                  </span>
                </div>
                <div className="h-px bg-gray-200 my-1" />
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Total</span>
                  <span className="text-primary font-display font-black text-lg">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link href="/checkout">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={!lines.length}
                  >
                    Finalizar Pedido
                  </Button>
                </Link>

                <Link href="/menu">
                  <Button variant="outline" size="lg" className="w-full">
                    Continuar a Escolher
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </main>
      <Footer />
    </>
  );
}
