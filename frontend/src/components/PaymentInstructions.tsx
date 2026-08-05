"use client";

import { toast } from "sonner";
import { Copy, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { formatCurrency } from "@/lib/mock/helpers";

const IBAN_DISPLAY = "AO06 0006 0000 3361 4373 3018 2";
const IBAN_COPY = "0006 0000 3361 4373 3018 2";
const IBAN_HOLDER = "BONET- COMÉRCIO E SERVIÇOS SU, LDA";

export interface PaymentInstructionsProps {
  trackingCode: string;
  customerName: string;
  total: number;
  deliveryLabel: string;
  createdAt: Date;
  whatsappNumber: string;
}

export function PaymentInstructions({
  trackingCode,
  customerName,
  total,
  deliveryLabel,
  createdAt,
  whatsappNumber,
}: PaymentInstructionsProps) {
  function copyIban() {
    navigator.clipboard.writeText(IBAN_COPY)
      .then(() => toast.success("IBAN copiado!"))
      .catch(() => toast.error("Não foi possível copiar. Copie manualmente."));
  }

  function openWhatsapp() {
    const lines = [
      `Novo comprovativo — Pedido ${trackingCode}`,
      `Nome: ${customerName}`,
      `Total: ${formatCurrency(total)}`,
      `Hora do pedido: ${createdAt.toLocaleString("pt-AO", { dateStyle: "short", timeStyle: "short" })}`,
      deliveryLabel,
      "",
      "Segue em anexo o comprovativo da transferência.",
    ];
    const text = encodeURIComponent(lines.join("\n"));
    const number = whatsappNumber || "244900000000";
    window.open(`https://wa.me/${number}?text=${text}`, "_blank");
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display font-black text-foreground">Como pagar</h3>
        <div className="text-right shrink-0">
          <p className="text-[11px] text-muted-foreground leading-none">Total a pagar</p>
          <p className="font-display font-black text-primary text-lg leading-tight">
            {formatCurrency(total)}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Transfira o valor acima para o IBAN abaixo. Depois, anexe o comprovativo da transferência no WhatsApp.
      </p>

      <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="font-mono text-xs sm:text-sm text-foreground break-all">{IBAN_DISPLAY}</span>
          <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0" onClick={copyIban}>
            <Copy className="size-3.5 mr-1.5" />
            Copiar
          </Button>
        </div>
        <p className="text-xs text-muted-foreground border-t border-gray-100 pt-2">{IBAN_HOLDER}</p>
      </div>

      <div className="space-y-1.5">
        <Button
          size="lg"
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white"
          onClick={openWhatsapp}
        >
          <MessageCircle className="size-4 mr-2" />
          Continuar no WhatsApp
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Vamos abrir o WhatsApp com os detalhes do pedido preenchidos — anexe lá o comprovativo e envie.
        </p>
      </div>
    </div>
  );
}
