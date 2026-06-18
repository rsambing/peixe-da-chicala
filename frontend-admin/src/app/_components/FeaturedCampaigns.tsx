"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState("transform 0.5s ease-in-out");
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const currentRef = useRef(0);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.clientWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const gap = 24;
  const minCard = 240;
  const visibleCount = containerWidth > 0
    ? Math.max(1, Math.floor((containerWidth + gap) / (minCard + gap)))
    : 3;
  const cardWidth = containerWidth > 0
    ? (containerWidth - gap * (visibleCount - 1)) / visibleCount
    : minCard;
  const maxIndex = Math.max(0, featured.length - visibleCount);

  const jumpInstant = useCallback((index: number) => {
    setTransition("none");
    currentRef.current = index;
    setCurrent(index);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransition("transform 0.5s ease-in-out");
      });
    });
  }, []);

  const goNext = useCallback(() => {
    const prev = currentRef.current;
    if (prev >= maxIndex) {
      jumpInstant(0);
    } else {
      setTransition("transform 0.5s ease-in-out");
      currentRef.current = prev + 1;
      setCurrent(prev + 1);
    }
  }, [maxIndex, jumpInstant]);

  const goPrev = useCallback(() => {
    const prev = currentRef.current;
    if (prev <= 0) {
      jumpInstant(maxIndex);
    } else {
      setTransition("transform 0.5s ease-in-out");
      currentRef.current = prev - 1;
      setCurrent(prev - 1);
    }
  }, [maxIndex, jumpInstant]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(goNext, 1500);
    return () => clearInterval(interval);
  }, [isPaused, goNext]);

  const translateX = current * (cardWidth + gap);

  return (
    <section id="explorar" className="py-20 px-6 bg-gray-50 dark:bg-gray-900/40 overflow-hidden">
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
          <Link href="/#explorar">
            <Button variant="outline" size="sm">
              Ver Todas →
            </Button>
          </Link>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation buttons — sempre visíveis */}
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-foreground hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-110 -translate-x-6"
            aria-label="Anterior"
          >
            <FiChevronLeft className="size-6" />
          </button>

          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 size-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-foreground hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-110 translate-x-6"
            aria-label="Próximo"
          >
            <FiChevronRight className="size-6" />
          </button>

          {/* Slide container */}
          <div ref={containerRef} className="overflow-hidden">
            <div
              className="flex gap-6"
              style={{
                transform: `translateX(-${translateX}px)`,
                transition,
              }}
            >
              {featured.map((campaign) => (
                <div
                  key={campaign.id}
                  style={{ width: `${cardWidth}px`, flexShrink: 0 }}
                >
                  <CampaignCard campaign={campaign} compact />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
