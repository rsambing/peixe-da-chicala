"use client";

import { Button } from "@/components/ui";
import Image from "next/image";

interface WelcomePanelProps {
  onToggle: () => void;
  isFloating?: boolean;
  isDisabled?: boolean;
}

export function WelcomePanel({ onToggle, isDisabled }: WelcomePanelProps) {
  return (
    <div className="h-full w-full bg-primary flex flex-col items-center justify-center p-12 text-center text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <Image 
          src="/images/auth/login.png" 
          alt="" 
          fill 
          className="object-cover"
        />
      </div>
      
      <div className="relative z-10 space-y-6 max-w-sm">
        <h2 className="text-4xl font-display font-black leading-tight">
          Bem-vindo de Volta!
        </h2>
        <p className="text-white/80 text-lg leading-relaxed">
          Para se manter conectado connosco, por favor faça login com os seus dados pessoais.
        </p>
        <Button
          variant="outline"
          size="xl"
          onClick={onToggle}
          disabled={isDisabled}
          className="w-full border-white text-white hover:bg-white hover:text-primary transition-all duration-300 font-bold"
        >
          Criar Conta
        </Button>
      </div>
    </div>
  );
}
