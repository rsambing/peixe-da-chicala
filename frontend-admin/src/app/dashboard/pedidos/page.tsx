"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { adminApi } from "@/lib/api";
import type { ApiOrder } from "@/lib/api-types";
import { ChevronDown, Trash2, X, MapPin, Phone, User, Clock } from "lucide-react";
import { Pagination } from "@/components/Pagination";

const STATUSES = [
  { value: "RECEBIDO",          label: "Recebido",      color: "bg-amber-100 text-amber-800"   },
  { value: "EM_PREPARACAO",     label: "Em preparação", color: "bg-blue-100 text-blue-800"     },
  { value: "SAIU_PARA_ENTREGA", label: "A caminho",     color: "bg-purple-100 text-purple-800" },
  { value: "ENTREGUE",          label: "Entregue",      color: "bg-green-100 text-green-800"   },
];

const ALL_FILTERS = [{ value: "ALL", label: "Todos" }, ...STATUSES];

function fmt(n: number) {
  return new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", minimumFractionDigits: 0 }).format(n);
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUSES.find((x) => x.value === status);
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${s?.color ?? "bg-gray-100 text-gray-600"}`}>
      {s?.label ?? status}
    </span>
  );
}

function getProductImage(item: ApiOrder["items"][0]): string | null {
  const p = item.product;
  if (!p) return null;
  if (p.images?.length) return p.images[0].imageUrl;
  return p.imageUrl ?? null;
}

function OrderDetailPanel({ order, onClose, onStatusChange, updating }: {
  order: ApiOrder;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
  updating: number | null;
}) {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-lg bg-white dark:bg-gray-950 h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-mono font-bold text-xs text-gray-400">{order.trackingCode}</p>
            <p className="font-black text-lg text-gray-900 dark:text-white">{order.customerName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <span className="text-gray-300 dark:text-gray-600">→</span>
            <div className="relative inline-flex items-center gap-1">
              <select
                value={order.status}
                disabled={updating === order.id}
                onChange={(e) => onStatusChange(order.id, e.target.value)}
                className="appearance-none bg-gray-50 dark:bg-gray-800 pr-7 cursor-pointer text-sm rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-50 font-medium"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
            </div>
            {updating === order.id && (
              <span className="text-xs text-gray-400 animate-pulse">A guardar…</span>
            )}
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wide">
                <User className="size-3.5" /> Cliente
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{order.customerName}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wide">
                <Phone className="size-3.5" /> Telefone
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{order.phone}</p>
            </div>
            {order.address && (
              <div className="col-span-2 bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wide">
                  <MapPin className="size-3.5" />
                  {order.address === "RETIRADA" ? "Método" : "Endereço"}
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {order.address === "RETIRADA" ? "Retirada no local" : order.address}
                </p>
              </div>
            )}
            <div className="col-span-2 bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wide">
                <Clock className="size-3.5" /> Data
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {new Date(order.createdAt).toLocaleString("pt-AO", {
                  day: "2-digit", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Items */}
          {order.items?.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Itens do pedido ({order.items.length})
              </p>

              <div className="space-y-3">
                {order.items.map((item) => {
                  const img = getProductImage(item);
                  const name = item.product?.name ?? `Produto #${item.productId}`;
                  const allImages = item.product?.images ?? [];

                  return (
                    <div key={item.id} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        {/* Image(s) */}
                        <div className="relative size-16 shrink-0 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
                          {img ? (
                            <Image src={img} alt={name} fill className="object-cover" sizes="64px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-black text-gray-900 dark:text-white text-sm leading-snug">{name}</p>
                            <p className="font-black text-gray-900 dark:text-white text-sm shrink-0">
                              {fmt(item.price * item.quantity)}
                            </p>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.quantity}× {fmt(item.price)} cada
                          </p>
                          {item.note && (
                            <div className="mt-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-lg px-3 py-2">
                              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                                📝 {item.note}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Extra product images row */}
                      {allImages.length > 1 && (
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                          {allImages.map((pi) => (
                            <div key={pi.id} className="relative size-12 shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                              <Image src={pi.imageUrl} alt="" fill className="object-cover" sizes="48px" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 text-sm">Total do pedido</span>
                <span className="font-black text-lg text-gray-900 dark:text-white">{fmt(order.total)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;
  const [updating, setUpdating] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ApiOrder | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setOrders(await adminApi.getOrders());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id: number, status: string) {
    setUpdating(id);
    try {
      const updated = await adminApi.updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...updated } : o)));
      setSelected((prev) => prev?.id === id ? { ...prev, ...updated } : prev);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao actualizar estado");
    } finally {
      setUpdating(null);
    }
  }

  async function deleteOrder(id: number) {
    if (!confirm("Eliminar este pedido?")) return;
    setDeleting(id);
    try {
      await adminApi.deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao eliminar");
    } finally {
      setDeleting(null);
    }
  }

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} pedido(s) no total</p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Actualizar
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {ALL_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setFilter(f.value); setPage(1); }}
            className={[
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              filter === f.value
                ? "bg-zinc-900 text-white"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-zinc-300",
            ].join(" ")}
          >
            {f.label}
            {f.value !== "ALL" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({orders.filter((o) => o.status === f.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-white dark:bg-gray-900 rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      )}

      {!loading && visible.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 text-center text-sm text-gray-400">
          Nenhum pedido encontrado.
        </div>
      )}

      {!loading && visible.length > 0 && (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {visible.map((order) => (
              <button
                key={order.id}
                className="w-full text-left bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden px-4 py-3 flex items-start justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                onClick={() => setSelected(order)}
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="font-mono font-bold text-xs text-gray-900 dark:text-white">{order.trackingCode}</p>
                  <p className="font-medium text-sm text-gray-700 dark:text-gray-300 truncate">{order.customerName}</p>
                  <p className="text-xs text-gray-400">{order.phone}</p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <p className="font-bold text-sm text-gray-900 dark:text-white">{fmt(order.total)}</p>
                  <StatusBadge status={order.status} />
                </div>
              </button>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100/60 dark:border-white/5 bg-gray-50 dark:bg-gray-800/50">
                  {["Código", "Cliente", "Telefone", "Endereço", "Total", "Estado", "Data", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer"
                    onClick={() => setSelected(order)}
                  >
                    <td className="px-4 py-3 font-mono font-bold text-gray-900 dark:text-white text-xs">{order.trackingCode}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">{order.customerName}</td>
                    <td className="px-4 py-3 text-gray-500">{order.phone}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">{order.address || "-"}</td>
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{fmt(order.total)}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("pt-AO")}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        disabled={deleting === order.id}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-red-500 text-gray-300 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        <Pagination
          page={page}
          total={filtered.length}
          pageSize={PAGE_SIZE}
          onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        />
        </>
      )}

      {/* Detail panel */}
      {selected && (
        <OrderDetailPanel
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={changeStatus}
          updating={updating}
        />
      )}
    </div>
  );
}
