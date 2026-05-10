"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { CampaignCard } from "@/components/features/campaigns";
import { Button } from "@/components/ui";
import { mockCampaigns } from "@/lib/mock";
import { CampaignStatus } from "@/lib/types";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const featured = mockCampaigns
  .filter((c) => c.status === CampaignStatus.ACTIVE || c.status === CampaignStatus.FUNDED)
  .slice(0, 8);

export function FeaturedCampaigns() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector("article")?.clientWidth || 320;
    const gap = 24;
    const scrollAmount = (cardWidth + gap) * 1; // Unico card por vez para scroll manual
    
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return;

    updateScrollButtons();
    ref.addEventListener("scroll", updateScrollButtons, { passive: true });
    return () => ref.removeEventListener("scroll", updateScrollButtons);
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 20;
      
      if (isAtEnd) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const cardWidth = scrollRef.current.querySelector("article")?.clientWidth || 320;
        const gap = 24;
        scrollRef.current.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
      }
    }, 1000); // interval de 2.5 segundos

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900/40 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground mb-2">
              Campanhas em Destaque
            </h2>
            <p className="text-muted-foreground text-lg">
              Projectos que estão a transformar comunidades em Angola
            </p>
          </div>
          <Link href="/explorar">
            <Button variant="outline" size="sm">
              Ver Todas →
            </Button>
          </Link>
        </div>

        {/* Carousel */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-foreground hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-110 -translate-x-6"
              aria-label="Anterior"
            >
              <FiChevronLeft className="size-6" />
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-foreground hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-110 translate-x-6"
              aria-label="Próximo"
            >
              <FiChevronRight className="size-6" />
            </button>
          )}

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {featured.map((campaign, idx) => (
              <div
                key={campaign.id}
                className="flex-none w-[240px] sm:w-[280px] snap-start"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`,
                }}
              >
                <CampaignCard campaign={campaign} compact />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
