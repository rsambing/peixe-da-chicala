"use client";

import { useState } from "react";
import { FiPlay } from "react-icons/fi";
import Image from "next/image";

export function SuccessStory() {
  const [playing, setPlaying] = useState(false);
  const videoId = "KT9z36ad7SQ";

  return (
    <section className="py-20 px-6 bg-linear-to-b from-background via-primary/3 to-background">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-display font-bold tracking-widest uppercase text-accent mb-3">
            História de Sucesso
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground mb-4 leading-tight">
            A mãe Arlete foi operada com{" "}
            <span className="font-serif italic text-primary">sucesso</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Esta é a prova de que juntos podemos transformar vidas. Graças à
            generosidade da comunidade, a mãe Arlete recebeu a operação que
            tanto precisava.
          </p>
        </div>

        {/* Video embed */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
          {!playing ? (
            <>
              {/* Thumbnail */}
              <Image
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="A mãe Arlete foi operada com sucesso"
                className="w-full h-full object-cover"
                width={800}
                height={450}
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/30 transition-colors hover:bg-black/20" />

              {/* Play button */}
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 flex items-center justify-center group"
                aria-label="Reproduzir vídeo"
              >
                <div className="flex items-center justify-center size-20 rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition-transform group-hover:scale-110">
                  <FiPlay className="size-8 ml-1" />
                </div>
              </button>

              {/* Bottom caption */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-5">
                <p className="text-white font-semibold text-sm sm:text-base">
                  Melhor notícia do ano: a mãe Arlete foi operada com sucesso
                </p>
              </div>
            </>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="A mãe Arlete foi operada com sucesso"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          )}
        </div>
      </div>
    </section>
  );
}
