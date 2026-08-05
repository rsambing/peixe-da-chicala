"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { ApiSmsCampaign } from "@/lib/api-types";
import { Send } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

const AUDIENCE_LABEL: Record<string, string> = {
  ALL: "Todos os clientes",
  REGION: "Por região",
};

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "FAILED"
      ? "bg-red-100 text-red-700"
      : status === "QUEUED" || status === "scheduled"
      ? "bg-amber-100 text-amber-800"
      : "bg-green-100 text-green-800";
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
}

export default function MensagensPage() {
  const [regions, setRegions] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<ApiSmsCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [audienceType, setAudienceType] = useState<"ALL" | "REGION">("ALL");
  const [region, setRegion] = useState("");
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (audienceType === "REGION" && !region) {
      setPreviewCount(0);
      return;
    }
    adminApi
      .previewSmsAudience({ audienceType, region: audienceType === "REGION" ? region : undefined })
      .then((r) => setPreviewCount(r.count))
      .catch(() => setPreviewCount(null));
  }, [audienceType, region]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [r, c] = await Promise.all([adminApi.getSmsRegions(), adminApi.getSmsCampaigns()]);
      setRegions(r);
      setCampaigns(c);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar mensagens");
    } finally {
      setLoading(false);
    }
  }

  const segments = Math.max(1, Math.ceil(message.length / 160));
  const canSend =
    !sending &&
    name.trim().length > 0 &&
    message.trim().length > 0 &&
    (audienceType === "ALL" || !!region) &&
    !!previewCount;

  async function sendCampaign() {
    if (!previewCount) return;
    if (
      !confirm(
        `Isto vai enviar SMS pago a ${previewCount} destinatário(s) (≈ ${segments} crédito(s) cada). Confirma?`
      )
    ) {
      return;
    }
    setSending(true);
    try {
      const created = await adminApi.createSmsCampaign({
        name: name.trim(),
        message: message.trim(),
        audienceType,
        region: audienceType === "REGION" ? region : undefined,
      });
      setCampaigns((prev) => [created, ...prev]);
      setName("");
      setMessage("");
      setAudienceType("ALL");
      setRegion("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao enviar campanha");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Mensagens</h1>
        <p className="text-sm text-gray-500 mt-1">Campanhas de SMS para clientes — cada envio tem custo real.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Nova campanha */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 space-y-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nova campanha</p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da campanha (ex.: Promoção Fim-de-semana)"
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        />

        <div className="space-y-1.5">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 1600))}
            rows={4}
            placeholder="Escreva a mensagem…"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
          <p className="text-xs text-gray-400">
            {message.length}/1600 · ≈ {segments} crédito(s) SMS por destinatário
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="radio"
              checked={audienceType === "ALL"}
              onChange={() => { setAudienceType("ALL"); setRegion(""); }}
            />
            Todos os clientes
          </label>
          <label className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="radio"
              checked={audienceType === "REGION"}
              onChange={() => setAudienceType("REGION")}
            />
            Por região
          </label>

          {audienceType === "REGION" && (
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-300"
            >
              <option value="">Escolha a região…</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-gray-500">
            {previewCount === null ? "—" : `${previewCount} destinatário(s)`}
          </p>
          <button
            onClick={sendCampaign}
            disabled={!canSend}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-60 text-white font-bold text-sm transition-colors shrink-0"
          >
            <Send className="size-4" />
            {sending ? "A enviar…" : "Enviar campanha"}
          </button>
        </div>
      </div>

      {/* Histórico */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">A carregar…</div>
        ) : campaigns.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">Nenhuma campanha enviada ainda.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100/60 dark:border-white/5 bg-gray-50 dark:bg-gray-800/50">
                {["Nome", "Audiência", "Destinatários", "Estado", "Enviado por", "Data"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 dark:border-white/5">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{c.name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {AUDIENCE_LABEL[c.audienceType]}{c.region ? `: ${c.region}` : ""}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.recipientCount}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-gray-500">{c.createdBy?.name ?? "-"}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{formatDateTime(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
