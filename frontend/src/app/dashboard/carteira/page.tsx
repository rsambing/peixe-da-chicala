"use client";

import { useState } from "react";
import { Button, Card, CardContent, Badge, Input } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui";
import { mockWallet, mockTransactions } from "@/lib/mock";
import { formatCurrency, timeAgo } from "@/lib/mock/helpers";
import { TransactionType, PaymentProvider, PAYMENT_LABELS } from "@/lib/types";
import {
  FiArrowUpRight,
  FiArrowDownLeft,
  FiCreditCard,
  FiPlus,
  FiArrowDown,
  FiDollarSign,
} from "react-icons/fi";
import { toast } from "sonner";

const TRANSACTION_ICON: Record<TransactionType, { icon: typeof FiArrowUpRight; color: string }> = {
  [TransactionType.DEPOSIT]: { icon: FiArrowDownLeft, color: "text-emerald-500" },
  [TransactionType.DONATION]: { icon: FiArrowUpRight, color: "text-red-500" },
  [TransactionType.WITHDRAWAL]: { icon: FiArrowUpRight, color: "text-amber-500" },
  [TransactionType.PLATFORM_FEE]: { icon: FiDollarSign, color: "text-gray-500" },
  [TransactionType.REFUND]: { icon: FiArrowDownLeft, color: "text-blue-500" },
};

const TRANSACTION_LABELS: Record<TransactionType, string> = {
  [TransactionType.DEPOSIT]: "Depósito",
  [TransactionType.DONATION]: "Doação",
  [TransactionType.WITHDRAWAL]: "Levantamento",
  [TransactionType.PLATFORM_FEE]: "Taxa",
  [TransactionType.REFUND]: "Reembolso",
};

export default function WalletPage() {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentProvider>(
    PaymentProvider.MULTICAIXA_EXPRESS
  );
  const [processing, setProcessing] = useState(false);

  const deposits = mockTransactions.filter((t) => t.amount > 0);
  const outflows = mockTransactions.filter((t) => t.amount < 0);
  const totalIn = deposits.reduce((s, t) => s + t.amount, 0);
  const totalOut = Math.abs(outflows.reduce((s, t) => s + t.amount, 0));

  function handleDeposit() {
    const num = parseInt(amount);
    if (!num || num < 1_000) {
      toast.error("Valor mínimo: 1.000 Kz");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowDeposit(false);
      setAmount("");
      toast.success(`Depósito de ${formatCurrency(num)} processado!`);
    }, 1500);
  }

  function handleWithdraw() {
    const num = parseInt(amount);
    if (!num || num < 5_000) {
      toast.error("Valor mínimo de levantamento: 5.000 Kz");
      return;
    }
    if (num > mockWallet.balance) {
      toast.error("Saldo insuficiente.");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowWithdraw(false);
      setAmount("");
      toast.success(`Levantamento de ${formatCurrency(num)} solicitado!`);
    }, 1500);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Carteira</h1>
        <p className="text-muted-foreground mt-1">
          Gerir o seu saldo, depósitos e levantamentos.
        </p>
      </div>

      {/* Balance card */}
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 size-40 rounded-full bg-white/5 blur-2xl -translate-y-10 translate-x-10" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
            <FiCreditCard className="size-4" />
            Saldo Disponível
          </div>
          <p className="text-4xl sm:text-5xl font-bold mb-6">
            {formatCurrency(mockWallet.balance)}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="accent"
              size="md"
              onClick={() => setShowDeposit(true)}
            >
              <FiPlus className="size-4 mr-2" />
              Depositar
            </Button>
            <Button
              variant="outline"
              size="md"
              className="border-white/30 text-white hover:bg-white hover:text-primary"
              onClick={() => setShowWithdraw(true)}
            >
              <FiArrowDown className="size-4 mr-2" />
              Levantar
            </Button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="size-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
              <FiArrowDownLeft className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Depósitos</p>
              <p className="text-lg font-bold text-foreground">{formatCurrency(totalIn)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="size-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <FiArrowUpRight className="size-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Saídas</p>
              <p className="text-lg font-bold text-foreground">{formatCurrency(totalOut)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <FiDollarSign className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Transacções</p>
              <p className="text-lg font-bold text-foreground">{mockTransactions.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions list */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Histórico de Transacções
        </h2>
        <Card>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {mockTransactions.map((txn) => {
              const txnInfo = TRANSACTION_ICON[txn.type];
              const Icon = txnInfo.icon;
              const isPositive = txn.amount > 0;

              return (
                <div
                  key={txn.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div
                    className={`size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${txnInfo.color}`}
                  >
                    <Icon className="size-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {txn.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(txn.createdAt)}
                      </span>
                      {txn.reference && (
                        <>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {txn.reference}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        isPositive ? "text-emerald-600" : "text-foreground"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {formatCurrency(Math.abs(txn.amount))}
                    </p>
                    <Badge variant="default" className="text-[10px]">
                      {TRANSACTION_LABELS[txn.type]}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Deposit dialog */}
      <Dialog open={showDeposit} onOpenChange={setShowDeposit}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Depositar Fundos</DialogTitle>
            <DialogDescription>
              Adicione fundos à sua carteira Levanta Angola.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <Input
              label="Valor (Kz)"
              type="number"
              placeholder="Mínimo 1.000 Kz"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Método de Pagamento
              </label>
              <div className="space-y-2">
                {[
                  PaymentProvider.MULTICAIXA_EXPRESS,
                  PaymentProvider.BANK_TRANSFER,
                  PaymentProvider.UNITEL_MONEY,
                ].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left text-sm transition-all ${
                      paymentMethod === method
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/40"
                    }`}
                  >
                    <span className="font-medium text-foreground">
                      {PAYMENT_LABELS[method]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDeposit(false)}>
              Cancelar
            </Button>
            <Button variant="accent" onClick={handleDeposit} loading={processing}>
              Depositar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw dialog */}
      <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Levantar Fundos</DialogTitle>
            <DialogDescription>
              Saldo disponível: {formatCurrency(mockWallet.balance)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <Input
              label="Valor (Kz)"
              type="number"
              placeholder="Mínimo 5.000 Kz"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Input
              label="IBAN / Número da conta"
              placeholder="AO06..."
            />
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowWithdraw(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleWithdraw} loading={processing}>
              Solicitar Levantamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
