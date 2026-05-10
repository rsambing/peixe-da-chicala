"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { FiHome, FiSearch, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-6 overflow-hidden relative bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-black text-primary/2 select-none pointer-events-none whitespace-nowrap">
        404
      </div>
      <div className="absolute top-1/4 left-1/4 size-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 size-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-3xl w-full text-center relative z-10">
        {/* Animated Illustration Placeholder / Icon */}
        <div className="relative inline-block mb-12">
          <div className="size-32 sm:size-40 bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-black/5 dark:border-white/5 flex items-center justify-center mx-auto rotate-12 transition-transform hover:rotate-0 duration-500">
            <span className="text-6xl sm:text-7xl">🔍</span>
          </div>
          {/* Floating Sparkles */}
          <div className="absolute -top-4 -right-4 text-accent animate-pulse">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-black text-foreground mb-6 tracking-tighter leading-none">
          Oops! Página <br />
          não <span className="font-serif italic text-primary">encontrada</span>.
        </h1>
        
        <p className="text-xl sm:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
          Parece que a causa que procura mudou de lugar ou o link expirou. 
          Não se preocupe, ainda pode fazer a diferença por outro caminho.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="w-full sm:w-auto">
            <Button size="xl" className="w-full sm:w-auto px-10 gap-3">
              <FiHome className="size-5" />
              Voltar ao Início
            </Button>
          </Link>
          <Link href="/explorar" className="w-full sm:w-auto">
            <Button variant="outline" size="xl" className="w-full sm:w-auto px-10 gap-3 border-black/10 dark:border-white/10">
              <FiSearch className="size-5" />
              Explorar Projetos
            </Button>
          </Link>
        </div>

        {/* Secondary Link */}
        <button 
          onClick={() => window.history.back()}
          className="mt-12 group flex items-center gap-2 mx-auto text-muted-foreground hover:text-primary transition-colors font-display font-bold uppercase tracking-widest text-xs"
        >
          <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
          Voltar para a página anterior
        </button>
      </div>
    </main>
  );
}
