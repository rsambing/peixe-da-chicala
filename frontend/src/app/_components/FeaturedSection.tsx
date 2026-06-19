"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { api } from "@/lib/api";
import type { ApiProduct } from "@/lib/api-types";

function fmt(n: number) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(n);
}

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80";

function FeaturedCard({ product }: { product: ApiProduct }) {
  const imgUrl = product.images?.[0]?.imageUrl ?? product.imageUrl ?? PLACEHOLDER;

  return (
    <Link
      href={`/menu/${product.id}`}
      className="group relative h-[300px] md:h-[380px] rounded-2xl overflow-hidden block"
    >
      <Image
        src={imgUrl}
        alt={product.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
        unoptimized={imgUrl.includes("ibb.co")}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      <div className="absolute top-4 left-4">
        <span className="inline-flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm text-white text-xs font-display font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
          <span className="size-1.5 rounded-full bg-white" />
          Destaque
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 space-y-3">
        <div>
          <h3 className="font-display font-black text-white text-xl md:text-2xl leading-tight mb-2">
            {product.name}
          </h3>
          <p className="text-white/70 text-sm line-clamp-2">{product.description}</p>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/15">
          <span className="font-display font-black text-white text-lg md:text-xl">{fmt(product.price)}</span>
          <span className="inline-flex items-center gap-1.5 bg-white text-foreground text-sm font-display font-black px-4 py-2 rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            Pedir 
          </span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedSection() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFeaturedProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Don't render the section at all if no featured products
  if (!loading && products.length === 0) return null;

  return (
    <section className="py-12 md:py-16 px-4 md:px-6">
      <div className="mx-auto max-w-7xl space-y-6 md:space-y-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-display font-black text-foreground">
              Destaques da Casa
            </h2>
            <p className="text-muted-foreground">Os pratos que não podes perder.</p>
          </div>
          <Link href="/menu">
            <Button variant="outline">Ver tudo</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="h-[300px] md:h-[380px] rounded-2xl bg-muted animate-pulse" />
            <div className="h-[300px] md:h-[380px] rounded-2xl bg-muted animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {products.slice(0, 4).map((p) => (
              <FeaturedCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
