"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { ApiOrder, ApiProduct } from "@/lib/api-types";
import { ShoppingBag, Package, TrendingUp, Clock } from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  RECEBIDO: "Recebido",
  EM_PREPARACAO: "Em preparação",
  SAIU_PARA_ENTREGA: "A caminho",
  ENTREGUE: "Entregue",
  pending: "Recebido",
};

const STATUS_COLOR: Record<string, string> = {
  RECEBIDO: "bg-yellow-100 text-yellow-800",
  EM_PREPARACAO: "bg-blue-100 text-blue-800",
  SAIU_PARA_ENTREGA: "bg-purple-100 text-purple-800",
  ENTREGUE: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
};

function fmt(n: number) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(n);
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [o, p] = await Promise.all([adminApi.getOrders(), adminApi.getProducts()]);
        setOrders(o);
        setProducts(p);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const pending = orders.filter((o) =>
    ["RECEBIDO", "EM_PREPARACAO", "SAIU_PARA_ENTREGA", "pending"].includes(o.status)
  );
  const revenue = orders
    .filter((o) => o.status === "ENTREGUE")
    .reduce((sum, o) => sum + o.total, 0);
  const recent = orders.slice(0, 5);

  const stats = [
    { label: "Total de Pedidos", value: orders.length, icon: ShoppingBag, color: "text-blue-600" },
    { label: "Pedidos Activos", value: pending.length, icon: Clock, color: "text-zinc-400" },
    { label: "Produtos", value: products.length, icon: Package, color: "text-purple-600" },
    { label: "Receita (entregues)", value: fmt(revenue), icon: TrendingUp, color: "text-green-600" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral do restaurante</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 space-y-3 animate-pulse">
              <div className="size-5 rounded-md bg-gray-100 dark:bg-gray-800" />
              <div className="space-y-2">
                <div className="h-7 bg-gray-100 dark:bg-gray-800 rounded-full w-1/2" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4" />
              </div>
            </div>
          ))
        ) : stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 space-y-3"
            >
              <div className={`${s.color}`}>
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900 dark:text-white">
                  {s.value}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent orders */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100/60 dark:border-white/5 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 dark:text-white">Pedidos Recentes</h2>
          <a href="/dashboard/pedidos" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors hover:underline">
            Ver todos 
          </a>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-50 dark:divide-white/5 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3">
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-24 shrink-0" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-32 flex-1" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-20 shrink-0" />
                <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-full w-20 shrink-0" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-16 shrink-0" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="p-6 text-sm text-gray-400 text-center">
            Sem pedidos ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100/60 dark:border-white/5">
                  {["Código", "Cliente", "Total", "Estado", "Data"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                  >
                    <td className="px-6 py-3 font-mono font-bold text-gray-900 dark:text-white">
                      {order.trackingCode}
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-3 font-bold text-gray-900 dark:text-white">
                      {fmt(order.total)}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {STATUS_LABEL[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("pt-AO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
