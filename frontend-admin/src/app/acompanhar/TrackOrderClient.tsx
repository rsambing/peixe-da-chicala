"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { Clock, Flame, Truck, CheckCircle2 } from "lucide-react";
import { Button, Card, CardContent, Input, Badge } from "@/components/ui";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/menu";

const ORDER_FLOW: OrderStatus[] = [
  "RECEBIDO",
  "EM_PREPARACAO",
  "SAIU_PARA_ENTREGA",
  "ENTREGUE",
];

const STEP_ICONS: Record<OrderStatus, React.ElementType> = {
  RECEBIDO: Clock,
  EM_PREPARACAO: Flame,
  SAIU_PARA_ENTREGA: Truck,
  ENTREGUE: CheckCircle2,
};

const STEP_COLORS: Record<OrderStatus, string> = {
  RECEBIDO: "text-muted-foreground",
  EM_PREPARACAO: "text-accent",
  SAIU_PARA_ENTREGA: "text-primary",
  ENTREGUE: "text-success",
};

function statusFromCode(code: string): OrderStatus {
  const cleaned = code.trim();
  if (!cleaned) return "RECEBIDO";
  let sum = 0;
  for (const ch of cleaned) sum += ch.charCodeAt(0);
  return ORDER_FLOW[sum % ORDER_FLOW.length];
}

function estimateFromStatus(status: OrderStatus) {
  switch (status) {
    case "RECEBIDO": return "45–60 min";
    case "EM_PREPARACAO": return "30–45 min";
    case "SAIU_PARA_ENTREGA": return "10–20 min";
    case "ENTREGUE": return "Concluído";
  }
}

export function TrackOrderClient() {
  const params = useSearchParams();
  const initial = params.get("codigo") ?? "";

  const [code, setCode] = useState(initial);
  const [submitted, setSubmitted] = useState(initial);

  const status = useMemo(() => statusFromCode(submitted), [submitted]);
  const stepIndex = ORDER_FLOW.indexOf(status);
  const estimate = estimateFromStatus(status);

  const resultRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const activeIconRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!submitted.trim()) return;
    const result = resultRef.current;
    const stepsEl = stepsRef.current;
    const fill = progressFillRef.current;
    if (!result || !stepsEl || !fill) return;

    // Card entrance
    gsap.fromTo(result,
      { autoAlpha: 0, y: 24, scale: 0.97 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
    );

    // Progress bar animate from 0
    const targetPct = ((stepIndex + 1) / ORDER_FLOW.length) * 100;
    gsap.fromTo(fill,
      { width: "0%" },
      { width: `${targetPct}%`, duration: 1.1, ease: "power2.out", delay: 0.35 }
    );

    // Steps stagger entrance
    const steps = Array.from(stepsEl.children);
    gsap.fromTo(steps,
      { autoAlpha: 0, x: -20 },
      { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.1, ease: "power2.out", delay: 0.3 }
    );

    // Pulse on the active step icon
    activeIconRef.current?.kill();
    const activeIcon = stepsEl.children[stepIndex]?.querySelector("[data-active-icon]");
    if (activeIcon) {
      activeIconRef.current = gsap.to(activeIcon, {
        scale: 1.25,
        yoyo: true,
        repeat: -1,
        duration: 0.75,
        ease: "sine.inOut",
      });
    }

    return () => {
      activeIconRef.current?.kill();
    };
  }, [submitted, stepIndex]);

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
        <div ref={resultRef} style={{ visibility: "hidden" }}>
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Código</p>
                  <p className="font-display font-black text-foreground text-xl tracking-wide">
                    {submitted}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tempo estimado:{" "}
                    <span className="text-foreground font-medium">{estimate}</span>
                  </p>
                </div>
                <Badge variant="primary">{ORDER_STATUS_LABELS[status]}</Badge>
              </div>

              {/* Custom animated progress bar */}
              <div className="relative h-2.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  ref={progressFillRef}
                  className="absolute left-0 top-0 h-full bg-primary rounded-full"
                  style={{ width: "0%" }}
                />
              </div>

              {/* Steps with icons */}
              <div ref={stepsRef} className="space-y-3">
                {ORDER_FLOW.map((s, idx) => {
                  const done = idx <= stepIndex;
                  const isActive = idx === stepIndex;
                  const Icon = STEP_ICONS[s];

                  return (
                    <div key={s} className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex items-center justify-center size-9 rounded-full transition-colors",
                          done ? "bg-primary/15" : "bg-muted"
                        )}
                      >
                        <Icon
                          data-active-icon={isActive ? "true" : undefined}
                          className={cn(
                            "size-4 transition-colors",
                            done ? STEP_COLORS[s] : "text-muted-foreground/40"
                          )}
                        />
                      </div>
                      <p className={cn(
                        "font-display font-semibold transition-colors",
                        done ? "text-foreground" : "text-muted-foreground/50"
                      )}>
                        {ORDER_STATUS_LABELS[s]}
                      </p>
                      {isActive && (
                        <span className="ml-auto text-xs text-muted-foreground animate-pulse">
                          agora
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground">
                Versão inicial — estado simulado sem backend.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
