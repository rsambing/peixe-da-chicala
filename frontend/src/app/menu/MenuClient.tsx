"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useProducts } from "@/lib/products-context";
import type { MenuItem } from "@/lib/menu";
import { MenuItemCard } from "@/components/features/menu/MenuItemCard";

function CategoryPillSkeleton() {
  return <div className="h-9 w-24 rounded-full bg-gray-100 animate-pulse shrink-0" />;
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-gray-100 animate-pulse">
      <div className="aspect-[4/3]" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
        <div className="h-3 w-1/2 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

export function MenuClient() {
  const params = useSearchParams();
  const { products, categories, isLoading } = useProducts();

  const initialCategory = params.get("categoria") ?? "ALL";
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(
    categories.some((c) => c.id === initialCategory) ? initialCategory : "ALL"
  );

  const filtered = useMemo<MenuItem[]>(() => {
    const q = query.trim().toLowerCase();
    return products.filter((item) => {
      if (activeCategory !== "ALL" && item.categoryId !== activeCategory) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [query, activeCategory, products]);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">

      {/* ── Page header + Search ────────────────────────────── */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-display font-black text-gray-900 mb-2">
          Cardápio
        </h1>
        <p className="text-gray-500 text-lg mb-6">
          Escolha os pratos e adicione ao carrinho.
        </p>

        <div className="relative mx-auto max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Pesquisar pratos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-10 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 text-gray-400 transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Category pills ──────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {isLoading ? (
          <>
            <CategoryPillSkeleton />
            <CategoryPillSkeleton />
            <CategoryPillSkeleton />
            <CategoryPillSkeleton />
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setActiveCategory("ALL")}
              className={[
                "h-9 px-5 rounded-full text-sm font-display font-bold shrink-0 transition-colors",
                activeCategory === "ALL"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              ].join(" ")}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={[
                  "h-9 px-5 rounded-full text-sm font-display font-bold shrink-0 transition-colors",
                  activeCategory === cat.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                ].join(" ")}
              >
                {cat.name}
              </button>
            ))}
          </>
        )}
      </div>

      {/* ── Results count ───────────────────────────────────── */}
      {!isLoading && (
        <p className="text-sm text-gray-400 mb-5">
          {filtered.length === 0
            ? "Nenhum prato encontrado"
            : `${filtered.length} prato${filtered.length !== 1 ? "s" : ""}`}
        </p>
      )}

      {/* ── Grid ────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="font-display font-black text-gray-900 text-xl mb-2">Sem resultados</p>
          <p className="text-gray-500 text-sm">
            {query ? `Nada encontrado para "${query}"` : "Esta categoria está vazia."}
          </p>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="mt-4 px-5 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Limpar pesquisa
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
