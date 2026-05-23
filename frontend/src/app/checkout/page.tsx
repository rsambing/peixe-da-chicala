"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Button,
  Card,
  CardContent,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/mock/helpers";

const DELIVERY_FEE_KZ = 1000;

function generateOrderCode() {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `PDC-${digits}`;
}

export default function CheckoutPage() {
  const { detailedLines, subtotalKz, clear } = useCart();
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    reference: "",
    note: "",
    deliveryMethod: "ENTREGA" as "ENTREGA" | "RETIRADA",
  });

  const totalKz = useMemo(
    () => subtotalKz + (detailedLines.length ? DELIVERY_FEE_KZ : 0),
    [subtotalKz, detailedLines.length]
  );

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function submit() {
    if (!detailedLines.length) return;
    if (!form.name.trim() || !form.phone.trim()) return;
    if (form.deliveryMethod === "ENTREGA" && !form.address.trim()) return;

    const code = generateOrderCode();
    setSubmittedCode(code);
    clear();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-display font-black text-foreground mb-2">
              Finalizar Pedido
            </h1>
            <p className="text-muted-foreground mb-6">
              Preencha os dados básicos para confirmarmos a entrega.
            </p>

            {submittedCode ? (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-display font-black text-foreground">
                    Pedido confirmado
                  </h2>
                  <p className="text-muted-foreground">
                    Guarde o seu código para acompanhar o estado em tempo real.
                  </p>
                  <div className="inline-flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
                    <span className="text-sm text-muted-foreground">Código</span>
                    <span className="font-display font-black text-primary text-lg">
                      {submittedCode}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={`/acompanhar?codigo=${encodeURIComponent(submittedCode)}`} className="flex-1">
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
                  />
                  <Textarea
                    label="Observações (opcional)"
                    placeholder="Ex.: sem picante, com mais limão..."
                    value={form.note}
                    onChange={(e) => update("note", e.target.value)}
                  />

                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={
                      !detailedLines.length ||
                      !form.name.trim() ||
                      !form.phone.trim() ||
                      (form.deliveryMethod === "ENTREGA" && !form.address.trim())
                    }
                    onClick={submit}
                  >
                    Confirmar Pedido
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
                          <div className="min-w-0">
                            <p className="text-foreground font-medium truncate">
                              {line.quantity}× {line.item.name}
                            </p>
                          </div>
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
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Entrega</span>
                        <span className="font-display font-black">{formatCurrency(DELIVERY_FEE_KZ)}</span>
                      </div>
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
