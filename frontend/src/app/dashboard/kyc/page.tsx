"use client";

import { useState } from "react";
import { Button, Badge } from "@/components/ui";
import { currentUser } from "@/lib/mock";
import { KycStatus } from "@/lib/types";
import {
  FiUpload,
  FiCheck,
  FiClock,
  FiShield,
  FiFileText,
  FiCamera,
  FiUser,
} from "react-icons/fi";
import { toast } from "sonner";

const KYC_STEPS = [
  {
    id: "identity",
    title: "Documento de Identidade",
    description: "BI, Passaporte ou Carta de Condução válidos.",
    icon: FiFileText,
  },
  {
    id: "selfie",
    title: "Selfie de Verificação",
    description: "Foto do rosto a segurar o documento de identidade.",
    icon: FiCamera,
  },
  {
    id: "address",
    title: "Comprovativo de Morada",
    description: "Factura de serviço ou carta bancária dos últimos 3 meses.",
    icon: FiUser,
  },
];

export default function KycPage() {
  const isVerified = currentUser.kycStatus === KycStatus.VERIFIED;
  const isPending =
    currentUser.kycStatus === KycStatus.PENDING ||
    currentUser.kycStatus === KycStatus.UNDER_REVIEW;

  const [uploads, setUploads] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleFileSelect(stepId: string) {
    // Simulate file selection
    setUploads((prev) => ({
      ...prev,
      [stepId]: `documento_${stepId}.pdf`,
    }));
  }

  function handleSubmit() {
    const allUploaded = KYC_STEPS.every((s) => uploads[s.id]);
    if (!allUploaded) {
      toast.error("Carregue todos os documentos antes de submeter.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Documentos submetidos para análise!");
    }, 2000);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Verificação KYC
        </h1>
        <p className="text-muted-foreground mt-1">
          Confirme a sua identidade para desbloquear todas as funcionalidades.
        </p>
      </div>

      {/* Status banner */}
      {isVerified && (
        <div className="flex items-center gap-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-5">
          <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
            <FiCheck className="size-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">
              Identidade Verificada
            </h3>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              A sua conta está totalmente verificada. Tem acesso a todas as
              funcionalidades da plataforma.
            </p>
          </div>
          <Badge variant="active" className="ml-auto shrink-0">
            Verificado
          </Badge>
        </div>
      )}

      {(isPending || submitted) && !isVerified && (
        <div className="flex items-center gap-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-5">
          <div className="size-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <FiClock className="size-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">
              Em Análise
            </h3>
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Os seus documentos estão a ser analisados pela equipa de moderação.
              Este processo demora normalmente até 48 horas.
            </p>
          </div>
          <Badge variant="pending" className="ml-auto shrink-0">
            Pendente
          </Badge>
        </div>
      )}

      {/* Benefits */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <FiShield className="size-5 text-primary" />
          Porque é importante verificar?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-sm font-medium text-foreground mb-1">
              Criar Campanhas
            </p>
            <p className="text-xs text-muted-foreground">
              Só utilizadores verificados podem criar campanhas.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-sm font-medium text-foreground mb-1">
              Levantar Fundos
            </p>
            <p className="text-xs text-muted-foreground">
              Necessário para receber fundos da carteira.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-sm font-medium text-foreground mb-1">
              Confiança
            </p>
            <p className="text-xs text-muted-foreground">
              Badge de verificado aumenta a credibilidade.
            </p>
          </div>
        </div>
      </div>

      {/* Upload steps */}
      {!isVerified && !isPending && !submitted && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">
            Documentos Necessários
          </h3>

          {KYC_STEPS.map((step, i) => {
            const isUploaded = !!uploads[step.id];

            return (
              <div
                key={step.id}
                className={`rounded-xl border p-5 transition-colors ${
                  isUploaded
                    ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isUploaded
                        ? "bg-emerald-100 dark:bg-emerald-900/40"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {isUploaded ? (
                      <FiCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <step.icon className="size-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-medium">
                        PASSO {i + 1}
                      </span>
                    </div>
                    <h4 className="font-medium text-foreground mt-0.5">
                      {step.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {step.description}
                    </p>

                    {isUploaded && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                        <FiCheck className="size-3" />
                        {uploads[step.id]}
                      </p>
                    )}
                  </div>

                  <Button
                    variant={isUploaded ? "ghost" : "outline"}
                    size="sm"
                    onClick={() => handleFileSelect(step.id)}
                    className="shrink-0"
                  >
                    <FiUpload className="size-4 mr-1" />
                    {isUploaded ? "Alterar" : "Carregar"}
                  </Button>
                </div>
              </div>
            );
          })}

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!KYC_STEPS.every((s) => uploads[s.id])}
            >
              <FiShield className="size-4 mr-2" />
              Submeter para Verificação
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
