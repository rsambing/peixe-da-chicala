"use client";

import { mockDonations } from "@/lib/mock";
import { formatCurrency } from "@/lib/mock/helpers";

const recentDonations = mockDonations.slice(0, 10);

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mx-4 text-red-500/60">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export function RecentDonations() {
  return (
    <section className="relative py-8 bg-black/5 dark:bg-white/5 overflow-hidden border-y border-black/5 dark:border-white/5">
      {/* Gradient Fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center">
            {recentDonations.map((donation) => (
              <div key={donation.id} className="flex items-center px-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-display font-black uppercase tracking-widest text-primary/60">
                    Nova Doação
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-display font-bold text-foreground">
                      {donation.donor?.fullName || "Doador Anónimo"}
                    </span>
                    <span className="mx-2 text-foreground/40 text-sm">•</span>
                    <span className="text-sm font-display font-black text-primary">
                      {formatCurrency(donation.amount)}
                    </span>
                  </div>
                </div>
                <HeartIcon />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
