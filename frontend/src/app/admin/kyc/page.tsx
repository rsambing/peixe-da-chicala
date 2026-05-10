"use client";

import { useState } from "react";
import { Button, Badge } from "@/components/ui";
import { KycStatus, PROVINCE_LABELS } from "@/lib/types";
import { mockUsers, timeAgo } from "@/lib/mock";
import Image from "next/image";
import {
  FiSearch,
  FiCheck,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiFileText,
  FiCamera,
  FiUser,
} from "react-icons/fi";
import { toast } from "sonner";

const KYC_STATUS_LABELS: Record<KycStatus, string> = {
  [KycStatus.NOT_SUBMITTED]: "Não Submetido",
  [KycStatus.PENDING]: "Pendente",
  [KycStatus.UNDER_REVIEW]: "Em Análise",
  [KycStatus.VERIFIED]: "Verificado",
  [KycStatus.REJECTED]: "Rejeitado",
};

const KYC_BADGE_MAP: Record<KycStatus, string> = {
  [KycStatus.NOT_SUBMITTED]: "default",
  [KycStatus.PENDING]: "warning",
  [KycStatus.UNDER_REVIEW]: "info",
  [KycStatus.VERIFIED]: "success",
  [KycStatus.REJECTED]: "danger",
};

type FilterKyc = "ALL" | KycStatus;

// Simulated KYC documents
const MOCK_KYC_DOCS: Record<string, { type: string; name: string; date: string }[]> = {
  "user-3": [
    { type: "bi", name: "BI_frente.jpg", date: "2025-11-10T09:15:00Z" },
    { type: "bi_back", name: "BI_verso.jpg", date: "2025-11-10T09:16:00Z" },
    { type: "selfie", name: "selfie_maria.jpg", date: "2025-11-10T09:20:00Z" },
  ],
};

export default function AdminKycPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterKyc>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Only show users who have submitted or are in some KYC state
  const kycUsers = mockUsers.filter(
    (u) => u.kycStatus !== KycStatus.NOT_SUBMITTED
  );

  const filtered = kycUsers.filter((u) => {
    const matchesSearch =
      !search ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || u.kycStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = kycUsers.reduce<Record<string, number>>(
    (acc, u) => ({ ...acc, [u.kycStatus]: (acc[u.kycStatus] || 0) + 1 }),
    {}
  );

  function handleApprove(userId: string) {
    toast.success(`KYC aprovado! Utilizador ${userId} verificado.`);
  }

  function handleReject(userId: string) {
    toast.error(`KYC rejeitado. Utilizador ${userId} será notificado.`);
  }


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Verificação KYC</h1>
        <p className="text-sm text-gray-400 mt-1">
          Reveja os documentos de verificação dos utilizadores.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Pendentes", count: statusCounts[KycStatus.PENDING] || 0, color: "text-amber-400" },
          { label: "Em Análise", count: statusCounts[KycStatus.UNDER_REVIEW] || 0, color: "text-blue-400" },
          { label: "Verificados", count: statusCounts[KycStatus.VERIFIED] || 0, color: "text-emerald-400" },
          { label: "Rejeitados", count: statusCounts[KycStatus.REJECTED] || 0, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-800 bg-gray-900 p-3 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-lg border border-gray-700 bg-gray-800 pl-9 pr-3 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FilterKyc)}
          className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/30"
        >
          <option value="ALL">Todos ({kycUsers.length})</option>
          {Object.values(KycStatus)
            .filter((s) => s !== KycStatus.NOT_SUBMITTED)
            .map((s) => (
              <option key={s} value={s}>
                {KYC_STATUS_LABELS[s]} ({statusCounts[s] || 0})
              </option>
            ))}
        </select>
      </div>

      {/* User list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-12 text-center text-gray-500">
            Nenhum utilizador encontrado.
          </div>
        ) : (
          filtered.map((user) => {
            const isExpanded = expandedId === user.id;
            const isPending =
              user.kycStatus === KycStatus.PENDING ||
              user.kycStatus === KycStatus.UNDER_REVIEW;
            const docs = MOCK_KYC_DOCS[user.id] || [];

            return (
              <div
                key={user.id}
                className={`rounded-xl border bg-gray-900 overflow-hidden transition-colors ${
                  isPending ? "border-amber-500/30" : "border-gray-800"
                }`}
              >
                {/* Row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : user.id)
                  }
                >
                  {/* Avatar */}
                  <div className="size-10 rounded-full bg-gray-800 overflow-hidden shrink-0">
                    {user.avatarUrl ? (
                      <Image src={user.avatarUrl} alt="" width={40} height={40} className="size-10 object-cover" />
                    ) : (
                      <div className="size-10 flex items-center justify-center text-sm font-bold text-gray-500">
                        {user.fullName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <div className="hidden sm:block text-right shrink-0 mr-2">
                    <p className="text-xs text-gray-500">
                      Registo: {timeAgo(user.createdAt)}
                    </p>
                  </div>

                  <Badge
                    variant={KYC_BADGE_MAP[user.kycStatus] as "active" | "warning" | "info" | "success" | "danger" | "default"}
                    className="text-[10px] shrink-0"
                  >
                    {KYC_STATUS_LABELS[user.kycStatus]}
                  </Badge>

                  {isExpanded ? (
                    <FiChevronUp className="size-4 text-gray-500 shrink-0" />
                  ) : (
                    <FiChevronDown className="size-4 text-gray-500 shrink-0" />
                  )}
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t border-gray-800 px-5 py-4 space-y-4">
                    {/* User details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs block">Telefone</span>
                        <span className="text-gray-200">
                          {user.phoneNumber || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">Província</span>
                        <span className="text-gray-200">
                          {user.province ? PROVINCE_LABELS[user.province] : "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">Município</span>
                        <span className="text-gray-200">
                          {user.municipality || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs block">Verifcado</span>
                        <span className="text-gray-200">
                          {user.isVerified ? "Sim" : "Não"}
                        </span>
                      </div>
                    </div>

                    {/* Documents */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                        Documentos Submetidos
                      </h4>
                      {docs.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          Nenhum documento submetido.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {docs.map((doc, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 p-3 rounded-lg bg-gray-800 border border-gray-700"
                            >
                              {doc.type === "selfie" ? (
                                <FiCamera className="size-4 text-blue-400 shrink-0" />
                              ) : doc.type.includes("bi") ? (
                                <FiFileText className="size-4 text-amber-400 shrink-0" />
                              ) : (
                                <FiUser className="size-4 text-gray-400 shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-200 truncate">{doc.name}</p>
                                <p className="text-[10px] text-gray-500">{timeAgo(doc.date)}</p>
                              </div>
                              <button className="text-gray-500 hover:text-gray-300">
                                <FiDownload className="size-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                      <div className="flex-1" />
                      {isPending && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleReject(user.id)}
                          >
                            <FiX className="size-4 mr-1" /> Rejeitar
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-500"
                            onClick={() => handleApprove(user.id)}
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

      <p className="text-xs text-gray-600 text-center">
        A mostrar {filtered.length} de {kycUsers.length} utilizadores com KYC
      </p>
    </div>
  );
}
