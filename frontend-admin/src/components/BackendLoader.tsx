"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function BackendLoader({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 800);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    fetch(`${apiUrl}/`)
      .catch(() => {})
      .finally(() => {
        clearTimeout(timer);
        setReady(true);
      });
    return () => clearTimeout(timer);
  }, []);

  if (!ready && slow) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-6">
          <div className="animate-bounce">
            <Image
              src="/images/logo.png"
              alt="Peixe da Chicala"
              width={80}
              height={80}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-3 text-center">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">A preparar o restaurante</p>
            <div className="flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </div>
          </div>
          <div className="w-48 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-400 dark:bg-zinc-600 rounded-full animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!ready) return null;
  return <>{children}</>;
}
