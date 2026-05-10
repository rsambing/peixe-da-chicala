"use client";

import Link from "next/link";
import { Button, Badge, ProgressBar, Card, CardContent, EmptyState } from "@/components/ui";
import { currentUser, mockCampaigns } from "@/lib/mock";
import Image from "next/image";
import { formatCurrency, progressPercent, daysRemaining } from "@/lib/mock/helpers";
import {
  CampaignStatus,
  STATUS_LABELS,
  CATEGORY_LABELS,
} from "@/lib/types";
import { CategoryIcon } from "@/components/features/campaigns";
import { FiPlusCircle, FiEdit2, FiEye, FiBarChart2 } from "react-icons/fi";

const STATUS_VARIANT: Record<string, "active" | "funded" | "pending" | "expired" | "draft" | "default"> = {
  [CampaignStatus.ACTIVE]: "active",
  [CampaignStatus.FUNDED]: "funded",
  [CampaignStatus.PENDING_REVIEW]: "pending",
  [CampaignStatus.EXPIRED]: "expired",
  [CampaignStatus.DRAFT]: "draft",
};

export default function MyCampaignsPage() {
  const myCampaigns = mockCampaigns.filter(
    (c) => c.creator.id === currentUser.id
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Minhas Campanhas</h1>
          <p className="text-muted-foreground mt-1">
            Gerir e acompanhar as suas campanhas.
          </p>
        </div>
        <Link href="/campanhas/criar">
          <Button variant="primary">
            <FiPlusCircle className="size-4 mr-2" />
            Nova Campanha
          </Button>
        </Link>
      </div>

      {myCampaigns.length === 0 ? (
        <EmptyState
          icon={<FiBarChart2 className="size-12" />}
          title="Sem campanhas"
          description="Crie a sua primeira campanha e comece a arrecadar fundos."
          action={
            <Link href="/campanhas/criar">
              <Button variant="primary">Criar Campanha</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {myCampaigns.map((campaign) => {
            const progress = progressPercent(campaign.currentAmount, campaign.goalAmount);
            const remaining = daysRemaining(campaign.endDate);
            const isFunded = campaign.status === CampaignStatus.FUNDED;

            return (
              <Card key={campaign.id} hover>
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="sm:w-48 sm:shrink-0">
                      {campaign.media[0] ? (
                        <Image
                          src={campaign.media[0].url}
                          alt={campaign.title}
                          className="w-full h-32 sm:h-full object-cover sm:rounded-l-xl"
                          width={192}
                          height={128}
                        />
                      ) : (
                        <div className="w-full h-32 sm:h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-3xl sm:rounded-l-xl">
                          <CategoryIcon category={campaign.category} className="size-8" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={STATUS_VARIANT[campaign.status] ?? "default"}>
                              {STATUS_LABELS[campaign.status]}
                            </Badge>
                            <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                              <CategoryIcon category={campaign.category} className="size-3" />
                              {CATEGORY_LABELS[campaign.category]}
                            </span>
                          </div>
                          <h3 className="font-semibold text-foreground truncate">
                            {campaign.title}
                          </h3>
                        </div>

                        <div className="flex gap-1 shrink-0">
                          <Link href={`/campanhas/${campaign.id}`}>
                            <Button variant="ghost" size="icon-sm">
                              <FiEye className="size-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon-sm">
                            <FiEdit2 className="size-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                        {campaign.shortDesc}
                      </p>

                      <ProgressBar
                        value={progress}
                        variant={isFunded ? "success" : "default"}
                        size="sm"
                      />

                      <div className="flex items-center justify-between mt-2 text-sm">
                        <span>
                          <span className="font-semibold text-foreground">
                            {formatCurrency(campaign.currentAmount)}
                          </span>
                          <span className="text-muted-foreground">
                            {" "}/ {formatCurrency(campaign.goalAmount)}
                          </span>
                        </span>
                        <div className="flex items-center gap-4 text-muted-foreground text-xs">
                          <span>{campaign.donorCount} doadores</span>
                          <span>
                            {isFunded ? "Financiada" : `${remaining}d restantes`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
