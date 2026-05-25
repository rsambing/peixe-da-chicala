"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import type { MenuItem } from "@/lib/menu";
import { formatCurrency } from "@/lib/mock/helpers";
import { useCart } from "@/lib/cart-context";

export function PopularCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(item.id, 1);
    if (btnRef.current) {
      gsap.fromTo(btnRef.current, { scale: 0.78 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    }
  }

  return (
    <Link href={`/menu/${item.id}`} className="block shrink-0 w-44 group">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
        {/* Image */}
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="176px"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Conteúdo em baixo */}
        <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
          <p className="font-display font-black text-white text-sm leading-tight line-clamp-1 drop-shadow-sm">
            {item.name}
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="font-display font-black text-accent text-sm leading-none">
              {formatCurrency(item.priceKz)}
            </span>
            <button
              ref={btnRef}
              type="button"
              onClick={handleAdd}
              disabled={!item.isAvailable}
              aria-label={`Adicionar ${item.name}`}
              className="size-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-base font-bold leading-none hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:pointer-events-none shrink-0"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
