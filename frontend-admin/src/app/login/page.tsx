"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { adminApi } from "@/lib/api";

const FALLBACK_BG =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2200&q=80";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bgUrl, setBgUrl] = useState<string>(FALLBACK_BG);

  useEffect(() => {
    adminApi
      .getSettings()
      .then((s) => { if (s.loginBgUrl) setBgUrl(s.loginBgUrl); })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await adminApi.login(email.trim(), password);
      login(token);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background image */}
      <Image
        src={bgUrl}
        alt=""
        fill
        className="object-cover"
        priority
        sizes="100vw"
        unoptimized={bgUrl.startsWith("https://i.ibb.co") || bgUrl.startsWith("https://ibb.co")}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 space-y-5"
        >
          <div className="flex flex-col items-center gap-2 mb-2">
            <Image
              src="/images/logo-com-escrita.png"
              alt="Peixe da Chicala"
              width={140}
              height={56}
            />
            <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Painel de Gestão</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@exemplo.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
            />
          </div>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2 border border-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-60 text-white font-bold py-2.5 text-sm transition-colors"
          >
            {loading ? "A entrar…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
