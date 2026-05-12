"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Badge,
} from "@/components/ui";
import {
  type Campaign,
  PaymentProvider,
  PAYMENT_LABELS,
} from "@/lib/types";
import { formatCurrency } from "@/lib/mock/helpers";
import { FiCheck, FiArrowLeft, FiSmartphone, FiHome, FiPhone, FiLock } from "react-icons/fi";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

const PRESET_AMOUNTS = [5_000, 10_000, 25_000, 50_000, 100_000, 250_000];

const PAYMENT_METHODS: { provider: PaymentProvider; icon: React.ReactNode }[] = [
  { provider: PaymentProvider.MULTICAIXA_EXPRESS, icon: <FiSmartphone className="size-6" /> },
  { provider: PaymentProvider.BANK_TRANSFER, icon: <FiHome className="size-6" /> },
  { provider: PaymentProvider.UNITEL_MONEY, icon: <FiPhone className="size-6" /> },
];

type Step = "amount" | "payment" | "confirm" | "success";

interface DonateModalProps {
  campaign: Campaign;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DonateModal({ campaign, open, onOpenChange }: DonateModalProps) {
  const { isLoggedIn } = useAuth();
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentProvider | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  const finalAmount = amount ?? (parseInt(customAmount) || 0);
  const isValidAmount = finalAmount >= 1_000;

  function reset() {
    setStep("amount");
    setAmount(null);
    setCustomAmount("");
    setPaymentMethod(null);
    setIsAnonymous(false);
    setMessage("");
    setProcessing(false);
  }

  function handleClose(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  function goToPayment() {
    if (isValidAmount) setStep("payment");
  }

  function goToConfirm() {
    if (paymentMethod) setStep("confirm");
  }

  function handleConfirm() {
    setProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setProcessing(false);
      setStep("success");
    }, 2000);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent size="md">
        {!isLoggedIn ? (
          <div className="text-center py-8 space-y-6">
            <DialogHeader className="opacity-0 absolute h-0 w-0 pointer-events-none">
              <DialogTitle>Mural de Autenticação</DialogTitle>
              <DialogDescription>É necessário iniciar sessão</DialogDescription>
            </DialogHeader>

            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
              <FiLock className="size-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Inicie sessão para apoiar</h2>
              <p className="text-muted-foreground">
                Para garantir a segurança e transparência, todos os doadores devem ter uma conta verificada.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/entrar" className="w-full">
                <Button variant="primary" size="lg" className="w-full">
                  Entrar na minha conta
                </Button>
              </Link>
              <Link href="/registar" className="w-full">
                <Button variant="ghost" size="lg" className="w-full">
                  Criar uma nova conta
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              A sua identidade será confirmada mas poderá escolher doar anonimamente no passo seguinte.
            </p>
          </div>
        ) : (
          <>
            {/* ── Step 1: Amount ── */}
            {step === "amount" && (
              <>
                <DialogHeader>
                  <DialogTitle>Apoiar Campanha</DialogTitle>
                  <DialogDescription className="line-clamp-1">
                    {campaign.title}
                  </DialogDescription>
                </DialogHeader>

            <div className="space-y-5 mt-2">
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Seleccione o valor (Kz)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setAmount(preset);
                        setCustomAmount("");
                      }}
                      className={`py-3 rounded-lg border text-sm font-medium transition-all ${
                        amount === preset
                          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-primary/40 text-foreground"
                      }`}
                    >
                      {formatCurrency(preset)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    Kz
                  </span>
                  <input
                    type="text"
                    placeholder="Outro valor..."
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value.replace(/\D/g, ""));
                      setAmount(0);
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-card text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* Message (optional) */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Mensagem (opcional)
                </label>
                <textarea
                  placeholder="Deixe uma mensagem de apoio..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Anonymous toggle */}
              <div className="p-3 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 bg-muted/30">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Doar anonimamente</p>
                    <p className="text-xs text-muted-foreground leading-tight">
                      O seu nome não será visível publicamente na lista de doadores.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => handleClose(false)}>
                Cancelar
              </Button>
              <Button
                variant="accent"
                disabled={!isValidAmount}
                onClick={goToPayment}
              >
                Continuar — {isValidAmount ? formatCurrency(finalAmount) : "Kz 0"}
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ── Step 2: Payment method ── */}
        {step === "payment" && (
          <>
            <DialogHeader>
              <DialogTitle>Método de Pagamento</DialogTitle>
              <DialogDescription>
                Escolha como deseja efectuar o pagamento de{" "}
                <strong>{formatCurrency(finalAmount)}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mt-2">
              {PAYMENT_METHODS.map(({ provider, icon }) => (
                <button
                  key={provider}
                  onClick={() => setPaymentMethod(provider)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    paymentMethod === provider
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary/40"
                  }`}
                >
                  <span className="text-2xl">{icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">
                      {PAYMENT_LABELS[provider]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {provider === PaymentProvider.MULTICAIXA_EXPRESS &&
                        "Pagamento instantâneo via app"}
                      {provider === PaymentProvider.BANK_TRANSFER &&
                        "Transferência bancária com comprovativo"}
                      {provider === PaymentProvider.UNITEL_MONEY &&
                        "Pagamento via Unitel Money"}
                    </p>
                  </div>
                  {paymentMethod === provider && (
                    <FiCheck className="size-5 text-primary" />
                  )}
                </button>
              ))}
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setStep("amount")}>
                <FiArrowLeft className="size-4 mr-1" />
                Voltar
              </Button>
              <Button
                variant="accent"
                disabled={!paymentMethod}
                onClick={goToConfirm}
              >
                Confirmar Pagamento
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ── Step 3: Confirm ── */}
        {step === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirmar Doação</DialogTitle>
              <DialogDescription>
                Reveja os detalhes antes de confirmar
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-5 space-y-3 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Campanha</span>
                <span className="font-medium text-foreground truncate ml-4 max-w-50">
                  {campaign.title}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor</span>
                <span className="font-bold text-foreground">
                  {formatCurrency(finalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pagamento</span>
                <span className="text-foreground">
                  {paymentMethod && PAYMENT_LABELS[paymentMethod]}
                </span>
              </div>
              {isAnonymous && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Visibilidade</span>
                  <Badge variant="default">Anónimo</Badge>
                </div>
              )}
              {message && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-muted-foreground mb-1">Mensagem</p>
                  <p className="text-sm text-foreground italic">&ldquo;{message}&rdquo;</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setStep("payment")}>
                <FiArrowLeft className="size-4 mr-1" />
                Voltar
              </Button>
              <Button
                variant="accent"
                loading={processing}
                onClick={handleConfirm}
              >
                {processing ? "A processar..." : "Confirmar Doação"}
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ── Step 4: Success ── */}
        {step === "success" && (
          <div className="text-center py-6">
            <div className="size-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <FiCheck className="size-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Obrigado!
            </h2>
            <p className="text-muted-foreground mb-1">
              A sua doação de{" "}
              <strong className="text-foreground">
                {formatCurrency(finalAmount)}
              </strong>{" "}
              foi registada com sucesso.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Receberá um email de confirmação em breve.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleClose(false)}
            >
              Voltar à Campanha
            </Button>
          </div>
        )}
      </>
    )}
  </DialogContent>
    </Dialog>
  );
}
