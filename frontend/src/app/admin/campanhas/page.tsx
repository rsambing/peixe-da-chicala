"use client";

import { useState } from "react";
import { Button, Badge } from "@/components/ui";
import Image from "next/image";
import {
  CampaignStatus,
  STATUS_LABELS,
  CATEGORY_LABELS,
  PROVINCE_LABELS,
} from "@/lib/types";
import { CategoryIcon } from "@/components/features/campaigns";
import { mockCampaigns, formatCurrency, timeAgo } from "@/lib/mock";
import {
  FiSearch,
  FiCheck,
  FiX,
  FiEye,
  FiPause,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { toast } from "sonner";

type FilterStatus = "ALL" | CampaignStatus;

const STATUS_BADGE_MAP: Record<CampaignStatus, string> = {
  [CampaignStatus.ACTIVE]: "active",
  [CampaignStatus.FUNDED]: "funded",
  [CampaignStatus.PAUSED]: "paused",
  [CampaignStatus.DRAFT]: "draft",
  [CampaignStatus.PENDING_REVIEW]: "pending",
  [CampaignStatus.APPROVED]: "success",
  [CampaignStatus.REJECTED]: "rejected",
  [CampaignStatus.SUSPENDED]: "suspended",
  [CampaignStatus.EXPIRED]: "expired",
  [CampaignStatus.ARCHIVED]: "default",
};

export default function AdminCampaignsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = mockCampaigns.filter((c) => {
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.creator.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = mockCampaigns.reduce<Record<string, number>>(
    (acc, c) => ({ ...acc, [c.status]: (acc[c.status] || 0) + 1 }),
    {}
  );

  function handleApprove(id: string) {
    toast.success(`Campanha ${id} aprovada com sucesso!`);
  }

  function handleReject(id: string) {
    toast.error(`Campanha ${id} rejeitada.`);
  }

  function handleSuspend(id: string) {
    toast.success(`Campanha ${id} suspensa.`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Moderação de Campanhas</h1>
        <p className="text-sm text-gray-400 mt-1">
          Reveja, aprove ou rejeite campanhas submetidas.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
          <input
            type="text"
            placeholder="Pesquisar por título ou criador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-lg border border-gray-700 bg-gray-800 pl-9 pr-3 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
          className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/30"
        >
          <option value="ALL">Todos os estados ({mockCampaigns.length})</option>
          {Object.values(CampaignStatus).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]} ({statusCounts[s] || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Campaign list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-12 text-center text-gray-500">
            Nenhuma campanha encontrada.
          </div>
        ) : (
          filtered.map((campaign) => {
            const isExpanded = expandedId === campaign.id;
            const isPending = campaign.status === CampaignStatus.PENDING_REVIEW;

            return (
              <div
                key={campaign.id}
                className={`rounded-xl border bg-gray-900 overflow-hidden transition-colors ${
                  isPending
                    ? "border-amber-500/30"
                    : "border-gray-800"
                }`}
              >
                {/* Row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : campaign.id)
                  }
                >
                  {/* Image */}
                  <div className="size-12 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                    {campaign.media[0] && (
                      <Image
                        src={campaign.media[0].url}
                        alt=""
                        width={48}
                        height={48}
                        className="size-12 object-cover"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-200 truncate">
                        {campaign.title}
                      </p>
                      {isPending && (
                        <span className="size-2 rounded-full bg-amber-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate inline-flex items-center gap-1">
                      <CategoryIcon category={campaign.category} className="size-3" />
                      {CATEGORY_LABELS[campaign.category]} ·{" "}
                      {PROVINCE_LABELS[campaign.province]} ·{" "}
                      {campaign.creator.fullName}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="hidden sm:block text-right shrink-0 mr-2">
                    <p className="text-sm font-semibold text-gray-200">
                      {formatCurrency(campaign.goalAmount)}
                    </p>
                    <p className="text-xs text-gray-500">{timeAgo(campaign.createdAt)}</p>
                  </div>

                  <Badge
                    variant={STATUS_BADGE_MAP[campaign.status] as "active" | "funded" | "paused" | "draft" | "pending" | "success" | "rejected" | "suspended" | "expired" | "default"}
                    className="text-[10px] shrink-0"
                  >
                    {STATUS_LABELS[campaign.status]}
                  </Badge>

                  {isExpanded ? (
                    <FiChevronUp className="size-4 text-gray-500 shrink-0" />
                  ) : (
                    <FiChevronDown className="size-4 text-gray-500 shrink-0" />
                  )}
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-800 px-5 py-4 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs block">Meta</span>
                        <span className="text-gray-200 font-medium">
                          {formatCurrency(campaign.goalAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">Arrecadado</span>
                        <span className="text-gray-200 font-medium">
                          {formatCurrency(campaign.currentAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">Criador</span>
                        <span className="text-gray-200 font-medium">
                          {campaign.creator.fullName}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">Organização</span>
                        <span className="text-gray-200 font-medium">
                          {campaign.organization?.name || "Pessoal"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500 text-xs block mb-1">
                        Descrição Curta
                      </span>
                      <p className="text-sm text-gray-300">{campaign.shortDesc}</p>
                    </div>

                    {/* Images preview */}
                    {campaign.media.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {campaign.media.map((m) => (
                          <Image
                            key={m.id}
                            src={m.url}
                            alt=""
                            width={128}
                            height={80}
                            className="h-20 w-32 rounded-lg object-cover shrink-0"
                          />
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                      <a
                        href={`/campanhas/${campaign.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200">
                          <FiEye className="size-4 mr-1" /> Ver Página
                        </Button>
                      </a>
                      <div className="flex-1" />
                      {campaign.status === CampaignStatus.ACTIVE && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-amber-400 hover:text-amber-300"
                          onClick={() => handleSuspend(campaign.id)}
                        >
                          <FiPause className="size-4 mr-1" /> Suspender
                        </Button>
                      )}
                      {isPending && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleReject(campaign.id)}
                          >
                            <FiX className="size-4 mr-1" /> Rejeitar
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-500"
                            onClick={() => handleApprove(campaign.id)}
                          >
                            <FiCheck className="size-4 mr-1" /> Aprovar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      <p className="text-xs text-gray-600 text-center">
        A mostrar {filtered.length} de {mockCampaigns.length} campanhas
      </p>
    </div>
  );
}
