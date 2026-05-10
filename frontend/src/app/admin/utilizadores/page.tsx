"use client";

import { useState } from "react";
import { Button, Badge } from "@/components/ui";
import Image from "next/image";
import {
  UserRole,
  KycStatus,
  PROVINCE_LABELS,
} from "@/lib/types";
import { mockUsers } from "@/lib/mock";
import {
  FiSearch,
  FiLock,
  FiTrash2,
  FiShield,
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { toast } from "sonner";

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.USER]: "Utilizador",
  [UserRole.MODERATOR]: "Moderador",
  [UserRole.ADMIN]: "Administrador",
};

const ROLE_BADGE: Record<UserRole, string> = {
  [UserRole.USER]: "default",
  [UserRole.MODERATOR]: "info",
  [UserRole.ADMIN]: "danger",
};

const KYC_LABELS: Record<KycStatus, string> = {
  [KycStatus.NOT_SUBMITTED]: "Não Submetido",
  [KycStatus.PENDING]: "Pendente",
  [KycStatus.UNDER_REVIEW]: "Em Análise",
  [KycStatus.VERIFIED]: "Verificado",
  [KycStatus.REJECTED]: "Rejeitado",
};

const KYC_BADGE: Record<KycStatus, string> = {
  [KycStatus.NOT_SUBMITTED]: "default",
  [KycStatus.PENDING]: "warning",
  [KycStatus.UNDER_REVIEW]: "info",
  [KycStatus.VERIFIED]: "success",
  [KycStatus.REJECTED]: "danger",
};

type FilterRole = "ALL" | UserRole;

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<FilterRole>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = mockUsers.filter((u) => {
    const matchesSearch =
      !search ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = mockUsers.reduce<Record<string, number>>(
    (acc, u) => ({ ...acc, [u.role]: (acc[u.role] || 0) + 1 }),
    {}
  );

  function handleSuspend(userId: string) {
    toast.success(`Utilizador ${userId} suspenso com sucesso.`);
  }

  function handlePromote(userId: string, role: UserRole) {
    toast.success(`Papel alterado para ${ROLE_LABELS[role]} para o utilizador ${userId}.`);
  }

  function handleDelete(userId: string) {
    toast.error(`Utilizador ${userId} eliminado.`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestão de Utilizadores</h1>
        <p className="text-sm text-gray-400 mt-1">
          Visualize, modere e gerencie todos os utilizadores da plataforma.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {Object.values(UserRole).map((role) => (
          <div
            key={role}
            className="rounded-xl border border-gray-800 bg-gray-900 p-3 text-center"
          >
            <p className="text-xl font-bold text-white">
              {roleCounts[role] || 0}
            </p>
            <p className="text-xs text-gray-500">{ROLE_LABELS[role]}s</p>
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
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as FilterRole)}
          className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/30"
        >
          <option value="ALL">Todos os papéis ({mockUsers.length})</option>
          {Object.values(UserRole).map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]} ({roleCounts[r] || 0})
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

            return (
              <div
                key={user.id}
                className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden"
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
                      <Image
                        src={user.avatarUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="size-10 object-cover"
                      />
                    ) : (
                      <div className="size-10 flex items-center justify-center text-sm font-bold text-gray-500">
                        {user.fullName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-200 truncate">
                        {user.fullName}
                      </p>
                      {user.isVerified && (
                        <FiShield className="size-3 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  {/* Badges */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <Badge
                      variant={KYC_BADGE[user.kycStatus] as "default" | "warning" | "info" | "success" | "danger"}
                      className="text-[10px]"
                    >
                      {KYC_LABELS[user.kycStatus]}
                    </Badge>
                  </div>

                  <Badge
                    variant={ROLE_BADGE[user.role] as "default" | "warning" | "info" | "success" | "danger"}
                    className="text-[10px] shrink-0"
                  >
                    {ROLE_LABELS[user.role]}
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
                    {/* Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <FiMail className="size-3.5 text-gray-500" />
                        <span className="text-gray-300 text-xs truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiPhone className="size-3.5 text-gray-500" />
                        <span className="text-gray-300 text-xs">{user.phoneNumber || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="size-3.5 text-gray-500" />
                        <span className="text-gray-300 text-xs">
                          {user.province ? PROVINCE_LABELS[user.province] : "—"}
                          {user.municipality ? `, ${user.municipality}` : ""}
                        </span>
                      </div>
                    </div>

                    {user.bio && (
                      <p className="text-xs text-gray-400 italic">
                        &ldquo;{user.bio}&rdquo;
                      </p>
                    )}

                    <div className="text-xs text-gray-500">
                      Registo: {new Date(user.createdAt).toLocaleDateString("pt-AO", { year: "numeric", month: "long", day: "numeric" })}
                      {" · "}KYC: {KYC_LABELS[user.kycStatus]}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-800">
                      {/* Role change */}
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 mr-1">Papel:</span>
                        {Object.values(UserRole).map((role) => (
                          <button
                            key={role}
                            onClick={() => handlePromote(user.id, role)}
                            className={`px-2 py-1 text-[10px] rounded font-medium transition-colors ${
                              user.role === role
                                ? "bg-red-600/20 text-red-400"
                                : "bg-gray-800 text-gray-500 hover:text-gray-300"
                            }`}
                          >
                            {ROLE_LABELS[role]}
                          </button>
                        ))}
                      </div>

                      <div className="flex-1" />

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-400 hover:text-amber-300"
                        onClick={() => handleSuspend(user.id)}
                      >
                        <FiLock className="size-3.5 mr-1" /> Suspender
                      </Button>

                      {user.role !== UserRole.ADMIN && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(user.id)}
                        >
                          <FiTrash2 className="size-3.5 mr-1" /> Eliminar
                        </Button>
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
        A mostrar {filtered.length} de {mockUsers.length} utilizadores
      </p>
    </div>
  );
}
