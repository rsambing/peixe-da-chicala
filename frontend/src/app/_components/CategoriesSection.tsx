"use client";

import Link from "next/link";

const categories = [
  "Educação", "Saúde", "Tecnologia", "Artes", "Comunidade", "Negócios", "Emergência", "Ambiente"
];

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mx-6 text-primary/40">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}

export function CategoriesSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-background">
      {/* Gradient Fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent z-20 pointer-events-none" />

      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] font-black text-primary/[0.02] select-none pointer-events-none whitespace-nowrap">
        ANGOLA VIVA
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header (Optional, but kept clean) */}
        <div className="text-center mb-8 px-6">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-foreground mb-3 uppercase tracking-tighter">
            Impacto em cada sector
          </h2>
          <div className="size-12 border-t border-primary mx-auto opacity-20" />
        </div>

        {/* Marquee Row 1 */}
        <div className="relative py-3 border-y border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 -rotate-1 scale-102 shadow-lg">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center">
                    <span className="text-lg sm:text-xl font-display font-black uppercase tracking-[0.2em] text-foreground">
                      {cat}
                    </span>
                    <SparkleIcon />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row 2 (Opposite direction) */}
        <div className="relative py-3 border-y border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 rotate-1 scale-102 shadow-md">
          <div className="flex whitespace-nowrap animate-marquee-reverse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center">
                    <span className="text-lg sm:text-xl font-display font-black uppercase tracking-[0.2em] text-foreground/40">
                      {cat}
                    </span>
                    <SparkleIcon />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explore Link */}
      <div className="mt-12 text-center">
        <Link href="/explorar">
          <button className="group relative px-8 py-3.5 font-display font-black uppercase tracking-widest text-xs overflow-hidden border-2 border-primary rounded-full transition-all hover:text-white">
            <span className="relative z-10">Explorar Todas as Causas →</span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </Link>
      </div>
    </section>
  );
}
