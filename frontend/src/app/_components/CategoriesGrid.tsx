"use client";

import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/lib/products-context";
import type { MenuCategory } from "@/lib/menu/types";

const FALLBACK =
  "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=80";

const ICONS: Record<string, string> = {
  "peixes-grelhados": "🐟",
  "pratos-tradicionais": "🍲",
  mariscos: "🦐",
  bebidas: "🥤",
  sobremesas: "🍮",
  extras: "➕",
};

function CategoryCard({
  cat,
  className = "",
}: {
  cat: MenuCategory;
  className?: string;
}) {
  return (
    <Link
      href={`/menu?categoria=${cat.id}`}
      className={`group relative rounded-2xl overflow-hidden ${className}`}
    >
      <Image
        src={cat.imageUrl || FALLBACK}
        alt={cat.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 25vw"
        unoptimized={cat.imageUrl?.includes("ibb.co")}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 p-4 space-y-0.5">
        <p className="text-lg leading-none mb-1">{ICONS[cat.id] ?? "🍽️"}</p>
        <p className="font-display font-black text-white text-sm leading-tight">{cat.name}</p>
      </div>
    </Link>
  );
}

function HeroCard({ cat }: { cat: MenuCategory }) {
  return (
    <Link
      href={`/menu?categoria=${cat.id}`}
      className="group relative col-span-2 row-span-2 rounded-2xl overflow-hidden"
    >
      <Image
        src={cat.imageUrl || FALLBACK}
        alt={cat.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
        unoptimized={cat.imageUrl?.includes("ibb.co")}
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute inset-0 bg-primary/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 p-5 space-y-1">
        <p className="text-2xl mb-1">{ICONS[cat.id] ?? "🍽️"}</p>
        <p className="font-display font-black text-white text-xl leading-tight">{cat.name}</p>
      </div>
    </Link>
  );
}

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

  const n = categories.length;
  if (n === 0) return null;

  const [a, b, c, d, e, f, ...rest] = categories;

  // ── 1 category: single full-width tall card
  if (n === 1) {
    return (
      <div className="h-64">
        <CategoryCard cat={a} className="h-full w-full" />
      </div>
    );
  }

  // ── 2 categories: two equal halves
  if (n === 2) {
    return (
      <div className="grid grid-cols-2 gap-3 h-52">
        <CategoryCard cat={a} className="h-full" />
        <CategoryCard cat={b} className="h-full" />
      </div>
    );
  }

  // ── 3 categories: hero (left 2-row) + 2 stacked right
  if (n === 3) {
    return (
      <div className="grid grid-cols-3 grid-rows-2 gap-3" style={{ height: "380px" }}>
        <HeroCard cat={a} />
        <CategoryCard cat={b} className="h-full" />
        <CategoryCard cat={c} className="h-full" />
      </div>
    );
  }

  // ── 4 categories: hero + 3 in a column
  if (n === 4) {
    return (
      <div className="grid grid-cols-4 grid-rows-2 gap-3" style={{ height: "380px" }}>
        <HeroCard cat={a} />
        <CategoryCard cat={b} className="h-full" />
        <CategoryCard cat={c} className="h-full" />
        <CategoryCard cat={d} className="col-span-2 h-full" />
      </div>
    );
  }

  // ── 5 categories: hero + 4 in 2x2
  if (n === 5) {
    return (
      <div className="grid grid-cols-4 grid-rows-2 gap-3" style={{ height: "380px" }}>
        <HeroCard cat={a} />
        <CategoryCard cat={b} className="h-full" />
        <CategoryCard cat={c} className="h-full" />
        <CategoryCard cat={d} className="h-full" />
        <CategoryCard cat={e} className="h-full" />
      </div>
    );
  }

  // ── 6 categories: original bento — hero (col-2 row-2) + col4 tall + 3 smalls
  if (n === 6) {
    return (
      <div className="grid grid-cols-4 grid-rows-3 gap-3" style={{ height: "540px" }}>
        {/* col 1-2 / rows 1-2 */}
        <HeroCard cat={a} />
        {/* col 3 row 1 */}
        <CategoryCard cat={b} className="h-full" />
        {/* col 4 rows 1-2 */}
        <Link
          href={`/menu?categoria=${c.id}`}
          className="group relative row-span-2 rounded-2xl overflow-hidden"
        >
          <Image src={c.imageUrl || FALLBACK} alt={c.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="25vw" unoptimized={c.imageUrl?.includes("ibb.co")} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 space-y-1">
            <p className="text-lg mb-0.5">{ICONS[c.id] ?? "🍽️"}</p>
            <p className="font-display font-black text-white text-sm leading-tight">{c.name}</p>
          </div>
        </Link>
        {/* col 3 row 2 */}
        <CategoryCard cat={d} className="h-full" />
        {/* col 1 row 3 */}
        <CategoryCard cat={e} className="h-full" />
        {/* col 2-4 row 3 */}
        <Link
          href={`/menu?categoria=${f.id}`}
          className="group relative col-span-3 rounded-2xl overflow-hidden"
        >
          <Image src={f.imageUrl || FALLBACK} alt={f.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="75vw" unoptimized={f.imageUrl?.includes("ibb.co")} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 md:p-5">
            <p className="text-lg mb-0.5">{ICONS[f.id] ?? "🍽️"}</p>
            <p className="font-display font-black text-white text-sm leading-tight">{f.name}</p>
          </div>
        </Link>
      </div>
    );
  }

  // ── 7+ categories: hero + grid of all others (adaptive cols)
  const others = [b, c, d, e, f, ...rest].filter(Boolean);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 grid-rows-2 gap-3" style={{ height: "380px" }}>
        <HeroCard cat={a} />
        {others.slice(0, 4).map((cat) => (
          <CategoryCard key={cat.id} cat={cat} className="h-full" />
        ))}
      </div>
      {others.length > 4 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {others.slice(4).map((cat) => (
            <CategoryCard key={cat.id} cat={cat} className="h-40" />
          ))}
        </div>
      )}
    </div>
  );
}
