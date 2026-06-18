"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { ApiOrder } from "@/lib/api-types";
import { ChevronDown, Trash2 } from "lucide-react";

const STATUSES = [
  { value: "RECEBIDO", label: "Recebido", color: "bg-yellow-100 text-yellow-800" },
  { value: "EM_PREPARACAO", label: "Em preparação", color: "bg-blue-100 text-blue-800" },
  { value: "SAIU_PARA_ENTREGA", label: "A caminho", color: "bg-purple-100 text-purple-800" },
  { value: "ENTREGUE", label: "Entregue", color: "bg-green-100 text-green-800" },
];

const ALL_FILTERS = [{ value: "ALL", label: "Todos" }, ...STATUSES];

function fmt(n: number) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(n);
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUSES.find((x) => x.value === status);
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
        s?.color ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {s?.label ?? status}
    </span>
  );
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [updating, setUpdating] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getOrders();
      setOrders(data);
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
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao eliminar");
    } finally {
      setDeleting(null);
    }
  }

  const visible = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="p-8 space-y-6">
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
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {ALL_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={[
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              filter === f.value
                ? "bg-red-500 text-white"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-300",
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

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Nenhum pedido encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  {["Código", "Cliente", "Telefone", "Endereço", "Total", "Estado", "Data", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((order) => (
                  <>
                    <tr
                      key={order.id}
                      className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer"
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-gray-900 dark:text-white text-xs">
                        {order.trackingCode}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">
                        {order.customerName}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{order.phone}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">
                        {order.address || "—"}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                        {fmt(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.status}
                            disabled={updating === order.id}
                            onChange={(e) => changeStatus(order.id, e.target.value)}
                            className="appearance-none bg-transparent pr-6 cursor-pointer text-xs rounded-lg border border-gray-200 dark:border-gray-700 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
                          >
                            {STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("pt-AO")}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteOrder(order.id); }}
                          disabled={deleting === order.id}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 text-gray-400 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded items */}
                    {expanded === order.id && order.items && order.items.length > 0 && (
                      <tr key={`${order.id}-items`} className="bg-red-50/50 dark:bg-red-950/10">
                        <td colSpan={8} className="px-6 py-3">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Itens do pedido
                          </p>
                          <div className="space-y-1">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                                <span>
                                  {item.quantity}× {item.product?.name ?? `Produto #${item.productId}`}
                                </span>
                                <span className="font-bold">{fmt(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
