"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { Clock, Flame, Truck, CheckCircle2, MapPin, Trash2 } from "lucide-react";
import { Button, Input, ImageWithFallback } from "@/components/ui";
import { PaymentInstructions } from "@/components/PaymentInstructions";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/menu";
import { api } from "@/lib/api";
import type { ApiOrder } from "@/lib/api-types";
import { getLocalOrders, removeLocalOrder, clearLocalOrders, type LocalOrderEntry } from "@/lib/order-history";

const ORDER_FLOW: OrderStatus[] = [
  "RECEBIDO",
  "EM_PREPARACAO",
  "SAIU_PARA_ENTREGA",
  "ENTREGUE",
];

const STEP_META: Record<OrderStatus, { icon: React.ElementType; color: string; bg: string; desc: string }> = {
  RECEBIDO:          { icon: Clock,         color: "text-amber-500",  bg: "bg-amber-50",  desc: "O seu pedido foi recebido e está a aguardar confirmação." },
  EM_PREPARACAO:     { icon: Flame,         color: "text-orange-500", bg: "bg-orange-50", desc: "Os nossos cozinheiros já estão a preparar o seu pedido." },
  SAIU_PARA_ENTREGA: { icon: Truck,         color: "text-blue-500",   bg: "bg-blue-50",   desc: "O seu pedido está a caminho!" },
  ENTREGUE:          { icon: CheckCircle2,  color: "text-green-500",  bg: "bg-green-50",  desc: "Pedido entregue. Bom proveito!" },
};

const STATUS_MAP: Record<string, OrderStatus> = {
  RECEBIDO: "RECEBIDO", pending: "RECEBIDO",
  EM_PREPARACAO: "EM_PREPARACAO", preparing: "EM_PREPARACAO",
  SAIU_PARA_ENTREGA: "SAIU_PARA_ENTREGA", delivery: "SAIU_PARA_ENTREGA",
  ENTREGUE: "ENTREGUE", delivered: "ENTREGUE",
};

function mapStatus(raw: string): OrderStatus {
  return STATUS_MAP[raw] ?? "RECEBIDO";
}

function estimateFromStatus(status: OrderStatus) {
  switch (status) {
    case "RECEBIDO": return "45–60 min";
    case "EM_PREPARACAO": return "30–45 min";
    case "SAIU_PARA_ENTREGA": return "10–20 min";
    case "ENTREGUE": return null;
  }
}

function fmt(n: number) {
  return `${n.toLocaleString("pt-AO")} Kz`;
}

function getProductImage(item: ApiOrder["items"][0]): string | null {
  const p = item.product;
  if (!p) return null;
  if (p.images?.length) return p.images[0].imageUrl;
  return p.imageUrl ?? null;
}

export function TrackOrderClient() {
  const params = useSearchParams();
  const initial = params.get("codigo") ?? "";

  const [code, setCode] = useState(initial);
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localOrders, setLocalOrders] = useState<LocalOrderEntry[]>(() =>
    typeof window === "undefined" ? [] : getLocalOrders()
  );
  const [showPayment, setShowPayment] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    api.getSettings().then((s) => setWhatsappNumber(s.contactWhatsapp)).catch(() => {});
  }, []);

  async function fetchOrder(trackingCode: string) {
    setIsLoading(true);
    setError(null);
    setOrder(null);
    setShowPayment(false);
    try {
      setOrder(await api.getOrderByTrackingCode(trackingCode));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pedido não encontrado.");
    } finally {
      setIsLoading(false);
    }
  }

  function selectLocalOrder(entry: LocalOrderEntry) {
    setCode(entry.trackingCode);
    fetchOrder(entry.trackingCode);
  }

  function removeFromLocalOrders(trackingCode: string) {
    if (!confirm("Remover este pedido da lista deste dispositivo?")) return;
    removeLocalOrder(trackingCode);
    setLocalOrders(getLocalOrders());
  }

  function clearAllLocalOrders() {
    if (!confirm("Limpar toda a lista de pedidos deste dispositivo? Esta ação não pode ser desfeita.")) return;
    clearLocalOrders();
    setLocalOrders([]);
  }

  const status = order ? mapStatus(order.status) : null;
  const stepIndex = status ? ORDER_FLOW.indexOf(status) : -1;

  const resultRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const activeIconRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!order || !status || !resultRef.current) return;

    gsap.fromTo(resultRef.current,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );

    const targetPct = ((stepIndex + 1) / ORDER_FLOW.length) * 100;
    if (progressFillRef.current) {
      gsap.fromTo(progressFillRef.current,
        { width: "0%" },
        { width: `${targetPct}%`, duration: 1.2, ease: "power2.out", delay: 0.3 }
      );
    }

    activeIconRef.current?.kill();
    const activeIcon = resultRef.current.querySelector("[data-pulse]");
    if (activeIcon) {
      activeIconRef.current = gsap.to(activeIcon, {
        scale: 1.2, yoyo: true, repeat: -1, duration: 0.8, ease: "sine.inOut",
      });
    }
    return () => { activeIconRef.current?.kill(); };
  }, [order, status, stepIndex]);

  useEffect(() => {
    if (initial.trim()) fetchOrder(initial.trim());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const meta = status ? STEP_META[status] : null;
  const estimate = status ? estimateFromStatus(status) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-black text-gray-900">Acompanhar Pedido</h1>
        <p className="text-gray-400 mt-1">Insira o código para ver o estado em tempo real.</p>
      </div>

      {/* Search */}
      <div className="space-y-3">
        <Input
          label="Código do pedido"
          placeholder="Ex.: PDC-123456"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchOrder(code.trim())}
        />
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => fetchOrder(code.trim())}
          disabled={!code.trim() || isLoading}
        >
          {isLoading ? "A verificar…" : "Ver Estado"}
        </Button>
        <Link href="/menu">
          <Button variant="outline" size="lg" className="w-full">Fazer novo pedido</Button>
        </Link>
      </div>

      {/* Pedidos deste dispositivo */}
      {!order && localOrders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Pedidos neste dispositivo
            </p>
            <button
              onClick={clearAllLocalOrders}
              className="text-xs text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors shrink-0"
            >
              Limpar lista
            </button>
          </div>
          <div className="space-y-2">
            {localOrders.map((entry) => (
              <div
                key={entry.trackingCode}
                className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-4 py-3"
              >
                <button
                  onClick={() => selectLocalOrder(entry)}
                  className="text-left flex-1 min-w-0"
                >
                  <p className="font-mono font-bold text-sm text-gray-900">{entry.trackingCode}</p>
                  <p className="text-xs text-gray-400">
                    {entry.customerName} ·{" "}
                    {new Date(entry.createdAt).toLocaleString("pt-AO", {
                      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </button>
                <button
                  onClick={() => removeFromLocalOrders(entry.trackingCode)}
                  aria-label="Remover pedido da lista"
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 rounded-2xl px-5 py-4">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-sm text-red-400 mt-0.5">Verifique o código e tente novamente.</p>
        </div>
      )}

      {/* Result */}
      {order && status && meta && (
        <div ref={resultRef} className="space-y-6" style={{ visibility: "hidden" }}>

          {/* Status banner */}
          <div className={`rounded-2xl px-6 py-5 flex items-start gap-4 ${meta.bg}`}>
            <div className="shrink-0 mt-0.5">
              <meta.icon
                data-pulse={status !== "ENTREGUE" ? "true" : undefined}
                className={`size-8 ${meta.color}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className={`font-display font-black text-lg ${meta.color}`}>
                  {ORDER_STATUS_LABELS[status]}
                </p>
                {estimate && (
                  <span className="text-sm font-semibold text-gray-500 bg-white/70 rounded-full px-3 py-0.5">
                    ⏱ {estimate}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{meta.desc}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-3">
            <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                ref={progressFillRef}
                className="absolute left-0 top-0 h-full bg-primary rounded-full"
                style={{ width: "0%" }}
              />
            </div>

            {/* Steps */}
            <div className="flex justify-between">
              {ORDER_FLOW.map((s, idx) => {
                const done = idx <= stepIndex;
                const Icon = STEP_META[s].icon;
                return (
                  <div key={s} className="flex flex-col items-center gap-1 flex-1">
                    <div className={[
                      "size-8 rounded-full flex items-center justify-center transition-colors",
                      done ? `${STEP_META[s].bg}` : "bg-gray-100",
                    ].join(" ")}>
                      <Icon className={`size-4 ${done ? STEP_META[s].color : "text-gray-300"}`} />
                    </div>
                    <p className={`text-[10px] text-center leading-tight font-semibold ${done ? "text-gray-700" : "text-gray-300"}`}>
                      {ORDER_STATUS_LABELS[s]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order info */}
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Pedido</p>
              <p className="font-mono font-bold text-gray-900">{order.trackingCode}</p>
            </div>
            {order.address && order.address !== "RETIRADA" && (
              <div className="flex items-start gap-2 text-sm text-gray-500">
                <MapPin className="size-4 shrink-0 mt-0.5 text-gray-400" />
                <span>{order.address}</span>
              </div>
            )}
            {order.address === "RETIRADA" && (
              <p className="text-sm text-gray-500">Retirada no local</p>
            )}
          </div>

          {/* Payment instructions */}
          <div className="space-y-3">
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => setShowPayment((v) => !v)}
            >
              {showPayment ? "Ocultar dados de pagamento" : "Ver dados de pagamento"}
            </Button>
            {showPayment && (
              <PaymentInstructions
                trackingCode={order.trackingCode}
                customerName={order.customerName}
                total={order.total}
                deliveryLabel={order.address === "RETIRADA" ? "Retirada no local" : order.address}
                createdAt={new Date(order.createdAt)}
                whatsappNumber={whatsappNumber}
              />
            )}
          </div>

          {/* Items */}
          {order.items?.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Itens do pedido</p>
              <div className="space-y-3">
                {order.items.map((item) => {
                  const img = getProductImage(item);
                  const name = item.product?.name ?? `Produto #${item.productId}`;
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <ImageWithFallback
                        src={img}
                        alt={name}
                        containerClassName="relative size-14 shrink-0 rounded-xl"
                        className="object-cover"
                        showLabel={false}
                        iconClassName="size-4"
                        sizes="56px"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-black text-gray-900 text-sm">
                          {item.quantity}× {name}
                        </p>
                        {item.note && (
                          <p className="text-xs text-gray-400 mt-0.5">Obs: {item.note}</p>
                        )}
                      </div>
                      <p className="font-display font-black text-gray-900 text-sm shrink-0">
                        {fmt(item.price * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <span className="text-gray-500 text-sm">Total</span>
                <span className="font-display font-black text-primary">{fmt(order.total)}</span>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
