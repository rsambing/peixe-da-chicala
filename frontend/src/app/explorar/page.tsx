"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Header } from "@/components/layout";
import { Footer } from "@/components/layout";
import { CampaignCard } from "@/components/features/campaigns";
import { Button, Input, Badge, EmptyState } from "@/components/ui";
import { mockCampaigns } from "@/lib/mock";
import {
  Category,
  Province,
  CampaignStatus,
  CATEGORY_LABELS,
  PROVINCE_LABELS,
} from "@/lib/types";
import { CategoryIcon } from "@/components/features/campaigns";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

const BATCH_SIZE = 6;
const publicStatuses = [CampaignStatus.ACTIVE, CampaignStatus.FUNDED];

export default function ExplorarPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">("ALL");
  const [selectedProvince, setSelectedProvince] = useState<Province | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<CampaignStatus | "ALL">("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "ending">("recent");
  const sentinelRef = useRef<HTMLDivElement>(null);

  /* Helper to reset pagination */
  function resetAndSet<T>(setter: (value: T) => void, value: T) {
    setter(value);
    setVisibleCount(BATCH_SIZE);
  }

  const campaigns = useMemo(() => {
    let filtered = mockCampaigns.filter((c) =>
      publicStatuses.includes(c.status)
    );

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.shortDesc.toLowerCase().includes(q) ||
          c.creator.fullName.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "ALL") {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    if (selectedProvince !== "ALL") {
      filtered = filtered.filter((c) => c.province === selectedProvince);
    }

    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((c) => c.status === selectedStatus);
    }

    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.donorCount - a.donorCount);
        break;
      case "ending":
        filtered.sort(
          (a, b) =>
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );
        break;
      case "recent":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return filtered;
  }, [search, selectedCategory, selectedProvince, selectedStatus, sortBy]);

  const visibleCampaigns = campaigns.slice(0, visibleCount);
  const hasMore = visibleCount < campaigns.length;

  /* Infinite scroll */
  const loadMore = useCallback(() => {
    setVisibleCount((prev) =>
      Math.min(prev + BATCH_SIZE, campaigns.length)
    );
  }, [campaigns.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const activeFilterCount = [
    selectedCategory !== "ALL",
    selectedProvince !== "ALL",
    selectedStatus !== "ALL",
  ].filter(Boolean).length;

  function clearFilters() {
    setSelectedCategory("ALL");
    setSelectedProvince("ALL");
    setSelectedStatus("ALL");
    setSearch("");
    setVisibleCount(BATCH_SIZE);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-display font-black text-foreground mb-2">
              Explorar Campanhas
            </h1>
            <p className="text-muted-foreground text-lg">
              Descubra projectos que estão a transformar Angola
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                placeholder="Pesquisar campanhas..."
                value={search}
                onChange={(e) =>
                  resetAndSet(setSearch, e.target.value)
                }
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={showFilters ? "primary" : "outline"}
                size="md"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter className="size-4 mr-2" />
                Filtros
                {activeFilterCount > 0 && (
                  <Badge variant="accent" className="ml-2">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>

              <select
                value={sortBy}
                onChange={(e) =>
                  resetAndSet(setSortBy, e.target.value as typeof sortBy)
                }
                className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="recent">Mais Recentes</option>
                <option value="popular">Mais Populares</option>
                <option value="ending">A Terminar</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Categoria
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      resetAndSet(setSelectedCategory, "ALL")
                    }
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      selectedCategory === "ALL"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Todas
                  </button>

                  {Object.values(Category).map((cat) => (
                    <button
                      key={cat}
                      onClick={() =>
                        resetAndSet(setSelectedCategory, cat)
                      }
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <CategoryIcon
                        category={cat}
                        className="size-3.5 inline mr-1"
                      />{" "}
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Província
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) =>
                    resetAndSet(
                      setSelectedProvince,
                      e.target.value as Province | "ALL"
                    )
                  }
                  className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="ALL">Todas as Províncias</option>
                  {Object.values(Province).map((p) => (
                    <option key={p} value={p}>
                      {PROVINCE_LABELS[p]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Estado
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      resetAndSet(setSelectedStatus, "ALL")
                    }
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      selectedStatus === "ALL"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Todos
                  </button>

                  {publicStatuses.map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        resetAndSet(setSelectedStatus, s)
                      }
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        selectedStatus === s
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {s === CampaignStatus.ACTIVE
                        ? "Activas"
                        : "Financiadas"}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-destructive hover:underline"
                >
                  <FiX className="size-3" /> Limpar filtros
                </button>
              )}
            </div>
          )}

          <p className="text-sm text-muted-foreground mb-4">
            {campaigns.length} campanha
            {campaigns.length !== 1 ? "s" : ""} encontrada
            {campaigns.length !== 1 ? "s" : ""}
          </p>

          {visibleCampaigns.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                  />
                ))}
              </div>

              {hasMore && (
                <div
                  ref={sentinelRef}
                  className="flex justify-center py-10"
                >
                  <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={<FiSearch className="size-12" />}
              title="Nenhuma campanha encontrada"
              description="Tente ajustar os filtros ou usar termos de pesquisa diferentes."
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                >
                  Limpar Filtros
                </Button>
              }
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
