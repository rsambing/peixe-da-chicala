"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useProducts } from "@/lib/products-context";
import { PopularCard } from "./PopularCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CARD_W = 208;
const GAP = 16;

export function PopularCarousel() {
  const { products, isLoading } = useProducts();
  const items = products.slice(0, 10);

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

  const visibleCount = containerWidth > 0
    ? Math.max(1, Math.floor((containerWidth + GAP) / (CARD_W + GAP)))
    : 4;
  const maxIndex = Math.max(0, items.length - visibleCount);

  const jumpInstant = useCallback((index: number) => {
    setTransition("none");
    currentRef.current = index;
    setCurrent(index);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransition("transform 0.5s ease-in-out"));
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
    if (isPaused || items.length === 0) return;
    const interval = setInterval(goNext, 1500);
    return () => clearInterval(interval);
  }, [isPaused, goNext, items.length]);

  const translateX = current * (CARD_W + GAP);

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-52 shrink-0 aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">Sem produtos disponíveis de momento.</p>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <button
        onClick={goPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-foreground hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-110 -translate-x-5"
        aria-label="Anterior"
      >
        <FiChevronLeft className="size-5" />
      </button>

      <button
        onClick={goNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-foreground hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-110 translate-x-5"
        aria-label="Próximo"
      >
        <FiChevronRight className="size-5" />
      </button>

      <div ref={containerRef} className="overflow-hidden">
        <div
          className="flex gap-4"
          style={{ transform: `translateX(-${translateX}px)`, transition }}
        >
          {items.map((item) => (
            <PopularCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
