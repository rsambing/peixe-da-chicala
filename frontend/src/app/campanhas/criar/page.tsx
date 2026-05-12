"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout";
import { Footer } from "@/components/layout";
import { Button, Input, Badge } from "@/components/ui";
import {
  Category,
  Province,
  CATEGORY_LABELS,
  PROVINCE_LABELS,
} from "@/lib/types";
import { CategoryIcon } from "@/components/features/campaigns";
import { currentUser, mockOrganizations } from "@/lib/mock";
import { formatCurrency } from "@/lib/mock/helpers";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiUpload,
  FiTrash2,
  FiPlus,
  FiX,
  FiClock,
} from "react-icons/fi";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4 | 5;

const STEPS = [
  { label: "Informações", short: "Info" },
  { label: "Detalhes", short: "Detalhes" },
  { label: "Média", short: "Média" },
  { label: "Recompensas", short: "Recomp." },
  { label: "Revisão", short: "Revisão" },
];

interface RewardDraft {
  title: string;
  description: string;
  minAmount: string;
  stockTotal: string;
}

export default function CreateCampaignPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1 — Basic info
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [province, setProvince] = useState<Province | "">("");
  const [orgId, setOrgId] = useState("");

  // Step 2 — Details
  const [fullDesc, setFullDesc] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [endDate, setEndDate] = useState("");

  // Step 3 — Media
  const [images, setImages] = useState<string[]>([]);

  // Step 4 — Rewards
  const [rewards, setRewards] = useState<RewardDraft[]>([]);

  const userOrgs = mockOrganizations.filter((org) =>
    org.members.some((m) => m.userId === currentUser.id)
  );

  function validate(s: Step): boolean {
    const errs: Record<string, string> = {};

    if (s === 1) {
      if (!title.trim()) errs.title = "Título é obrigatório.";
      if (title.length > 100) errs.title = "Máximo 100 caracteres.";
      if (!shortDesc.trim()) errs.shortDesc = "Descrição curta é obrigatória.";
      if (!category) errs.category = "Seleccione uma categoria.";
      if (!province) errs.province = "Seleccione uma província.";
    }
    if (s === 2) {
      if (!fullDesc.trim()) errs.fullDesc = "Descrição completa é obrigatória.";
      if (fullDesc.length < 100) errs.fullDesc = "Mínimo 100 caracteres.";
      const goal = parseInt(goalAmount);
      if (!goal || goal < 100_000) errs.goalAmount = "Meta mínima: 100.000 Kz.";
      if (!endDate) errs.endDate = "Data de fim é obrigatória.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (validate(step)) {
      setStep(Math.min(step + 1, 5) as Step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function prev() {
    setStep(Math.max(step - 1, 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addImage() {
    // Simulate image upload
    const demoImages = [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=800&fit=crop",
    ];
    const next = demoImages[images.length % demoImages.length];
    setImages([...images, next]);
  }

  function removeImage(idx: number) {
    setImages(images.filter((_, i) => i !== idx));
  }

  function addReward() {
    setRewards([
      ...rewards,
      { title: "", description: "", minAmount: "", stockTotal: "" },
    ]);
  }

  function updateReward(idx: number, field: keyof RewardDraft, value: string) {
    const updated = [...rewards];
    updated[idx] = { ...updated[idx], [field]: value };
    setRewards(updated);
  }

  function removeReward(idx: number) {
    setRewards(rewards.filter((_, i) => i !== idx));
  }

  function handleSubmit() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Campanha submetida para análise!");
      window.location.href = "/dashboard/campanhas";
    }, 2000);
  }

  const selectedOrg = mockOrganizations.find((o) => o.id === orgId);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="mx-auto max-w-3xl">
          {/* Back link */}
          <Link
            href="/dashboard/campanhas"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <FiArrowLeft className="size-4" /> Voltar às campanhas
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Criar Nova Campanha
          </h1>
          <p className="text-muted-foreground mb-8">
            Preencha as informações para submeter a sua campanha para análise.
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-1 mb-10">
            {STEPS.map((s, i) => {
              const stepNum = (i + 1) as Step;
              const isActive = step === stepNum;
              const isDone = step > stepNum;

              return (
                <div key={i} className="flex-1 flex items-center gap-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isDone
                          ? "bg-primary text-primary-foreground"
                          : isActive
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isDone ? <FiCheck className="size-4" /> : stepNum}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs mt-1 ${
                        isActive ? "text-primary font-medium" : "text-muted-foreground"
                      }`}
                    >
                      <span className="hidden sm:inline">{s.label}</span>
                      <span className="sm:hidden">{s.short}</span>
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 -mt-5 ${
                        step > stepNum ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Step 1: Basic Info ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-5">
                <h2 className="font-semibold text-foreground text-lg">
                  Informações Básicas
                </h2>

                <Input
                  label="Título da Campanha"
                  placeholder="Ex: Construção de escola em Viana"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={errors.title}
                  helperText={`${title.length}/100 caracteres`}
                />

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Descrição Curta
                  </label>
                  <textarea
                    placeholder="Uma frase que resume o projecto (máx. 200 caracteres)"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    rows={2}
                    maxLength={200}
                    className={`w-full rounded-lg border px-3 py-2 text-sm bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none ${
                      errors.shortDesc ? "border-destructive" : "border-input"
                    }`}
                  />
                  {errors.shortDesc && (
                    <p className="text-xs text-destructive mt-1">{errors.shortDesc}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {shortDesc.length}/200 caracteres
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Categoria
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.values(Category).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`p-3 rounded-lg border text-sm text-left transition-all ${
                          category === cat
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-primary/40"
                        }`}
                      >
                        <span className="text-xl block mb-1">
                          <CategoryIcon category={cat} className="size-5" />
                        </span>
                        <span className="font-medium text-foreground text-xs">
                          {CATEGORY_LABELS[cat]}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="text-xs text-destructive mt-1">{errors.category}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Província
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value as Province)}
                      className={`w-full h-10 rounded-lg border px-3 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                        errors.province ? "border-destructive" : "border-input"
                      }`}
                    >
                      <option value="">Seleccione</option>
                      {Object.values(Province).map((p) => (
                        <option key={p} value={p}>
                          {PROVINCE_LABELS[p]}
                        </option>
                      ))}
                    </select>
                    {errors.province && (
                      <p className="text-xs text-destructive mt-1">{errors.province}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Organização (opcional)
                    </label>
                    <select
                      value={orgId}
                      onChange={(e) => setOrgId(e.target.value)}
                      className="w-full h-10 rounded-lg border border-input px-3 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Pessoal</option>
                      {userOrgs.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Details ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-5">
                <h2 className="font-semibold text-foreground text-lg">
                  Detalhes da Campanha
                </h2>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Descrição Completa
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Use Markdown: ## para títulos, - para listas, **texto** para negrito
                  </p>
                  <textarea
                    placeholder={"## O Problema\n\nDescreva o contexto e o problema que quer resolver...\n\n## A Nossa Solução\n\nExplique como pretende resolver o problema...\n\n## Impacto Esperado\n\n- Benefício 1\n- Benefício 2"}
                    value={fullDesc}
                    onChange={(e) => setFullDesc(e.target.value)}
                    rows={12}
                    className={`w-full rounded-lg border px-3 py-2 text-sm bg-card font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y ${
                      errors.fullDesc ? "border-destructive" : "border-input"
                    }`}
                  />
                  {errors.fullDesc && (
                    <p className="text-xs text-destructive mt-1">{errors.fullDesc}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {fullDesc.length} caracteres (mínimo 100)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Meta Financeira (Kz)"
                      type="number"
                      placeholder="Ex: 5000000"
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(e.target.value)}
                      error={errors.goalAmount}
                      helperText={
                        goalAmount
                          ? `= ${formatCurrency(parseInt(goalAmount) || 0)}`
                          : "Mínimo: 100.000 Kz"
                      }
                    />
                  </div>
                  <div>
                    <Input
                      label="Data de Fim"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      error={errors.endDate}
                      helperText="A campanha terminará automaticamente nesta data."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Media ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-5">
                <h2 className="font-semibold text-foreground text-lg">
                  Imagens da Campanha
                </h2>
                <p className="text-sm text-muted-foreground">
                  Adicione imagens que mostrem o projecto. A primeira imagem será a capa.
                </p>

                {/* Image grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group"
                    >
                      <Image
                        src={img}
                        alt={`Imagem ${i + 1}`}
                        width={256}
                        height={256}
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && (
                        <Badge
                          variant="accent"
                          className="absolute top-2 left-2 text-[10px]"
                        >
                          Capa
                        </Badge>
                      )}
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 size-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiTrash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Upload button */}
                  <button
                    type="button"
                    onClick={addImage}
                    className="aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors"
                  >
                    <FiUpload className="size-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Carregar
                    </span>
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Formatos: JPG, PNG, WebP. Máximo 5MB por imagem.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 4: Rewards ── */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-foreground text-lg">
                      Recompensas
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Opcional — ofereça recompensas para incentivar doações maiores.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addReward}
                  >
                    <FiPlus className="size-4 mr-1" />
                    Adicionar
                  </Button>
                </div>

                {rewards.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    <p className="text-sm">Nenhuma recompensa adicionada.</p>
                    <p className="text-xs mt-1">
                      As recompensas são opcionais mas podem aumentar as doações.
                    </p>
                  </div>
                )}

                {rewards.map((reward, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        Recompensa {i + 1}
                      </span>
                      <button
                        onClick={() => removeReward(i)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <FiX className="size-4" />
                      </button>
                    </div>

                    <Input
                      label="Título"
                      placeholder="Ex: Certificado de Apoiante"
                      value={reward.title}
                      onChange={(e) => updateReward(i, "title", e.target.value)}
                    />

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Descrição
                      </label>
                      <textarea
                        placeholder="O que o doador recebe..."
                        value={reward.description}
                        onChange={(e) =>
                          updateReward(i, "description", e.target.value)
                        }
                        rows={2}
                        className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Valor Mínimo (Kz)"
                        type="number"
                        placeholder="5000"
                        value={reward.minAmount}
                        onChange={(e) =>
                          updateReward(i, "minAmount", e.target.value)
                        }
                      />
                      <Input
                        label="Stock (vazio = ilimitado)"
                        type="number"
                        placeholder="100"
                        value={reward.stockTotal}
                        onChange={(e) =>
                          updateReward(i, "stockTotal", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 5: Review ── */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-6">
                <h2 className="font-semibold text-foreground text-lg">
                  Revisão da Campanha
                </h2>
                <p className="text-sm text-muted-foreground">
                  Reveja os dados antes de submeter para análise da equipa de moderação.
                </p>

                {/* Summary */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block">Título</span>
                      <span className="font-medium text-foreground">{title || "—"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Categoria</span>
                      <span className="font-medium text-foreground inline-flex items-center gap-1">
                        {category ? <><CategoryIcon category={category} className="size-3.5" /> {CATEGORY_LABELS[category]}</> : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Província</span>
                      <span className="font-medium text-foreground">
                        {province ? PROVINCE_LABELS[province] : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Meta</span>
                      <span className="font-medium text-foreground">
                        {goalAmount ? formatCurrency(parseInt(goalAmount)) : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Data de Fim</span>
                      <span className="font-medium text-foreground">
                        {endDate || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Organização</span>
                      <span className="font-medium text-foreground">
                        {selectedOrg ? selectedOrg.name : "Pessoal"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground text-sm block mb-1">
                      Descrição Curta
                    </span>
                    <p className="text-sm text-foreground">{shortDesc || "—"}</p>
                  </div>

                  <div>
                    <span className="text-muted-foreground text-sm block mb-1">
                      Imagens
                    </span>
                    {images.length > 0 ? (
                      <div className="flex gap-2">
                        {images.map((img, i) => (
                          <Image
                            key={i}
                            src={img}
                            alt=""
                            width={64}
                            height={64}
                            className="size-16 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma imagem</p>
                    )}
                  </div>

                  <div>
                    <span className="text-muted-foreground text-sm block mb-1">
                      Recompensas
                    </span>
                    {rewards.length > 0 ? (
                      <div className="space-y-1">
                        {rewards.map((r, i) => (
                          <p key={i} className="text-sm text-foreground">
                            • {r.title || "Sem título"} —{" "}
                            {r.minAmount ? formatCurrency(parseInt(r.minAmount)) : "—"}+
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma recompensa</p>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200 inline-flex items-start gap-1.5">
                    <FiClock className="size-4 mt-0.5 shrink-0" /> Após submissão, a campanha será analisada pela equipa de
                    moderação em até <strong>48 horas</strong>. Será notificado
                    por email quando for aprovada.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={prev}
              disabled={step === 1}
            >
              <FiArrowLeft className="size-4 mr-2" />
              Anterior
            </Button>

            {step < 5 ? (
              <Button variant="primary" onClick={next}>
                Próximo
                <FiArrowRight className="size-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="accent"
                size="lg"
                onClick={handleSubmit}
                loading={submitting}
              >
                <FiCheck className="size-4 mr-2" />
                Submeter Campanha
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
