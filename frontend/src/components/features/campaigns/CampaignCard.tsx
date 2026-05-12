import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  type Campaign,
  CampaignStatus,
  CATEGORY_LABELS,
} from "@/lib/types";
import Image from "next/image";
import { formatCurrency, progressPercent, daysRemaining } from "@/lib/mock/helpers";
import { CategoryIcon } from "./CategoryIcon";
import { FiCheck, FiHeart, FiClock, FiTarget } from "react-icons/fi";

interface CampaignCardProps {
  campaign: Campaign;
  compact?: boolean;
}

const STATUS_VARIANT: Record<
  string,
  "active" | "funded" | "pending" | "expired" | "draft" | "default"
> = {
  [CampaignStatus.ACTIVE]: "active",
  [CampaignStatus.FUNDED]: "funded",
  [CampaignStatus.PENDING_REVIEW]: "pending",
  [CampaignStatus.EXPIRED]: "expired",
  [CampaignStatus.DRAFT]: "draft",
};

export function CampaignCard({ campaign, compact = false }: CampaignCardProps) {
  const featured = campaign.media?.find((m) => m.isFeatured) ?? campaign.media?.[0];
  const progress = progressPercent(campaign.currentAmount, campaign.goalAmount);
  const remaining = daysRemaining(campaign.endDate);
  const isFunded = campaign.status === CampaignStatus.FUNDED;

  return (
    <Link href={`/campanhas/${campaign.id}`} className="group block h-full">
      <article className={cn(
        "relative overflow-hidden rounded-4xl bg-gray-100 dark:bg-gray-800 transition-all duration-300 hover:-translate-y-1 group/card flex flex-col shadow-sm hover:shadow-xl",
        compact ? "aspect-3/4" : "aspect-4/5"
      )}>
        {/* Background Image with Gradient Blur Effect */}
        <div className="absolute inset-0 z-0">
          {featured ? (
            <Image
              src={featured.url}
              alt={campaign.title}
              fill
              className="object-cover transition-transform duration-500 group-hover/card:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <CategoryIcon category={campaign.category} className="size-16 opacity-20" />
            </div>
          )}
          
          {/* Main Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent transition-opacity group-hover/card:opacity-90" />
          
          {/* Selective Blur Overlay for text readability (Glassmorphism look at bottom) */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 backdrop-blur-[2px]" 
               style={{ maskImage: 'linear-gradient(to top, black, transparent)' }} />
        </div>

        {/* Favorite/Action button - Glassmorphism */}
        <button className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition-colors shadow-lg">
          <FiHeart className="size-4" />
        </button>

        {/* Category Badge - Floating top left */}
        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
          {CATEGORY_LABELS[campaign.category]}
        </div>

        {/* Content Container - Pushed to bottom */}
        <div className="relative z-10 mt-auto p-5 sm:p-6 flex flex-col gap-3.5">
          <div className="space-y-1">
            <h3 className={cn(
              "font-display font-black text-white leading-tight drop-shadow-lg line-clamp-2",
              compact ? "text-lg" : "text-xl"
            )}>
              {campaign.title}
            </h3>
            <p className="text-white/70 text-[10px] font-medium tracking-wide uppercase">
              {CATEGORY_LABELS[campaign.category]}
            </p>
          </div>

          {/* Progress Bar & Stats */}
          <div className="space-y-2">
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
               <div 
                 className={cn(
                   "h-full transition-all duration-1000 ease-out",
                   isFunded ? "bg-success" : "bg-primary"
                 )}
                 style={{ width: `${Math.min(progress, 100)}%` }}
               />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-white/50 text-[8px] uppercase font-bold tracking-wider">Angariado</span>
                <span className="text-white font-black text-sm leading-none">{progress}%</span>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-white/50 text-[8px] uppercase font-bold tracking-wider">Restam</span>
                <span className="text-white font-black text-sm leading-none">{remaining}d</span>
              </div>
            </div>
          </div>

          {/* Call to Action - Pill Button */}
          <div className="pt-0.5">
            <div className="w-full bg-white hover:bg-gray-100 text-black h-10 rounded-full font-black flex items-center justify-center transition-all group-hover/card:translate-y-[-2px] active:scale-95 shadow-lg text-[10px] tracking-wider uppercase">
              {isFunded ? "Ver Campanha" : "Apoiar Agora"}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
