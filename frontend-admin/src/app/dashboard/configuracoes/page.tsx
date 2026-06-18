"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { adminApi } from "@/lib/api";
import type { SiteSettings } from "@/lib/api-types";
import { ImagePlus, Check } from "lucide-react";

interface BgFieldProps {
  label: string;
  description: string;
  settingKey: string;
  currentUrl: string;
  onSaved: (key: string, url: string) => void;
}

function BgField({ label, description, settingKey, currentUrl, onSaved }: BgFieldProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePick(f: File | null) {
    setFile(f);
    setSaved(false);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  async function save() {
    if (!file) return;
    setSaving(true);
    try {
      const result = await adminApi.updateSetting(settingKey, undefined, file);
      onSaved(settingKey, result.value);
      setFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao guardar");
    } finally {
      setSaving(false);
    }
  }

  const displayUrl = preview || currentUrl;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
      <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800">
        {displayUrl ? (
          <Image src={displayUrl} alt={label} fill className="object-cover" unoptimized />
        ) : (
          <div className="size-full flex items-center justify-center">
            <ImagePlus className="size-8 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 flex items-end p-4">
          <div>
            <p className="font-black text-white text-sm">{label}</p>
            <p className="text-white/70 text-xs">{description}</p>
          </div>
        </div>
      </div>

      <div className="p-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-zinc-400 text-sm text-gray-500 dark:text-gray-400 transition-colors"
        >
          <ImagePlus className="size-4" />
          {file ? file.name : "Escolher imagem"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handlePick(e.target.files?.[0] ?? null)}
        />

        {file && (
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-60 text-white font-bold text-sm transition-colors"
          >
            {saving ? "A guardar…" : "Guardar"}
          </button>
        )}

        {saved && !file && (
          <span className="flex items-center gap-1.5 text-sm text-green-600">
            <Check className="size-4" /> Guardado
          </span>
        )}
      </div>
    </div>
  );
}

export default function ConfiguracoesPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getSettings()
      .then(setSettings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleSaved(key: string, value: string) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Configurações</h1>
        <p className="text-sm text-gray-500 mt-1">Personaliza o aspecto visual do site.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : settings ? (
        <>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Imagens de Fundo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BgField
              label="Hero Section"
              description="Fundo da página principal"
              settingKey="heroImageUrl"
              currentUrl={settings.heroImageUrl}
              onSaved={handleSaved}
            />
            <BgField
              label="Página de Login"
              description="Fundo do painel de gestão"
              settingKey="loginBgUrl"
              currentUrl={settings.loginBgUrl}
              onSaved={handleSaved}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
