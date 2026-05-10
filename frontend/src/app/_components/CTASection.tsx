import Link from "next/link";
import { Button } from "@/components/ui";
import Image from 'next/image';

export function CTASection() {
  return (
    <section className="relative pt-40 pb-32 px-6 bg-primary overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Slanted Top Divider */}
      <div 
        className="absolute top-0 left-0 right-0 h-24 bg-background"
        style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
      />

      {/* Decorative SVG Sparkles (Hand-drawn style) */}
      <div className="absolute top-24 left-10 text-accent animate-pulse opacity-50">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* Geometric Graphic (Right Side) */}
      <div className="absolute top-1/2 right-[-5%] -translate-y-1/2 hidden lg:block">
        <div className="relative size-125">
          {/* Geometric shapes behind */}
          <div className="absolute top-0 right-0 size-full bg-accent/20 rounded-[4rem] rotate-12 blur-2xl" />
          <div className="absolute top-10 right-10 size-full bg-white/10 rounded-[4rem] -rotate-6" />
          
          {/* Main Image in Shape */}
          <div className="absolute inset-0 size-full overflow-hidden rounded-[4rem] rotate-3 shadow-2xl border-8 border-white/10">
            <Image
              src="/images/call_action.avif"
              alt="Dê o próximo passo"
              className="size-full object-cover transition-all duration-700 hover:scale-110"
              width={500}
              height={500}
            />
          </div>

          {/* Floating Small Block (Yellow block from description) */}
          <div className="absolute top-1/4 -left-12 size-32 bg-accent rounded-3xl shadow-2xl flex items-center justify-center -rotate-12 animate-bounce duration-3000">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="lg:max-w-3xl">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black text-white mb-8 leading-[1.05] tracking-tight text-left">
            Dê o próximo passo <br />
            para <span className="font-serif italic text-accent underline underline-offset-8 decoration-white/20">mudar</span> Angola.
          </h2>
          <p className="text-xl sm:text-2xl text-white/80 mb-12 leading-relaxed text-left max-w-2xl">
            Seja um sonho pequeno ou um projecto comunitário gigante, 
            estamos aqui para ajudar a concretizar.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 justify-start">
            <Link href="/campanhas/criar" className="w-full sm:w-auto">
              <Button variant="accent" size="xl" className="w-full sm:w-auto text-lg px-12 shadow-2xl shadow-accent/40 bg-[#FFC53D] hover:bg-[#FFD470] text-primary">
                Começar agora gratuitamente
              </Button>
            </Link>
            <Link href="/explorar" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="xl"
                className="w-full sm:w-auto border-white/40 text-white hover:bg-white hover:text-primary text-lg px-12 backdrop-blur-sm"
              >
                Ver projectos activos
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-center gap-x-10 gap-y-4 text-white/50 text-sm font-semibold uppercase tracking-widest">
          <span className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_rgba(255,197,61,0.5)]" />
            Taxa Zero para Iniciantes
          </span>
          <span className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_rgba(255,197,61,0.5)]" />
            Segurança de Nível Bancário
          </span>
          <span className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_rgba(255,197,61,0.5)]" />
            Suporte Local 24/7
          </span>
        </div>
      </div>
    </section>
  );
}
