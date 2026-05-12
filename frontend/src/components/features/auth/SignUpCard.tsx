"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button, Input } from "@/components/ui";
import { FiMail, FiLock, FiUser, FiPhone, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import { Si42 } from "react-icons/si";
import { Province, PROVINCE_LABELS } from "@/lib/types";

interface SignUpCardProps {
  onLoadingChange?: (loading: boolean) => void;
}

export function SignUpCard({ onLoadingChange }: SignUpCardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    province: "",
    municipality: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();

  function update(field: string, value: string | boolean) {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: "" });
  }

  function validateStep1() {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Obrigatório.";
    if (!form.email.trim()) errs.email = "Obrigatório.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Inválido.";
    if (!form.phone.trim()) errs.phone = "Obrigatório.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2() {
    const errs: Record<string, string> = {};
    if (!form.password) errs.password = "Obrigatória.";
    else if (form.password.length < 8) errs.password = "Mínimo 8 caracteres.";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "As palavras-passe não coincidem.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep3() {
    const errs: Record<string, string> = {};
    if (!form.province) errs.province = "Seleccione a sua província.";
    if (!form.acceptTerms) errs.acceptTerms = "Deve aceitar os termos.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    onLoadingChange?.(true);
    setTimeout(() => {
      setLoading(false);
      onLoadingChange?.(false);
      login();
    }, 1500);
  }

  return (
    <div className="w-full max-w-sm flex flex-col gap-6">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-display font-black text-foreground">Criar Conta</h2>
        <p className="text-muted-foreground mt-2">
          Junte-se à causa por uma Angola melhor.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1.5 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
          <span className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted shadow-inner"}`}>
            {step > 1 ? <FiCheck className="size-3" /> : "1"}
          </span>
          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">Dados</span>
        </div>
        <div className="flex-1 h-px bg-border" />
        <div className={`flex items-center gap-1.5 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
          <span className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted shadow-inner"}`}>
            {step > 2 ? <FiCheck className="size-3" /> : "2"}
          </span>
          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">Senha</span>
        </div>
        <div className="flex-1 h-px bg-border" />
        <div className={`flex items-center gap-1.5 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
          <span className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted shadow-inner"}`}>
            3
          </span>
          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">Local</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
            <Input
              label="Nome Completo"
              placeholder="O seu nome"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              error={errors.fullName}
              leftIcon={<FiUser className="size-4" />}
            />
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.co.ao"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              error={errors.email}
              leftIcon={<FiMail className="size-4" />}
            />
            <Input
              label="Telefone"
              type="tel"
              placeholder="9XX XXX XXX"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              error={errors.phone}
              leftIcon={<FiPhone className="size-4" />}
            />
            <Button
              type="button"
              variant="primary"
              size="xl"
              className="w-full"
              onClick={handleNext}
            >
              Continuar
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Input
              label="Palavra-passe"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              error={errors.password}
              leftIcon={<FiLock className="size-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
                </button>
              }
            />
            <Input
              label="Confirmar Palavra-passe"
              type={showPassword ? "text" : "password"}
              placeholder="Repita a palavra-passe"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
              leftIcon={<FiLock className="size-4" />}
            />
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="xl" onClick={() => setStep(1)} className="px-6">Voltar</Button>
              <Button
                type="button"
                variant="primary"
                size="xl"
                className="flex-1"
                onClick={handleNext}
              >
                Continuar
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">Província</label>
              <select
                value={form.province}
                onChange={(e) => update("province", e.target.value)}
                className={`w-full h-11 rounded-lg border px-3 text-sm bg-card transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.province ? "border-destructive" : "border-border"
                }`}
              >
                <option value="">Seleccione a província</option>
                {Object.values(Province).map((p) => (
                  <option key={p} value={p}>{PROVINCE_LABELS[p]}</option>
                ))}
              </select>
            </div>
            <label className="flex items-start gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={form.acceptTerms}
                onChange={(e) => update("acceptTerms", e.target.checked)}
                className="size-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground leading-normal">
                Li e aceito os Termos de Serviço e Política de Privacidade.
              </span>
            </label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="xl" onClick={() => setStep(2)} className="px-6">Voltar</Button>
              <Button type="submit" variant="primary" size="xl" className="flex-1" loading={loading}>Finalizar</Button>
            </div>
          </>
        )}
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-card px-3 text-muted-foreground">ou</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 h-11 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-bold">
          <svg className="size-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>

        <button className="flex items-center justify-center gap-2 h-11 rounded-xl bg-black hover:bg-black/90 transition-colors text-sm font-bold text-white">
          <Si42 className="size-4" />
          42 Intra
        </button>
      </div>
    </div>
  );
}
