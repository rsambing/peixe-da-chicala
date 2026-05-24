"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const EMBER_COLORS = ["#ff4400", "#ffaa00", "#ff6600", "#ffcc00", "#ff8800"];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const embersRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // ── Initial states ─────────────────────────────────────────────
    gsap.set(badgeRef.current, { autoAlpha: 0, y: 24 });
    gsap.set([line1Ref.current, line2Ref.current], { autoAlpha: 0, y: 80 });
    gsap.set(subtitleRef.current, { autoAlpha: 0, y: 24 });
    if (ctaRef.current) {
      gsap.set(Array.from(ctaRef.current.children), { autoAlpha: 0, y: 16, scale: 0.94 });
    }

    // ── Entrance timeline ──────────────────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(badgeRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.3)
      .to(line1Ref.current, { autoAlpha: 1, y: 0, duration: 1.0 }, 0.6)
      .to(line2Ref.current, { autoAlpha: 1, y: 0, duration: 1.0 }, 0.85)
      .to(subtitleRef.current, { autoAlpha: 1, y: 0, duration: 0.7 }, 1.15)
      .to(Array.from(ctaRef.current?.children ?? []), {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        stagger: 0.12,
      }, 1.4);

    // ── Parallax on scroll ─────────────────────────────────────────
    gsap.to(bgRef.current, {
      y: () => (sectionRef.current?.offsetHeight ?? 600) * 0.22,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        invalidateOnRefresh: true,
      },
    });

    // ── Embers (client-only, no hydration issues) ─────────────────
    const container = embersRef.current;
    if (!container) return;

    for (let i = 0; i < 14; i++) {
      const el = document.createElement("span");
      const size = 2.5 + Math.random() * 3.5;
      const color = EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)];
      const duration = 3.5 + Math.random() * 3;
      const drift = (Math.random() - 0.5) * 90;
      const left = 5 + Math.random() * 90;
      const delay = Math.random() * 5;

      Object.assign(el.style, {
        position: "absolute",
        bottom: `${8 + Math.random() * 18}%`,
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 ${size * 2.5}px ${color}`,
        opacity: "0",
        pointerEvents: "none",
      });
      container.appendChild(el);

      gsap.timeline({ repeat: -1, delay })
        .set(el, { x: 0, y: 0 })
        .to(el, { opacity: 0.9, y: -55, duration: duration * 0.18, ease: "power1.out" })
        .to(el, { opacity: 0.65, y: -140, x: drift * 0.45, duration: duration * 0.35, ease: "none" })
        .to(el, { opacity: 0, y: -260, x: drift, duration: duration * 0.47, ease: "power1.in" })
        .set(el, { y: 0, x: 0 });
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background — extends below to give room for parallax movement */}
      <div
        ref={bgRef}
        className="absolute inset-x-0 top-0"
        style={{ bottom: "-28%" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2200&q=80"
          alt="Peixe grelhado na brasa"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Embers — created dynamically in GSAP, no SSR mismatch */}
      <div
        ref={embersRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-28 pb-20 text-center">
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-2 border border-white/20 text-sm text-white mb-8"
        >
          <span className="inline-block size-2 rounded-full bg-accent animate-pulse" />
          Peixe grelhado · sabor de Luanda
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight">
          <span ref={line1Ref} className="block">Peixe na brasa,</span>
          <span ref={line2Ref} className="block text-accent">pronto para pedir</span>
        </h1>

        <p ref={subtitleRef} className="mt-5 text-lg sm:text-xl text-white/85 max-w-2xl mx-auto">
          Explore o cardápio, adicione ao carrinho e acompanhe o seu pedido com um código.
        </p>

        <div
          ref={ctaRef}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/menu">
            <Button variant="accent" size="xl" className="px-10">
              Fazer Pedido
            </Button>
          </Link>
          <Link href="/#mais-pedidos">
            <Button
              variant="outline"
              size="xl"
              className="px-10 border-white/40 text-white hover:bg-white hover:text-foreground"
            >
              Ver Mais Pedidos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
