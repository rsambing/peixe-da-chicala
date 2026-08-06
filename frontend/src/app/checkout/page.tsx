"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Button, Input, Textarea, Combobox,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui";
import { PaymentInstructions } from "@/components/PaymentInstructions";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/mock/helpers";
import { api } from "@/lib/api";
import { isValidAngolanPhone } from "@/lib/utils";
import type { ApiDeliveryZone } from "@/lib/api-types";
import { addLocalOrder } from "@/lib/order-history";

const PARTICLE_COLORS = ["#ff4400", "#ffaa00", "#ff6600", "#ffcc00", "#ff8800", "#ffdd00"];
const PROFILE_KEY = "peixe-da-chicala.profile.v1";

function formatFeeHint(feeKz: number) {
  return `${feeKz.toLocaleString("pt-AO")} Kz`;
}

type Profile = { name: string; phone: string; address: string; reference: string; region: string; deliveryMethod: "ENTREGA" | "RETIRADA" };

function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Profile;
  } catch { return null; }
}

function saveProfile(p: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

function clearProfile() {
  localStorage.removeItem(PROFILE_KEY);
}

function generateOrderCode() {
  return `PDC-${Math.floor(100000 + Math.random() * 900000)}`;
}


export default function CheckoutPage() {
  const { detailedLines, subtotalKz, clear } = useCart();
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    trackingCode: string;
    customerName: string;
    total: number;
    deliveryLabel: string;
    createdAt: Date;
  } | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    reference: "",
    region: "",
    note: "",
    deliveryMethod: "ENTREGA" as "ENTREGA" | "RETIRADA",
  });
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [zones, setZones] = useState<ApiDeliveryZone[]>([]);
  const [zonesLoading, setZonesLoading] = useState(true);

  // Pre-fill from saved profile on mount
  useEffect(() => {
    const saved = loadProfile();
    if (saved) {
      setForm((prev) => ({ ...prev, ...saved, note: "" }));
      setHasProfile(true);
    }
  }, []);

  useEffect(() => {
    api.getSettings().then((s) => setWhatsappNumber(s.contactWhatsapp)).catch(() => {});
  }, []);

  useEffect(() => {
    api.getDeliveryZones()
      .then(setZones)
      .catch(() => {})
      .finally(() => setZonesLoading(false));
  }, []);

  const deliveryZoneOptions = useMemo(
    () => zones.map((z) => ({ value: z.name, label: z.name, hint: formatFeeHint(z.feeKz) })),
    [zones]
  );

  const isAddressless = form.deliveryMethod === "RETIRADA";
  const selectedZone = zones.find((z) => z.name === form.region);
  const deliveryFeeKz = isAddressless ? 0 : selectedZone?.feeKz ?? 0;

  const totalKz = useMemo(
    () => subtotalKz + (detailedLines.length ? deliveryFeeKz : 0),
    [subtotalKz, detailedLines.length, deliveryFeeKz]
  );

  const phoneError =
    (phoneTouched || form.phone.length > 0) && form.phone.trim().length > 0 && !isValidAngolanPhone(form.phone)
      ? "Número inválido. Use o formato 9XX XXX XXX."
      : null;

  const confirmCardRef = useRef<HTMLDivElement>(null);
  const codeBadgeRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!submittedCode) return;
    const card = confirmCardRef.current;
    const badge = codeBadgeRef.current;
    const container = particlesRef.current;
    if (!card || !badge || !container) return;

    gsap.fromTo(card,
      { autoAlpha: 0, scale: 0.85, y: 20 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" }
    );

    gsap.fromTo(badge,
      { scale: 0, rotation: -8 },
      { scale: 1, rotation: 0, duration: 0.85, ease: "elastic.out(1, 0.45)", delay: 0.35 }
    );

    const count = 24;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      const size = 5 + Math.random() * 7;
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      const angle = (i / count) * Math.PI * 2;
      const distance = 70 + Math.random() * 110;
      const isSquare = Math.random() > 0.5;

      Object.assign(el.style, {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: isSquare ? "3px" : "50%",
        background: color,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      });
      container.appendChild(el);

      gsap.fromTo(el,
        { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0 },
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 0.2,
          rotation: (Math.random() - 0.5) * 360,
          duration: 0.9 + Math.random() * 0.5,
          ease: "power2.out",
          delay: 0.3 + Math.random() * 0.1,
          onComplete: () => el.remove(),
        }
      );
    }
  }, [submittedCode]);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit() {
    if (!detailedLines.length) return;
    if (!form.name.trim() || !isValidAngolanPhone(form.phone)) return;
    if (form.deliveryMethod === "ENTREGA" && (!form.region || !form.address.trim())) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const trackingCode = generateOrderCode();
    const addressValue = form.deliveryMethod === "RETIRADA"
      ? "RETIRADA"
      : [form.region, form.address.trim(), form.reference.trim()].filter(Boolean).join(" - ");

    try {
      const order = await api.createOrder({
        trackingCode,
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        address: addressValue,
        region: isAddressless ? undefined : form.region,
        status: "RECEBIDO",
        total: totalKz,
        items: detailedLines.map((line) => ({
          productId: Number(line.itemId),
          quantity: line.quantity,
          price: line.item.priceKz,
          note: line.note || undefined,
        })),
      });

      setConfirmedOrder({
        trackingCode: order.trackingCode,
        customerName: form.name.trim(),
        total: totalKz,
        deliveryLabel: isAddressless
          ? "Retirada no local"
          : `Entrega em ${form.region} — ${form.address.trim()}`,
        createdAt: new Date(),
      });

      saveProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: isAddressless ? "" : form.address.trim(),
        reference: isAddressless ? "" : form.reference.trim(),
        region: isAddressless ? "" : form.region,
        deliveryMethod: form.deliveryMethod,
      });
      addLocalOrder({
        trackingCode: order.trackingCode,
        customerName: form.name.trim(),
        createdAt: new Date().toISOString(),
      });
      setHasProfile(true);
      setSubmittedCode(order.trackingCode);
      clear();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Erro ao criar pedido. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit =
    !isSubmitting &&
    detailedLines.length > 0 &&
    form.name.trim().length > 0 &&
    isValidAngolanPhone(form.phone) &&
    (isAddressless || (form.address.trim().length > 0 && !!form.region));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-24 pb-16 px-4 md:px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-display font-black text-foreground mb-2">
              Finalizar Pedido
            </h1>
            <p className="text-muted-foreground mb-6">
              Preencha os dados básicos para confirmarmos a entrega.
            </p>

            {submittedCode ? (
              <div ref={confirmCardRef} className="space-y-5" style={{ visibility: "hidden" }}>
                <h2 className="text-2xl font-display font-black text-foreground">
                  Pedido confirmado! 🔥
                </h2>
                <p className="text-muted-foreground">
                  Guarde o seu código para acompanhar o estado em tempo real.
                </p>

                <div className="relative inline-block">
                  <div
                    ref={particlesRef}
                    className="absolute inset-0 pointer-events-none overflow-visible"
                    aria-hidden="true"
                  />
                  <div
                    ref={codeBadgeRef}
                    className="inline-flex items-center gap-3 rounded-2xl bg-primary/10 border border-primary/20 px-5 py-3"
                  >
                    <span className="text-sm text-muted-foreground">Código</span>
                    <span className="font-display font-black text-primary text-2xl tracking-widest">
                      {submittedCode}
                    </span>
                  </div>
                </div>

                {confirmedOrder && (
                  <PaymentInstructions
                    trackingCode={confirmedOrder.trackingCode}
                    customerName={confirmedOrder.customerName}
                    total={confirmedOrder.total}
                    deliveryLabel={confirmedOrder.deliveryLabel}
                    createdAt={confirmedOrder.createdAt}
                    whatsappNumber={whatsappNumber}
                  />
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/acompanhar?codigo=${encodeURIComponent(submittedCode)}`}
                    className="flex-1"
                  >
                    <Button variant="accent" size="lg" className="w-full">
                      Acompanhar Pedido
                    </Button>
                  </Link>
                  <Link href="/menu" className="flex-1">
                    <Button variant="outline" size="lg" className="w-full">
                      Voltar ao Cardápio
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {hasProfile && (
                  <div className="flex items-center justify-between gap-3 bg-green-50 rounded-xl px-4 py-2.5">
                    <p className="text-sm text-green-700 font-medium">✓ Dados preenchidos automaticamente</p>
                    <button
                      onClick={() => {
                        clearProfile();
                        setHasProfile(false);
                        setForm({ name: "", phone: "", address: "", reference: "", region: "", note: "", deliveryMethod: "ENTREGA" });
                      }}
                      className="text-xs text-green-600 hover:text-green-800 underline underline-offset-2 transition-colors shrink-0"
                    >
                      Limpar
                    </button>
                  </div>
                )}

                <Input
                  label="Nome"
                  placeholder="O seu nome"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
                <Input
                  label="Telefone"
                  placeholder="9XX XXX XXX"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  onBlur={() => setPhoneTouched(true)}
                  error={phoneError ?? undefined}
                  inputMode="tel"
                />
                <p className="-mt-2.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  ⚠️ Confirme bem o número. Depois de o pedido ser feito não é possível alterá-lo.
                </p>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Método de entrega
                  </label>
                  <Select
                    value={form.deliveryMethod}
                    onValueChange={(v) => update("deliveryMethod", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENTREGA">Entrega</SelectItem>
                      <SelectItem value="RETIRADA">Retirada</SelectItem>
                      {/* <SelectItem value="RESERVA">Reserva</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>

                {!isAddressless && (
                  <div className="space-y-1.5">
                    <Combobox
                      label="Bairro / Região"
                      placeholder={zonesLoading ? "A carregar bairros…" : "Pesquise o seu bairro…"}
                      searchPlaceholder="Ex.: Kilamba, Talatona…"
                      emptyText="Bairro não encontrado."
                      options={deliveryZoneOptions}
                      value={form.region}
                      onChange={(v) => update("region", v)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Não encontra o seu bairro na lista? Escolha o mais próximo da sua localização.
                    </p>
                  </div>
                )}

                <Input
                  label="Endereço"
                  placeholder="Rua, bairro, número..."
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  disabled={isAddressless}
                />
                <Input
                  label="Referência (opcional)"
                  placeholder="Perto do..."
                  value={form.reference}
                  onChange={(e) => update("reference", e.target.value)}
                  disabled={isAddressless}
                />
                <Textarea
                  label="Observações (opcional)"
                  placeholder="Ex.: sem picante, com mais limão..."
                  value={form.note}
                  onChange={(e) => update("note", e.target.value)}
                />

                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-800">
                  💳 Pagamento por transferência bancária. Os dados do IBAN aparecem depois de confirmar o pedido.
                </div>

                {submitError && (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                    {submitError}
                  </p>
                )}

                <div className="pt-2">
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={!canSubmit}
                    onClick={submit}
                  >
                    {isSubmitting ? "A enviar pedido…" : "Confirmar Pedido"}
                  </Button>
                </div>

                <div className="pt-2">
                  <Link href="/carrinho">
                    <Button variant="outline" size="lg" className="w-full">
                      Voltar ao Carrinho
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <aside>
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-display font-black text-foreground">Resumo</h2>

              {detailedLines.length === 0 ? (
                <p className="text-muted-foreground">O carrinho está vazio.</p>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2 text-sm">
                    {detailedLines.map((line) => (
                      <div key={line.itemId} className="flex items-start justify-between gap-3">
                        <p className="text-foreground font-medium truncate">
                          {line.quantity}× {line.item.name}
                        </p>
                        <p className="font-display font-black shrink-0">
                          {formatCurrency(line.lineTotalKz)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-gray-200" />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-display font-black">{formatCurrency(subtotalKz)}</span>
                    </div>
                    {form.deliveryMethod === "ENTREGA" && detailedLines.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Entrega{selectedZone ? ` (${selectedZone.name})` : ""}</span>
                        <span className="font-display font-black">
                          {selectedZone ? formatCurrency(deliveryFeeKz) : "Selecione o bairro"}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span className="text-primary font-display font-black text-lg">
                        {formatCurrency(totalKz)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
