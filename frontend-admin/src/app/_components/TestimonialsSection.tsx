"use client";

import { useState } from "react";
import Image from "next/image";

const testimonials = [
  {
    quote:
      "O cacusso grelhado daqui não tem comparação. Temperado no ponto, servido quente — é o sabor de Luanda de verdade. Já peço duas vezes por semana.",
    name: "Domingos Ferreira",
    role: "Cliente habitual, Chicala",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  },
  {
    quote:
      "Fiz o pedido pelo site, acompanhei em tempo real com o código e chegou quentinho. Nem sabia que era possível. Agora não peço de outra forma.",
    name: "Carla Nzinga",
    role: "Cliente online, Luanda",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop&crop=face",
  },
  {
    quote:
      "Trouxe a minha família toda ao fim-de-semana. O combo Brasa para 2 acabou a alimentar quatro pessoas — generoso, saboroso e bem servido.",
    name: "Paulo Tchipalanga",
    role: "Cliente familiar, Luanda Sul",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
  },
];

export function TestimonialsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-16 px-6 bg-black">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl sm:text-3xl font-display font-black text-white mb-1">
          O Que Dizem os Nossos Clientes
        </h2>
        <p className="text-white/50 mb-10 text-sm">
          Experiências reais de quem já provou
        </p>

        {/* Quote — altura fixa para evitar layout shift */}
        <div className="min-h-[112px] flex items-center justify-center mb-8">
          <blockquote className="text-lg sm:text-xl font-serif text-white/85 leading-relaxed font-light italic">
            &ldquo;{testimonials[active].quote}&rdquo;
          </blockquote>
        </div>

        {/* Author */}
        <div className="flex flex-col items-center gap-3">
          <Image
            src={testimonials[active].avatar}
            alt={testimonials[active].name}
            width={64}
            height={64}
            className="size-16 rounded-full object-cover border-2 border-white/20"
          />
          <div>
            <p className="font-display font-bold text-white text-sm">{testimonials[active].name}</p>
            <p className="text-xs text-white/50">{testimonials[active].role}</p>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active
                  ? "bg-accent w-6"
                  : "bg-white/20 w-2 hover:bg-white/40"
              }`}
              aria-label={`Testemunho ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
