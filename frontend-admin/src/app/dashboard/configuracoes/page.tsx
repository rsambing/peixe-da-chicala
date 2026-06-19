"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { adminApi } from "@/lib/api";
import type { SiteSettings } from "@/lib/api-types";
import { ImagePlus, Check, Pencil } from "lucide-react";

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

interface TextFieldProps {
  label: string;
  description?: string;
  settingKey: string;
  currentValue: string;
  multiline?: boolean;
  onSaved: (key: string, value: string) => void;
}

function TextField({ label, description, settingKey, currentValue, multiline, onSaved }: TextFieldProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await adminApi.updateSetting(settingKey, value);
      onSaved(settingKey, value);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{label}</p>
          {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
        {!editing && (
          <button
            onClick={() => { setEditing(true); setValue(currentValue); }}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
          >
            <Pencil className="size-3.5" />
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-2">
          {multiline ? (
            <textarea
              rows={3}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300"
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-300"
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-60 text-white font-bold text-xs transition-colors"
            >
              {saving ? "A guardar…" : <><Check className="size-3" /> Guardar</>}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-300 break-all">{currentValue || <span className="italic text-gray-400">Vazio</span>}</p>
      )}

      {saved && !editing && (
        <span className="flex items-center gap-1.5 text-xs text-green-600">
          <Check className="size-3" /> Guardado
        </span>
      )}
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
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BgField
              label="Hero Section"
              description="Fundo da página principal"
              settingKey="heroImageUrl"
              currentUrl={settings.heroImageUrl}
              onSaved={handleSaved}
            />
            <BgField
              label="Secção Sobre"
              description="Imagem do mar à brasa"
              settingKey="sobreImageUrl"
              currentUrl={settings.sobreImageUrl}
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

          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider pt-2">
            Como Funciona - Imagens dos Passos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BgField
              label="Passo 01 - Escolhe o teu prato"
              description="Imagem do cardápio/seleção"
              settingKey="howItWorksStep1ImageUrl"
              currentUrl={settings.howItWorksStep1ImageUrl}
              onSaved={handleSaved}
            />
            <BgField
              label="Passo 02 - Confirma e paga"
              description="Imagem do pagamento"
              settingKey="howItWorksStep2ImageUrl"
              currentUrl={settings.howItWorksStep2ImageUrl}
              onSaved={handleSaved}
            />
            <BgField
              label="Passo 03 - Acompanha em tempo real"
              description="Imagem da entrega/rastreio"
              settingKey="howItWorksStep3ImageUrl"
              currentUrl={settings.howItWorksStep3ImageUrl}
              onSaved={handleSaved}
            />
          </div>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider pt-2">
            Contactos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Telefone"
              description="Número exibido na página de contactos"
              settingKey="contactPhone"
              currentValue={settings.contactPhone}
              onSaved={handleSaved}
            />
            <TextField
              label="WhatsApp"
              description="Só dígitos, ex: 244923456789"
              settingKey="contactWhatsapp"
              currentValue={settings.contactWhatsapp}
              onSaved={handleSaved}
            />
            <TextField
              label="Email"
              settingKey="contactEmail"
              currentValue={settings.contactEmail}
              onSaved={handleSaved}
            />
            <TextField
              label="Morada"
              settingKey="contactAddress"
              currentValue={settings.contactAddress}
              onSaved={handleSaved}
            />
            <TextField
              label="Horário"
              settingKey="contactHours"
              currentValue={settings.contactHours}
              onSaved={handleSaved}
            />
            <TextField
              label="URL do Mapa (Google Maps Embed)"
              description="Cole o src do iframe do Google Maps"
              settingKey="contactMapEmbedUrl"
              currentValue={settings.contactMapEmbedUrl}
              multiline
              onSaved={handleSaved}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
