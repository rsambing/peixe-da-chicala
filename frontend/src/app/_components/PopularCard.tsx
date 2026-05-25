"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { Card, CardContent } from "@/components/ui";
import type { MenuItem } from "@/lib/menu";
import { formatCurrency } from "@/lib/mock/helpers";
import { useCart } from "@/lib/cart-context";

export function PopularCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem(item.id, 1);
    if (btnRef.current) {
      gsap.fromTo(btnRef.current, { scale: 0.85 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    }
  }

  return (
    <Link href={`/menu/${item.id}`} className="block shrink-0 w-44">
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative w-full aspect-square bg-muted">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="176px"
            />
          </div>

          {/* Info */}
          <div className="p-3 space-y-2">
            <p className="font-display font-black text-sm text-foreground leading-tight line-clamp-1">
              {item.name}
            </p>
            <div className="flex items-center justify-between gap-2">
              <span className="font-display font-black text-primary text-sm">
                {formatCurrency(item.priceKz)}
              </span>
              <button
                ref={btnRef}
                type="button"
                onClick={handleAdd}
                disabled={!item.isAvailable}
                className="size-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-base font-bold leading-none disabled:opacity-50 disabled:pointer-events-none hover:bg-accent/90 transition-colors"
                aria-label={`Adicionar ${item.name}`}
              >
                +
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
