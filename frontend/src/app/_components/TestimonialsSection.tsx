"use client";

import { useState } from "react";
import Image from "next/image";

const testimonials = [
  {
    quote:
      "Graças ao Levanta Angola, conseguimos construir a escola que a nossa comunidade precisa. O processo foi transparente e as actualizações mantiveram todos os doadores informados.",
    name: "Ana Beatriz Mendes",
    role: "Criadora de Campanha, Luanda",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote:
      "Contribuí para três campanhas e adoro poder acompanhar exactamente como os fundos estão a ser utilizados. Finalmente uma plataforma que nos dá confiança.",
    name: "Carlos Eduardo Silva",
    role: "Doador Frequente, Benguela",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote:
      "A nossa organização já financiou 5 projectos através da plataforma. A visibilidade e o apoio da comunidade superaram as nossas expectativas.",
    name: "Teresa Makiesse",
    role: "Directora, Fundação Esperança",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
  },
];

export function TestimonialsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 px-6 bg-primary dark:bg-gray-900">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-4">
          O Que Dizem Sobre Nós
        </h2>
        <p className="text-white/60 mb-1 text-lg">
          Histórias reais de quem está a fazer a diferença
        </p>

        {/* Quote */}
        <div className="relative min-h-50 flex items-center justify-center">
          <blockquote className="text-xl sm:text-2xl font-serif text-white/90 leading-relaxed font-light italic max-w-3xl">
            &ldquo;{testimonials[active].quote}&rdquo;
          </blockquote>
        </div>

        {/* Author */}
        <div className="mt-2 flex flex-col items-center gap-3">
          <Image
            src={testimonials[active].avatar}
            alt={testimonials[active].name}
            width={120}
            height={120}
            className="size-30 rounded-full object-cover border-2 border-white/20"
          />
          <div>
            <p className="font-display font-bold text-white">{testimonials[active].name}</p>
            <p className="text-sm text-white/50">{testimonials[active].role}</p>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`size-3 rounded-full transition-all duration-300 ${
                i === active
                  ? "bg-accent w-8"
                  : "bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Testemunho ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
