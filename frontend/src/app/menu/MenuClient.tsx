"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input, Badge } from "@/components/ui";
import { MENU_CATEGORIES, MENU_ITEMS, type MenuCategoryId } from "@/lib/menu";
import { MenuItemCard } from "@/components/features/menu/MenuItemCard";

export function MenuClient() {
  const params = useSearchParams();
  const initialCategory = params.get("categoria") as MenuCategoryId | null;

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId | "ALL">(
    initialCategory && MENU_CATEGORIES.some((c) => c.id === initialCategory)
      ? initialCategory
      : "ALL"
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return MENU_ITEMS.filter((item) => {
      if (activeCategory !== "ALL" && item.categoryId !== activeCategory) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    });
  }, [query, activeCategory]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-display font-black text-foreground">
          Cardápio
        </h1>
        <p className="text-muted-foreground">
          Escolha os pratos, adicione ao carrinho e finalize em poucos passos.
        </p>

        <div className="max-w-xl">
          <Input
            placeholder="Pesquisar pratos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveCategory("ALL")}
            className={
              activeCategory === "ALL"
                ? "px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-display font-black"
                : "px-4 py-2 rounded-full bg-muted text-foreground text-sm font-display font-black hover:bg-muted/80"
            }
          >
            Todas
          </button>
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={
                activeCategory === cat.id
                  ? "px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-display font-black"
                  : "px-4 py-2 rounded-full bg-muted text-foreground text-sm font-display font-black hover:bg-muted/80"
              }
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="pt-1">
          <Badge variant="default">{filtered.length} item(s)</Badge>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </section>
    </div>
  );
}
