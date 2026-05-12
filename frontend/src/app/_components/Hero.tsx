"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: ReturnType<typeof import("gsap").gsap.context> | null = null;

    (async () => {
      const { gsap } = await import("gsap");

      /* Reset animated elements to invisible before animating,
         so re-mounts (SPA navigation back) work correctly */
      const targets = heroRef.current?.querySelectorAll(
        "[data-hero-title],[data-hero-subtitle],[data-hero-cta],[data-hero-badge]"
      );
      targets?.forEach((el) => ((el as HTMLElement).style.opacity = "0"));

      ctx = gsap.context(() => {
        gsap.fromTo("[data-hero-title]",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        );
        gsap.fromTo("[data-hero-subtitle]",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power3.out" },
        );
        gsap.fromTo("[data-hero-cta]",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.6, ease: "power2.out" },
        );
        gsap.fromTo("[data-hero-badge]",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, delay: 0.9, ease: "back.out(1.7)" },
        );
      }, heroRef);
    })();

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=2000&q=80')",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/70 via-primary/50 to-primary/80" />

      {/* Decorative shapes */}
      <div className="absolute top-20 left-10 size-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 size-96 rounded-full bg-white/5 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center">
        <div
          data-hero-badge
          className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white/90 mb-8 border border-white/10"
        >
          <span className="inline-block size-2 rounded-full bg-accent animate-pulse" />
          Mais de 42 milhões Kz arrecadados
        </div>

        <h1
          data-hero-title
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight"
        >
          Onde os sonhos{" "}
          <span className="font-serif italic text-accent underline underline-offset-8 decoration-white/20">angolanos</span>{" "}
          ganham vida
        </h1>

        <p
          data-hero-subtitle
          className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A plataforma de financiamento coletivo que conecta histórias reais a
          pessoas que podem fazer a diferença. Crie, apoie e acompanhe campanhas
          com total transparência.
        </p>

        <div data-hero-cta className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/campanhas/criar">
            <Button variant="accent" size="xl" className="text-base px-10">
              Começar Campanha
            </Button>
          </Link>
          <Link href="/explorar">
            <Button
              variant="outline"
              size="xl"
              className="border-white/30 text-white hover:bg-white hover:text-primary text-base px-10"
            >
              Explorar Projectos
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 40L48 36C96 32 192 24 288 28C384 32 480 48 576 52C672 56 768 48 864 40C960 32 1056 24 1152 28C1248 32 1344 48 1392 56L1440 64V80H0V40Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    </section>
  );
}
