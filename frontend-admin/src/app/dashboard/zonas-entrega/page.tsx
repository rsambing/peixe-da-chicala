"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { ApiDeliveryZone } from "@/lib/api-types";
import { Plus, Pencil, Trash2, Check, X, MapPin } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/SearchInput";
import { normalize } from "@/lib/utils";

function fmt(n: number) {
  return new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", minimumFractionDigits: 0 }).format(n);
}

export default function ZonasEntregaPage() {
  const [zones, setZones] = useState<ApiDeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  // New zone
  const [newName, setNewName] = useState("");
  const [newFee, setNewFee] = useState("");
  const [creating, setCreating] = useState(false);

  // Inline edit
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editFee, setEditFee] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setZones(await adminApi.getDeliveryZones());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar zonas de entrega");
    } finally {
      setLoading(false);
    }
  }

  async function createZone() {
    if (!newName.trim() || !newFee.trim()) return;
    setCreating(true);
    try {
      const created = await adminApi.createDeliveryZone({ name: newName.trim(), feeKz: Number(newFee) });
      setZones((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name, "pt")));
      setNewName("");
      setNewFee("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao criar");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(zone: ApiDeliveryZone) {
    setEditingId(zone.id);
    setEditName(zone.name);
    setEditFee(String(zone.feeKz));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditFee("");
  }

  async function saveEdit() {
    if (!editName.trim() || !editFee.trim() || !editingId) return;
    setSavingEdit(true);
    try {
      const updated = await adminApi.updateDeliveryZone(editingId, { name: editName.trim(), feeKz: Number(editFee) });
      setZones((prev) => prev.map((z) => (z.id === editingId ? updated : z)).sort((a, b) => a.name.localeCompare(b.name, "pt")));
      cancelEdit();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao actualizar");
    } finally {
      setSavingEdit(false);
    }
  }

  async function deleteZone(id: number) {
    if (!confirm("Eliminar esta zona de entrega?")) return;
    try {
      await adminApi.deleteDeliveryZone(id);
      setZones((prev) => prev.filter((z) => z.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao eliminar");
    }
  }

  const q = normalize(search.trim());
  const filtered = q ? zones.filter((z) => normalize(z.name).includes(q)) : zones;
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Zonas de Entrega</h1>
        <p className="text-sm text-gray-500 mt-1">{zones.length} zona(s) — bairros disponíveis no checkout com o respectivo preço de entrega.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Add new */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 space-y-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nova Zona</p>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Ex.: Talatona"
            className="flex-1 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
          <input
            type="number"
            min="0"
            value={newFee}
            onChange={(e) => setNewFee(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createZone()}
            placeholder="Preço (Kz)"
            className="w-full sm:w-40 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
          <button
            onClick={createZone}
            disabled={creating || !newName.trim() || !newFee.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-60 text-white font-bold text-sm transition-colors shrink-0 w-full sm:w-auto justify-center"
          >
            <Plus className="size-4" />
            {creating ? "A criar…" : "Criar"}
          </button>
        </div>
      </div>

      <SearchInput
        value={search}
        onChange={(v) => { setSearch(v); setPage(1); }}
        placeholder="Pesquisar bairro…"
        className="max-w-md"
      />

      {/* List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50 dark:divide-white/5 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className="size-8 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0" />
                <div className="flex-1 h-3.5 bg-gray-100 dark:bg-gray-800 rounded-full w-1/3" />
                <div className="w-16 h-3.5 bg-gray-100 dark:bg-gray-800 rounded-full" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            {q ? `Nenhuma zona encontrada para "${search.trim()}".` : "Nenhuma zona de entrega criada ainda."}
          </div>
        ) : (
          <>
          <ul>
            {visible.map((zone, i, arr) => (
              <li
                key={zone.id}
                className={[
                  "flex items-center gap-3 px-5 py-3",
                  i < arr.length - 1 ? "border-b border-gray-50 dark:border-white/5" : "",
                  "hover:bg-gray-50 dark:hover:bg-gray-800/30",
                ].join(" ")}
              >
                <div className="shrink-0 size-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <MapPin className="size-4 text-gray-400" />
                </div>

                {editingId === zone.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="flex-1 rounded-lg border border-zinc-300 bg-transparent px-2 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-300"
                    />
                    <input
                      type="number"
                      min="0"
                      value={editFee}
                      onChange={(e) => setEditFee(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="w-28 rounded-lg border border-zinc-300 bg-transparent px-2 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-300"
                    />
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{zone.name}</span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 shrink-0">{fmt(zone.feeKz)}</span>
                  </>
                )}

                <div className="flex items-center gap-1 shrink-0">
                  {editingId === zone.id ? (
                    <>
                      <button
                        onClick={saveEdit}
                        disabled={savingEdit}
                        className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/20 text-green-600 transition-colors disabled:opacity-50"
                      >
                        <Check className="size-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(zone)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => deleteZone(zone.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="px-5 py-3 border-t border-gray-50 dark:border-white/5">
            <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
          </div>
          </>
        )}
      </div>
    </div>
  );
}
