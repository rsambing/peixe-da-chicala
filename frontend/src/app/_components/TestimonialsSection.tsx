"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ApiTestimonial } from "@/lib/api-types";
import { ImageWithFallback } from "@/components/ui";

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<ApiTestimonial[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    api.getTestimonials().then(setTestimonials).catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  const current = testimonials[active];

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 bg-black">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl sm:text-3xl font-display font-black text-white mb-1">
          O Que Dizem os Nossos Clientes
        </h2>
        <p className="text-white/50 mb-10 text-sm">
          Experiências reais de quem já provou
        </p>

        {/* Quote */}
        <div className="min-h-[112px] flex items-center justify-center mb-8">
          <blockquote className="text-lg sm:text-xl font-serif text-white/85 leading-relaxed font-light italic">
            &ldquo;{current.quote}&rdquo;
          </blockquote>
        </div>

        {/* Author */}
        <div className="flex flex-col items-center gap-3">
          <ImageWithFallback
            src={current.avatarUrl}
            alt={current.name}
            containerClassName="relative size-16 rounded-full border-2 border-white/20 bg-white/10"
            className="object-cover"
            showLabel={false}
            iconClassName="size-5"
            fallbackClassName="text-white/50"
            sizes="64px"
          />
          <div>
            <p className="font-display font-bold text-white text-sm">{current.name}</p>
            <p className="text-xs text-white/50">{current.role}</p>
          </div>
        </div>

        {/* Dots */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active
                    ? "bg-accent w-6"
                    : "bg-white/20 w-2 hover:bg-white/40"
                }`}
                aria-label={`Testemunho ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
