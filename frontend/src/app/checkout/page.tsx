"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Button, Card, CardContent, Input, Textarea,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/mock/helpers";
import { api } from "@/lib/api";

const DELIVERY_FEE_KZ = 1000;
const PARTICLE_COLORS = ["#ff4400", "#ffaa00", "#ff6600", "#ffcc00", "#ff8800", "#ffdd00"];

function generateOrderCode() {
  return `PDC-${Math.floor(100000 + Math.random() * 900000)}`;
}

export default function CheckoutPage() {
  const { detailedLines, subtotalKz, clear } = useCart();
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    reference: "",
    note: "",
    deliveryMethod: "ENTREGA" as "ENTREGA" | "RETIRADA",
  });

  const totalKz = useMemo(
    () => subtotalKz + (detailedLines.length && form.deliveryMethod === "ENTREGA" ? DELIVERY_FEE_KZ : 0),
    [subtotalKz, detailedLines.length, form.deliveryMethod]
  );

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
    if (!form.name.trim() || !form.phone.trim()) return;
    if (form.deliveryMethod === "ENTREGA" && !form.address.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const trackingCode = generateOrderCode();
    const addressValue = form.deliveryMethod === "RETIRADA"
      ? "RETIRADA"
      : [form.address.trim(), form.reference.trim()].filter(Boolean).join(" - ");

    try {
      const order = await api.createOrder({
        trackingCode,
        customerName: form.name.trim(),
        phone: form.phone.trim(),
        address: addressValue,
        status: "RECEBIDO",
        total: totalKz,
        items: detailedLines.map((line) => ({
          productId: Number(line.itemId),
          quantity: line.quantity,
          price: line.item.priceKz,
        })),
      });

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
    form.phone.trim().length > 0 &&
    (form.deliveryMethod === "RETIRADA" || form.address.trim().length > 0);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-4 md:px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-display font-black text-foreground mb-2">
              Finalizar Pedido
            </h1>
            <p className="text-muted-foreground mb-6">
              Preencha os dados básicos para confirmarmos a entrega.
            </p>

            {submittedCode ? (
              <div ref={confirmCardRef} style={{ visibility: "hidden" }}>
                <Card>
                  <CardContent className="p-6 space-y-5">
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
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 space-y-4">
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
                  />

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
                      </SelectContent>
                    </Select>
                  </div>

                  <Input
                    label="Endereço"
                    placeholder="Rua, bairro, número..."
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    disabled={form.deliveryMethod === "RETIRADA"}
                  />
                  <Input
                    label="Referência (opcional)"
                    placeholder="Perto do..."
                    value={form.reference}
                    onChange={(e) => update("reference", e.target.value)}
                    disabled={form.deliveryMethod === "RETIRADA"}
                  />
                  <Textarea
                    label="Observações (opcional)"
                    placeholder="Ex.: sem picante, com mais limão..."
                    value={form.note}
                    onChange={(e) => update("note", e.target.value)}
                  />

                  {submitError && (
                    <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                      {submitError}
                    </p>
                  )}

                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={!canSubmit}
                    onClick={submit}
                  >
                    {isSubmitting ? "A enviar pedido…" : "Confirmar Pedido"}
                  </Button>

                  <Link href="/carrinho">
                    <Button variant="outline" size="lg" className="w-full">
                      Voltar ao Carrinho
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="space-y-3">
            <Card>
              <CardContent className="p-6 space-y-4">
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

                    <div className="h-px bg-border" />

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-display font-black">{formatCurrency(subtotalKz)}</span>
                      </div>
                      {form.deliveryMethod === "ENTREGA" && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Entrega</span>
                          <span className="font-display font-black">{formatCurrency(DELIVERY_FEE_KZ)}</span>
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
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
