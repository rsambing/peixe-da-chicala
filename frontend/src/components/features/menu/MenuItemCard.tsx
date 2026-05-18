"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, Badge, Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/menu";
import { formatCurrency } from "@/lib/mock/helpers";
import { useCart } from "@/lib/cart-context";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();

  return (
    <Card className={cn(!item.isAvailable && "opacity-60")}> 
      <CardContent className="p-0">
        <Link href={`/menu/${item.id}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-muted">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
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

          <Button
            type="button"
            variant="accent"
            size="sm"
            className="w-full"
            disabled={!item.isAvailable}
            onClick={() => addItem(item.id, 1)}
          >
            Adicionar ao Carrinho
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
