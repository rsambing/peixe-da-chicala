"use client";

import { Badge } from "@/components/ui";
import Image from "next/image";
import { DONATION_STATUS_LABELS, PAYMENT_LABELS, DonationStatus } from "@/lib/types";
import {
  mockDonations,
  mockAdminStats,
  formatCurrency,
} from "@/lib/mock";
import {
  FiDollarSign,
  FiTrendingUp,
  FiCreditCard,
  FiAlertCircle,
} from "react-icons/fi";

export default function AdminFinanceiroPage() {
  const completedTotal = mockDonations
    .filter((d) => d.status === DonationStatus.COMPLETED)
    .reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Financeiro</h1>
        <p className="text-sm text-gray-400 mt-1">
          Visão geral das finanças da plataforma.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Arrecadado",
            value: formatCurrency(mockAdminStats.totalRaised),
            icon: FiDollarSign,
            color: "text-emerald-400",
          },
          {
            label: "Taxas da Plataforma",
            value: formatCurrency(mockAdminStats.platformFees),
            icon: FiTrendingUp,
            color: "text-amber-400",
          },
          {
            label: "Doações Concluídas",
            value: formatCurrency(completedTotal),
            icon: FiCreditCard,
            color: "text-blue-400",
          },
          {
            label: "Provas Pendentes",
            value: mockAdminStats.pendingProofs,
            icon: FiAlertCircle,
            color: "text-red-400",
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <stat.icon className={`size-5 ${stat.color} mb-2`} />
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* All donations table */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h2 className="font-semibold text-white text-sm">Todas as Doações</h2>
        </div>

        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-2 text-xs text-gray-500 border-b border-gray-800 uppercase tracking-wide">
          <span>Doador</span>
          <span>Campanha</span>
          <span>Método</span>
          <span className="text-right">Valor</span>
          <span className="text-right">Estado</span>
        </div>

        <div className="divide-y divide-gray-800">
          {mockDonations.map((donation) => (
            <div
              key={donation.id}
              className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto_auto] gap-2 sm:gap-4 px-5 py-3 items-center"
            >
              {/* Donor */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="size-7 rounded-full bg-gray-800 overflow-hidden shrink-0">
                  {!donation.isAnonymous && donation.donor?.avatarUrl ? (
                    <Image src={donation.donor.avatarUrl} alt="" width={28} height={28} className="size-7 object-cover" />
                  ) : (
                    <div className="size-7 flex items-center justify-center text-[10px] font-bold text-gray-500">
                      {donation.isAnonymous ? "A" : donation.donor?.fullName?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-200 truncate">
                    {donation.isAnonymous ? "Anónimo" : donation.donor?.fullName}
                  </p>
                  <p className="text-[10px] text-gray-500 sm:hidden">
                    {donation.campaign?.title}
                  </p>
                </div>
              </div>

              {/* Campaign */}
              <p className="text-xs text-gray-400 truncate hidden sm:block">
                {donation.campaign?.title}
              </p>

              {/* Method */}
              <p className="text-xs text-gray-500 hidden sm:block">
                {PAYMENT_LABELS[donation.paymentProvider]}
              </p>

              {/* Amount */}
              <p className="text-sm font-bold text-emerald-400 sm:text-right">
                {formatCurrency(donation.amount)}
              </p>

              {/* Status */}
              <div className="sm:text-right">
                <Badge
                  variant={
                    donation.status === DonationStatus.COMPLETED
                      ? "success"
                      : donation.status === DonationStatus.PENDING
                      ? "warning"
                      : donation.status === DonationStatus.FAILED
                      ? "danger"
                      : "default"
                  }
                  className="text-[10px]"
                >
                  {DONATION_STATUS_LABELS[donation.status]}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
