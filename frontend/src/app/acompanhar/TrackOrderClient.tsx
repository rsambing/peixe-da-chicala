"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, Card, CardContent, Input, Badge, ProgressBar } from "@/components/ui";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/menu";

const ORDER_FLOW: OrderStatus[] = [
  "RECEBIDO",
  "EM_PREPARACAO",
  "SAIU_PARA_ENTREGA",
  "ENTREGUE",
];

function statusFromCode(code: string): OrderStatus {
  const cleaned = code.trim();
  if (!cleaned) return "RECEBIDO";
  let sum = 0;
  for (const ch of cleaned) sum += ch.charCodeAt(0);
  const idx = sum % ORDER_FLOW.length;
  return ORDER_FLOW[idx];
}

function estimateFromStatus(status: OrderStatus) {
  switch (status) {
    case "RECEBIDO":
      return "45–60 min";
    case "EM_PREPARACAO":
      return "30–45 min";
    case "SAIU_PARA_ENTREGA":
      return "10–20 min";
    case "ENTREGUE":
      return "Concluído";
  }
}

export function TrackOrderClient() {
  const params = useSearchParams();
  const initial = params.get("codigo") ?? "";

  const [code, setCode] = useState(initial);
  const [submitted, setSubmitted] = useState(initial);

  const status = useMemo(() => statusFromCode(submitted), [submitted]);
  const stepIndex = ORDER_FLOW.indexOf(status);
  const progress = ((stepIndex + 1) / ORDER_FLOW.length) * 100;
  const estimate = estimateFromStatus(status);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-display font-black text-foreground">
          Acompanhar Pedido
        </h1>
        <p className="text-muted-foreground">
          Insira o código do pedido para ver o estado.
        </p>
      </header>

      <Card>
        <CardContent className="p-6 space-y-4">
          <Input
            label="Código do pedido"
            placeholder="Ex.: PDC-123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            variant="accent"
            size="lg"
            className="w-full"
            onClick={() => setSubmitted(code.trim())}
            disabled={!code.trim()}
          >
            Ver Estado
          </Button>
          <Link href="/menu">
            <Button variant="outline" size="lg" className="w-full">
              Fazer novo pedido
            </Button>
          </Link>
        </CardContent>
      </Card>

      {submitted.trim() && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Código</p>
                <p className="font-display font-black text-foreground text-xl">
                  {submitted}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tempo estimado: <span className="text-foreground">{estimate}</span>
                </p>
              </div>
              <Badge variant="primary">{ORDER_STATUS_LABELS[status]}</Badge>
            </div>

            <ProgressBar value={progress} size="md" showLabel />

            <div className="space-y-2">
              {ORDER_FLOW.map((s, idx) => {
                const done = idx <= stepIndex;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div
                      className={
                        done
                          ? "size-3 rounded-full bg-accent"
                          : "size-3 rounded-full bg-muted"
                      }
                    />
                    <p className={done ? "text-foreground" : "text-muted-foreground"}>
                      {ORDER_STATUS_LABELS[s]}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="text-sm text-muted-foreground">
              Nota: nesta versão inicial, o estado é uma simulação (sem backend).
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
