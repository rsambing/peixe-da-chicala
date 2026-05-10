"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import Image from "next/image";
import {
  CampaignStatus,
  KycStatus,
  STATUS_LABELS,
  CATEGORY_LABELS,
} from "@/lib/types";
import { CategoryIcon } from "@/components/features/campaigns";
import {
  mockAdminStats,
  mockCampaigns,
  mockUsers,
  mockDonations,
  formatCurrency,
  formatNumber,
  timeAgo,
} from "@/lib/mock";
import {
  FiTrendingUp,
  FiUsers,
  FiFlag,
  FiDollarSign,
  FiShield,
  FiClock,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";

const STAT_CARDS = [
  {
    label: "Total Arrecadado",
    value: formatCurrency(mockAdminStats.totalRaised),
    icon: FiDollarSign,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Campanhas Activas",
    value: mockAdminStats.activeCampaigns,
    icon: FiFlag,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    label: "Doadores Únicos",
    value: formatNumber(mockAdminStats.uniqueDonors),
    icon: FiUsers,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    label: "Taxas da Plataforma",
    value: formatCurrency(mockAdminStats.platformFees),
    icon: FiTrendingUp,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

export default function AdminDashboardPage() {
  const pendingCampaigns = mockCampaigns.filter(
    (c) => c.status === CampaignStatus.PENDING_REVIEW
  );
  const pendingKycUsers = mockUsers.filter(
    (u) => u.kycStatus === KycStatus.PENDING || u.kycStatus === KycStatus.UNDER_REVIEW
  );
  const recentDonations = mockDonations.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Painel de Administração</h1>
        <p className="text-sm text-gray-400 mt-1">
          Visão geral da plataforma Levanta Angola
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-800 bg-gray-900 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`size-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`size-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Campanhas Pendentes",
            count: mockAdminStats.pendingCampaigns,
            href: "/admin/campanhas",
            color: "border-amber-500/40 bg-amber-500/5",
            icon: FiClock,
            iconColor: "text-amber-400",
          },
          {
            label: "KYC Pendente",
            count: mockAdminStats.pendingKyc,
            href: "/admin/kyc",
            color: "border-blue-500/40 bg-blue-500/5",
            icon: FiShield,
            iconColor: "text-blue-400",
          },
          {
            label: "Provas Pendentes",
            count: mockAdminStats.pendingProofs,
            href: "/admin/financeiro",
            color: "border-red-500/40 bg-red-500/5",
            icon: FiAlertCircle,
            iconColor: "text-red-400",
          },
        ].map((alert) => (
          <Link
            key={alert.label}
            href={alert.href}
            className={`rounded-xl border ${alert.color} p-4 flex items-center gap-3 hover:opacity-80 transition-opacity`}
          >
            <alert.icon className={`size-5 ${alert.iconColor}`} />
            <div className="flex-1">
              <p className="text-sm text-gray-300">{alert.label}</p>
              <p className="text-xl font-bold text-white">{alert.count}</p>
            </div>
            <FiArrowRight className="size-4 text-gray-600" />
          </Link>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Campaigns */}
        <div className="rounded-xl border border-gray-800 bg-gray-900">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white text-sm">
              Campanhas para Análise
            </h2>
            <Link
              href="/admin/campanhas"
              className="text-xs text-red-400 hover:underline"
            >
              Ver todas →
            </Link>
          </div>
          {pendingCampaigns.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              Nenhuma campanha pendente.
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {pendingCampaigns.map((campaign) => (
                <div key={campaign.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="size-10 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                    {campaign.media[0] && (
                      <Image
                        src={campaign.media[0].url}
                        alt=""
                        width={40}
                        height={40}
                        className="size-10 object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {campaign.title}
                    </p>
                    <p className="text-xs text-gray-500 inline-flex items-center gap-1">
                      <CategoryIcon category={campaign.category} className="size-3" />
                      {CATEGORY_LABELS[campaign.category]} ·{" "}
                      {campaign.creator.fullName}
                    </p>
                  </div>
                  <Badge variant="pending" className="text-[10px]">
                    {STATUS_LABELS[campaign.status]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Donations */}
        <div className="rounded-xl border border-gray-800 bg-gray-900">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white text-sm">
              Doações Recentes
            </h2>
            <Link
              href="/admin/financeiro"
              className="text-xs text-red-400 hover:underline"
            >
              Ver todas →
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {recentDonations.map((donation) => (
              <div key={donation.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-200 truncate">
                    {donation.isAnonymous
                      ? "Doador Anónimo"
                      : donation.donor?.fullName || "—"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {donation.campaign?.title} · {timeAgo(donation.createdAt)}
                  </p>
                </div>
                <p className="text-sm font-bold text-emerald-400 shrink-0">
                  {formatCurrency(donation.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KYC Pending Users */}
      {pendingKycUsers.length > 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white text-sm">
              Verificações KYC Pendentes
            </h2>
            <Link
              href="/admin/kyc"
              className="text-xs text-red-400 hover:underline"
            >
              Rever →
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {pendingKycUsers.map((user) => (
              <div key={user.id} className="px-5 py-3 flex items-center gap-3">
                <div className="size-9 rounded-full bg-gray-800 overflow-hidden shrink-0">
                  {user.avatarUrl ? (
                    <Image src={user.avatarUrl} alt="" width={36} height={36} className="size-9 object-cover" />
                  ) : (
                    <div className="size-9 flex items-center justify-center text-xs font-bold text-gray-400">
                      {user.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Badge variant="warning" className="text-[10px]">
                  {user.kycStatus === KycStatus.PENDING ? "Pendente" : "Em Análise"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
