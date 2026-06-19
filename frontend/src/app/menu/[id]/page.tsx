"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button, Card, CardContent, Badge } from "@/components/ui";
import { useProducts } from "@/lib/products-context";
import { formatCurrency } from "@/lib/mock/helpers";
import { useCart } from "@/lib/cart-context";
import { MenuItemCard } from "@/components/features/menu/MenuItemCard";

const PLACEHOLDER = "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80";

function ImageCarousel({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);

  // Auto-advance
  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(next, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [images.length, next]);

  // Reset timer on manual nav
  function manualGo(index: number) {
    setActive(index);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 4000);
  }

  if (images.length === 0) return null;

  return (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 select-none">
      {images.map((src, i) => (
        <div
          key={src}
          className={[
            "absolute inset-0 transition-opacity duration-500",
            i === active ? "opacity-100 z-10" : "opacity-0 z-0",
          ].join(" ")}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Arrows — only if more than 1 image */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => manualGo((active - 1 + images.length) % images.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => manualGo((active + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => manualGo(i)}
                className={[
                  "rounded-full transition-all duration-300",
                  i === active ? "w-5 h-2 bg-white" : "size-2 bg-white/50 hover:bg-white/80",
                ].join(" ")}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function MenuItemDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { products, isLoading } = useProducts();

  const item = useMemo(() => products.find((p) => p.id === id), [products, id]);
  const relatedItems = useMemo(
    () => item ? products.filter((p) => p.categoryId === item.categoryId && p.id !== item.id).slice(0, 4) : [],
    [products, item]
  );

  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-24 pb-16 px-4 md:px-6">
          <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-[4/3] rounded-2xl bg-gray-100 animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-100 rounded-xl animate-pulse w-3/4" />
              <div className="h-4 bg-gray-100 rounded-xl animate-pulse w-full" />
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
        <main className="min-h-screen bg-white pt-24 pb-16 px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center py-20">
            <p className="text-5xl mb-4">🍽️</p>
            <h1 className="text-2xl font-display font-black text-gray-900 mb-2">Prato não encontrado</h1>
            <p className="text-gray-500 mb-6">Este prato pode ter sido removido do cardápio.</p>
            <Link href="/menu">
              <Button variant="primary">Voltar ao Cardápio</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const images = item.images?.length ? item.images : [item.imageUrl || PLACEHOLDER];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-24 pb-16 px-4 md:px-6">
        <div className="mx-auto max-w-5xl space-y-12">

          {/* Back */}
          <Link href="/menu" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
            <ChevronLeft className="size-4" /> Voltar ao Cardápio
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Carousel */}
            <ImageCarousel images={images} />

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-display font-black text-gray-900 leading-tight">
                  {item.name}
                </h1>
                <p className="text-2xl font-display font-black text-primary mt-2">
                  {formatCurrency(item.priceKz)}
                </p>
                {!item.isAvailable && (
                  <Badge variant="warning" className="mt-2">Indisponível</Badge>
                )}
                <p className="text-gray-500 mt-3 leading-relaxed">{item.description}</p>
              </div>

              {/* Quantity + note + CTA */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-600">Quantidade</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="size-9 rounded-full border border-gray-200 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-display font-black text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="size-9 rounded-full border border-gray-200 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="ml-auto font-display font-black text-gray-900">
                    {formatCurrency(item.priceKz * quantity)}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Observações (opcional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ex.: mais picante, sem cebola, bem passado..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    disabled={!item.isAvailable}
                    onClick={() => addItem(item.id, quantity, note.trim() || undefined)}
                    className="flex-1 h-14 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none text-white font-display font-bold text-base transition-colors"
                  >
                    + Adicionar ao Carrinho
                  </button>
                  <Link href="/carrinho" className="flex-1">
                    <button className="w-full h-14 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-800 font-display font-bold text-base transition-colors">
                      Ver Carrinho
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related */}
          {relatedItems.length > 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-display font-black text-gray-900">
                Outros da mesma categoria
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedItems.map((related) => (
                  <MenuItemCard key={related.id} item={related} />
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
