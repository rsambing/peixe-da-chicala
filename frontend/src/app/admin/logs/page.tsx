"use client";

import { Badge } from "@/components/ui";

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  details: string;
  level: "info" | "warning" | "error";
}

const mockLogs: AuditLog[] = [
  {
    id: "log-1",
    timestamp: "2026-02-10T14:30:00Z",
    actor: "Super Admin",
    action: "campaign.approve",
    resource: "Construção da Escola Primária em Viana",
    details: "Campanha aprovada e publicada.",
    level: "info",
  },
  {
    id: "log-2",
    timestamp: "2026-02-10T12:15:00Z",
    actor: "Pedro Nkanga",
    action: "kyc.approve",
    resource: "Ana Beatriz Mendes",
    details: "KYC verificado com sucesso.",
    level: "info",
  },
  {
    id: "log-3",
    timestamp: "2026-02-09T18:00:00Z",
    actor: "Sistema",
    action: "campaign.expire",
    resource: "Festival Cultural da Huíla",
    details: "Campanha expirada automaticamente (prazo esgotado).",
    level: "warning",
  },
  {
    id: "log-4",
    timestamp: "2026-02-09T10:45:00Z",
    actor: "Super Admin",
    action: "user.suspend",
    resource: "utilizador-spam-123",
    details: "Utilizador suspenso por actividade suspeita.",
    level: "error",
  },
  {
    id: "log-5",
    timestamp: "2026-02-08T16:20:00Z",
    actor: "Sistema",
    action: "donation.complete",
    resource: "DON-20260208-012",
    details: "Doação de 200.000 Kz processada via Multicaixa Express.",
    level: "info",
  },
  {
    id: "log-6",
    timestamp: "2026-02-08T09:00:00Z",
    actor: "Pedro Nkanga",
    action: "campaign.reject",
    resource: "Campanha Teste XYZ",
    details: "Rejeitada: documentação insuficiente.",
    level: "error",
  },
  {
    id: "log-7",
    timestamp: "2026-02-07T14:00:00Z",
    actor: "Sistema",
    action: "payment.failed",
    resource: "DON-20260207-008",
    details: "Falha no pagamento Unitel Money — timeout.",
    level: "warning",
  },
  {
    id: "log-8",
    timestamp: "2026-02-07T11:30:00Z",
    actor: "Super Admin",
    action: "user.role_change",
    resource: "Pedro Nkanga",
    details: "Papel alterado de USER para MODERATOR.",
    level: "info",
  },
];

const LEVEL_BADGE: Record<AuditLog["level"], string> = {
  info: "info",
  warning: "warning",
  error: "danger",
};

const LEVEL_LABEL: Record<AuditLog["level"], string> = {
  info: "Info",
  warning: "Aviso",
  error: "Erro",
};

export default function AdminLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Logs de Auditoria</h1>
        <p className="text-sm text-gray-400 mt-1">
          Registo de todas as acções administrativas e eventos do sistema.
        </p>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
        <div className="divide-y divide-gray-800">
          {mockLogs.map((log) => {
            const date = new Date(log.timestamp);
            return (
              <div
                key={log.id}
                className="px-5 py-4 flex items-start gap-4"
              >
                {/* Timestamp */}
                <div className="shrink-0 text-right w-20 hidden sm:block">
                  <p className="text-xs text-gray-400 font-mono">
                    {date.toLocaleDateString("pt-AO", { day: "2-digit", month: "2-digit" })}
                  </p>
                  <p className="text-[10px] text-gray-600 font-mono">
                    {date.toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                {/* Dot */}
                <div className="relative mt-1.5 shrink-0">
                  <div
                    className={`size-2.5 rounded-full ${
                      log.level === "error"
                        ? "bg-red-500"
                        : log.level === "warning"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-gray-200">
                      {log.action}
                    </span>
                    <Badge
                      variant={LEVEL_BADGE[log.level] as "info" | "warning" | "danger" | "default"}
                      className="text-[10px]"
                    >
                      {LEVEL_LABEL[log.level]}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400">{log.details}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-gray-600">
                      Actor: <span className="text-gray-400">{log.actor}</span>
                    </span>
                    <span className="text-[10px] text-gray-600">
                      Recurso: <span className="text-gray-400">{log.resource}</span>
                    </span>
                    <span className="text-[10px] text-gray-600 sm:hidden">
                      {date.toLocaleDateString("pt-AO")} {date.toLocaleTimeString("pt-AO", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-gray-600 text-center">
        A mostrar {mockLogs.length} eventos mais recentes
      </p>
    </div>
  );
}
