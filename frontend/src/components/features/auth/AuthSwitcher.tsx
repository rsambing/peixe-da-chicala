"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SignUpCard } from "./SignUpCard";
import { SignInCard } from "./SignInCard";
import { WelcomePanel } from "./WelcomePanel";
import { GetStartedPanel } from "./GetStartedPanel";
import { ArrowLeft } from "lucide-react";

type Screen = "signup" | "signin";

interface AuthSwitcherProps {
  initialScreen?: Screen;
}

export function AuthSwitcher({ initialScreen = "signin" }: AuthSwitcherProps) {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [isLoading, setIsLoading] = useState(false);

  const toggleScreen = () => {
    if (isLoading) return;
    setScreen((prev) => (prev === "signup" ? "signin" : "signup"));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 md:p-8 transition-colors selection:bg-primary selection:text-white">
      {/* Back to Landing Button */}
      <Link
        href="/"
        className="absolute left-6 top-8 z-50 flex items-center gap-2 rounded-full p-2 text-foreground transition-all hover:bg-muted sm:rounded-lg sm:px-3 sm:py-2 group"
      >
        <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
        <span className="hidden sm:inline text-sm font-bold font-display uppercase tracking-widest">Voltar</span>
      </Link>

      {/* VERSÃO MOBILE - Stack vertical */}
      <div className="lg:hidden w-full max-w-sm mt-12">
        <div className="relative bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
          <AnimatePresence mode="wait">
            {screen === "signup" ? (
              <motion.div
                key="signup-mobile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="p-6"
              >
                <SignUpCard onLoadingChange={setIsLoading} />
                <div className="mt-8 text-center">
                  <p className="text-muted-foreground text-sm mb-2">Já tem conta?</p>
                  <button onClick={toggleScreen} disabled={isLoading} className="text-primary font-bold hover:underline">Iniciar Sessão</button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signin-mobile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="p-6"
              >
                <SignInCard onLoadingChange={setIsLoading} />
                <div className="mt-8 text-center">
                  <p className="text-muted-foreground text-sm mb-2">Não tem conta?</p>
                  <button onClick={toggleScreen} disabled={isLoading} className="text-primary font-bold hover:underline">Criar Conta</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* VERSÃO DESKTOP - Sliding Panels */}
      <div className="hidden lg:block relative w-full max-w-[1100px] h-[700px] bg-card rounded-[32px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.1)] border border-border overflow-hidden ring-1 ring-border/50">
        <div className="flex h-full">
          {/* LADO ESQUERDO - Sign Up Card */}
          <div className="w-1/2 bg-card flex items-center justify-center p-12">
            <SignUpCard onLoadingChange={setIsLoading} />
          </div>

          {/* LADO DIREITO - Sign In Card */}
          <div className="w-1/2 bg-card flex items-center justify-center p-12">
            <SignInCard onLoadingChange={setIsLoading} />
          </div>

          {/* CARD ANIMADO - Desliza entre os lados */}
          <motion.div
            className="absolute top-0 h-full w-1/2 z-20 shadow-2xl"
            initial={false}
            animate={{
              left: screen === "signup" ? "50%" : "0%",
            }}
            transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          >
            {screen === "signup" ? (
              <GetStartedPanel onToggle={toggleScreen} isDisabled={isLoading} />
            ) : (
              <WelcomePanel onToggle={toggleScreen} isDisabled={isLoading} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
