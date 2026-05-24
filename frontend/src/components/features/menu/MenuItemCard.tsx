"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/menu";
import { formatCurrency } from "@/lib/mock/helpers";
import { useCart } from "@/lib/cart-context";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleAdd() {
    addItem(item.id, 1);
    if (btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { scale: 0.88 },
        { scale: 1, duration: 0.55, ease: "elastic.out(1, 0.4)" }
      );
    }
  }

  return (
    <Card className={cn(!item.isAvailable && "opacity-60")}>
      <CardContent className="p-0">
        <Link href={`/menu/${item.id}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-muted">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {!item.isAvailable && (
              <div className="absolute inset-0 bg-black/60 text-white flex items-center justify-center font-display font-black">
                Indisponível
              </div>
            )}
            {item.tags?.includes("mais pedido") && (
              <div className="absolute top-3 left-3">
                <Badge variant="accent">Mais pedido</Badge>
              </div>
            )}
            {item.tags?.includes("recomendado") && (
              <div className="absolute top-3 left-3">
                <Badge variant="primary">Recomendado</Badge>
              </div>
            )}
          </div>
        </Link>

        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display font-black text-foreground leading-tight truncate">
                {item.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.shortDesc}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display font-black text-primary">
                {formatCurrency(item.priceKz)}
              </p>
            </div>
          </div>

          <button
            ref={btnRef}
            type="button"
            disabled={!item.isAvailable}
            onClick={handleAdd}
            className={cn(
              "w-full rounded-full font-display font-bold text-sm h-9 px-4 transition-colors",
              "bg-accent text-accent-foreground hover:bg-accent/90",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
