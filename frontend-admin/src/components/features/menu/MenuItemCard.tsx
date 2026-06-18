"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/menu";
import { formatCurrency } from "@/lib/mock/helpers";
import { useCart } from "@/lib/cart-context";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!item.isAvailable) return;
    addItem(item.id, 1);
    if (btnRef.current) {
      gsap.fromTo(btnRef.current, { scale: 0.82 }, { scale: 1, duration: 0.55, ease: "elastic.out(1, 0.4)" });
    }
  }

  return (
    <Link href={`/menu/${item.id}`} className="block group">
      <div
        className={cn(
          "relative aspect-[4/3] rounded-2xl overflow-hidden",
          !item.isAvailable && "opacity-60"
        )}
      >
        {/* Image */}
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        {/* Indisponível */}
        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-black/60 text-white font-display font-black px-4 py-2 rounded-full text-sm">
              Indisponível
            </span>
          </div>
        )}

        {/* Badge topo esquerdo */}
        {(item.tags?.includes("mais pedido") || item.tags?.includes("recomendado")) && (
          <div className="absolute top-3 left-3">
            <Badge variant={item.tags.includes("mais pedido") ? "accent" : "primary"}>
              {item.tags.includes("mais pedido") ? "Mais pedido" : "Recomendado"}
            </Badge>
          </div>
        )}

        {/* Conteúdo em baixo */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2.5">
          {/* Texto */}
          <div className="space-y-0.5">
            <h3 className="font-display font-black text-white leading-tight drop-shadow-sm">
              {item.name}
            </h3>
            <p className="text-sm text-white/65 line-clamp-1">{item.shortDesc}</p>
          </div>

          {/* Preço + botão */}
          <div className="flex items-center justify-between gap-3">
            <span className="font-display font-black text-accent text-lg leading-none">
              {formatCurrency(item.priceKz)}
            </span>
            <button
              ref={btnRef}
              type="button"
              disabled={!item.isAvailable}
              onClick={handleAdd}
              className="rounded-full font-display font-bold text-sm h-9 px-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors disabled:pointer-events-none disabled:opacity-50 shrink-0"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
