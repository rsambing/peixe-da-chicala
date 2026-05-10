"use client";

import { Button } from "@/components/ui";
import Image from "next/image";

interface GetStartedPanelProps {
  onToggle: () => void;
  isFloating?: boolean;
  isDisabled?: boolean;
}

export function GetStartedPanel({ onToggle, isDisabled }: GetStartedPanelProps) {
  return (
    <div className="h-full w-full bg-primary flex flex-col items-center justify-center p-12 text-center text-white relative overflow-hidden">
       {/* Background Decor */}
       <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <Image 
          src="/images/auth/register.png" 
          alt="" 
          fill 
          className="object-cover"
        />
      </div>

      <div className="relative z-10 space-y-6 max-w-sm">
        <h2 className="text-4xl font-display font-black leading-tight">
          Olá, Amigo!
        </h2>
        <p className="text-white/80 text-lg leading-relaxed">
          Insira os seus dados pessoais e comece a sua jornada para uma Angola mais unida hoje.
        </p>
        <Button
          variant="outline"
          size="xl"
          onClick={onToggle}
          disabled={isDisabled}
          className="w-full border-white text-white hover:bg-white hover:text-primary transition-all duration-300 font-bold"
        >
          Iniciar Sessão
        </Button>
      </div>
    </div>
  );
}
