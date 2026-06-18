"use client";

import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/lib/products-context";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=80";

const CATEGORY_ICONS: Record<string, string> = {
  "peixes-grelhados": "🐟",
  "pratos-tradicionais": "🍲",
  mariscos: "🦐",
  bebidas: "🥤",
  sobremesas: "🍮",
  extras: "➕",
};

export function CategoriesGrid() {
  const { categories, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) return null;

  // First category gets a 2-column wide "hero" card, rest get normal cards
  const [hero, ...rest] = categories;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Hero card — spans 2 cols + 2 rows */}
      <Link
        href={`/menu?categoria=${hero.id}`}
        className="group relative col-span-2 row-span-2 h-52 md:h-auto rounded-2xl overflow-hidden"
      >
        <Image
          src={hero.imageUrl || FALLBACK_IMAGE}
          alt={hero.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-primary/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 p-5 space-y-1">
          <p className="text-2xl mb-1">{CATEGORY_ICONS[hero.id] ?? "🍽️"}</p>
          <p className="font-display font-black text-white text-xl leading-tight">{hero.name}</p>
        </div>
      </Link>

      {/* Remaining categories */}
      {rest.map((cat) => (
        <Link
          key={cat.id}
          href={`/menu?categoria=${cat.id}`}
          className="group relative h-40 md:h-[185px] rounded-2xl overflow-hidden"
        >
          <Image
            src={cat.imageUrl || FALLBACK_IMAGE}
            alt={cat.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <p className="text-lg mb-0.5">{CATEGORY_ICONS[cat.id] ?? "🍽️"}</p>
            <p className="font-display font-black text-white text-sm leading-tight">{cat.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
