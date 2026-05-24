"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  /** Animate each direct child with stagger instead of the whole wrapper */
  stagger?: boolean;
  delay?: number;
  y?: number;
}

export function RevealOnScroll({
  children,
  className,
  stagger = false,
  delay = 0,
  y = 44,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger ? Array.from(el.children) : [el];

    gsap.set(targets, { autoAlpha: 0, y });

    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: stagger ? 0.1 : 0,
          delay,
          ease: "power3.out",
        });
      },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
