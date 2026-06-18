"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Flame, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function SobreSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef    = useRef<HTMLDivElement>(null);
  const imageRef   = useRef<HTMLDivElement>(null);
  const badge1Ref  = useRef<HTMLDivElement>(null);
  const badge2Ref  = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const leftChildren = leftRef.current ? Array.from(leftRef.current.children) : [];

    gsap.set(leftChildren, { autoAlpha: 0, x: -32 });
    gsap.set(imageRef.current,  { autoAlpha: 0, x: 32 });
    gsap.set([badge1Ref.current, badge2Ref.current], { autoAlpha: 0, scale: 0.6 });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to(leftChildren, { autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.12 })
          .to(imageRef.current, { autoAlpha: 1, x: 0, duration: 0.8 }, 0.15)
          .to(badge1Ref.current, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(2)" }, 0.7)
          .to(badge2Ref.current, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(2)" }, 0.95);
      },
    });

    // Float badges up and down continuously
    gsap.to(badge1Ref.current, {
      y: -7, duration: 2.4, yoyo: true, repeat: -1, ease: "sine.inOut",
    });
    gsap.to(badge2Ref.current, {
      y: 7, duration: 2.0, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.6,
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-20 px-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* ── Left: text ─────────────────────────────────────── */}
        <div ref={leftRef} className="space-y-6">
          {/* Label */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1">
            <Flame className="size-3.5 text-primary" />
            <span className="text-xs font-display font-bold text-primary uppercase tracking-wider">
              Peixe da Chicala
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl font-display font-black text-foreground leading-[1.05] tracking-tight">
            Do mar à brasa,{" "}
            <span className="text-primary">directo para si</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground leading-relaxed">
            Ingredientes frescos todos os dias. Grelha no ponto certo.
            Escolha no cardápio, adicione ao carrinho e acompanhe o pedido
            em tempo real, do início à entrega.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/menu">
              <Button variant="accent" size="lg" className="gap-2">
                Fazer Pedido <span aria-hidden>→</span>
              </Button>
            </Link>
            <Link href="/acompanhar">
              <Button variant="outline" size="lg">
                Acompanhar Pedido
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Right: image + floating badges ─────────────────── */}
        {/* Outer div has no overflow-hidden so badges can float outside */}
        <div className="relative">

          {/* Decorative offset shadow behind image */}
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl bg-primary/10 -z-10" />

          {/* Image */}
          <div
            ref={imageRef}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
              alt="Peixe grelhado na brasa"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Badge 1 — top left (fora da imagem, tipo "Rovo" no Jira) */}
          <div
            ref={badge1Ref}
            className="absolute -top-5 left-6 flex items-center gap-2.5 bg-card border shadow-lg rounded-xl px-3.5 py-2.5 min-w-[152px]"
          >
            <div className="size-9 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
              <Star className="size-4 text-accent fill-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground leading-none">Mais pedido</p>
              <p className="text-sm font-display font-black text-foreground leading-tight mt-0.5 truncate">
                Tilápia Grelhada
              </p>
            </div>
          </div>

          {/* Badge 2 — bottom right (tipo "IN PROGRESS" no Jira) */}
          <div
            ref={badge2Ref}
            className="absolute -bottom-5 right-6 flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-2.5 shadow-lg"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            <div>
              <p className="text-[10px] opacity-75 leading-none uppercase tracking-wide">
                Estado do pedido
              </p>
              <p className="text-sm font-display font-black leading-tight mt-0.5">
                ENTREGUE
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
