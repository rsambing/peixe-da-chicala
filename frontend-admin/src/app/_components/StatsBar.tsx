"use client";

import { useEffect, useRef, useState } from "react";
import { mockPlatformStats as platformStats } from "@/lib/mock";
import { formatCurrency, formatNumber } from "@/lib/mock/helpers";

interface StatItem {
  label: string;
  value: string;
  suffix?: string;
}

const stats: StatItem[] = [
  {
    label: "Total Arrecadado",
    value: formatCurrency(platformStats.totalRaised),
  },
  {
    label: "Campanhas Financiadas",
    value: String(platformStats.campaignsFunded),
  },
  {
    label: "Doadores",
    value: formatNumber(platformStats.uniqueDonors),
  },
  {
    label: "Campanhas Activas",
    value: String(platformStats.activeCampaigns),
  },
];

function AnimatedNumber({ target, suffix }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateValue();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function animateValue() {
    // Extract numeric portion
    const numericStr = target.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
    const numericValue = parseFloat(numericStr) || 0;

    if (numericValue === 0) {
      setDisplay(target);
      return;
    }

    const duration = 1500;
    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      if (progress < 1) {
        const current = Math.round(numericValue * eased);
        setDisplay(current.toLocaleString("pt-AO"));
        requestAnimationFrame(step);
      } else {
        setDisplay(target);
      }
    }

    requestAnimationFrame(step);
  }

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function StatsBar() {
  return (
    <section className="relative z-10 -mt-12 mx-auto max-w-6xl px-6">
      <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl sm:text-3xl font-black text-primary dark:text-white mb-1">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
