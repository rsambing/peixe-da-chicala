"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { adminApi } from "@/lib/api";
import type { ApiTestimonial } from "@/lib/api-types";
import { Plus, Pencil, Trash2, X, Check, ImagePlus, GripVertical } from "lucide-react";

interface TestimonialForm {
  quote: string;
  name: string;
  role: string;
  avatarFile: File | null;
  avatarPreview: string | null;
}

function emptyForm(): TestimonialForm {
  return { quote: "", name: "", role: "", avatarFile: null, avatarPreview: null };
}

function Modal({
  title,
  form,
  setForm,
  onSave,
  onClose,
  saving,
}: {
  title: string;
  form: TestimonialForm;
  setForm: React.Dispatch<React.SetStateAction<TestimonialForm>>;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAvatar(f: File | null) {
    if (!f) return;
    setForm((p) => ({ ...p, avatarFile: f, avatarPreview: URL.createObjectURL(f) }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-gray-900 dark:text-white text-lg">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
            <X className="size-4" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 relative">
            {form.avatarPreview ? (
              <Image src={form.avatarPreview} alt="Avatar" fill className="object-cover" unoptimized />
            ) : (
              <div className="size-full flex items-center justify-center">
                <ImagePlus className="size-5 text-gray-400" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-zinc-400 text-sm text-gray-500 dark:text-gray-400 transition-colors"
          >
            <ImagePlus className="size-4" />
            {form.avatarFile ? form.avatarFile.name : "Escolher foto"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatar(e.target.files?.[0] ?? null)} />
        </div>

        <div className="space-y-3">
          <textarea
            rows={4}
            placeholder="Citação do cliente..."
            value={form.quote}
            onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
          <input
            placeholder="Nome"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
          <input
            placeholder="Cargo/Localização (ex: Cliente habitual, Luanda)"
            value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={saving || !form.quote.trim() || !form.name.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold text-sm transition-colors"
          >
            {saving ? "A guardar…" : <><Check className="size-4" /> Guardar</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TestemunhosPage() {
  const [list, setList] = useState<ApiTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<TestimonialForm>(emptyForm());
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setList(await adminApi.getTestimonials());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setModalOpen(true);
  }

  function openEdit(t: ApiTestimonial) {
    setEditingId(t.id);
    setForm({
      quote: t.quote,
      name: t.name,
      role: t.role,
      avatarFile: null,
      avatarPreview: t.avatarUrl ?? null,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("quote", form.quote);
      fd.append("name", form.name);
      fd.append("role", form.role);
      fd.append("sortOrder", String(editingId !== null ? (list.find(t => t.id === editingId)?.sortOrder ?? 0) : list.length));
      if (form.avatarFile) fd.append("avatar", form.avatarFile);

      if (editingId !== null) {
        const updated = await adminApi.updateTestimonial(editingId, fd);
        setList((p) => p.map((t) => (t.id === editingId ? updated : t)));
      } else {
        const created = await adminApi.createTestimonial(fd);
        setList((p) => [...p, created].sort((a, b) => a.sortOrder - b.sortOrder));
      }
      setModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      await adminApi.deleteTestimonial(id);
      setList((p) => p.filter((t) => t.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao eliminar");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Testemunhos</h1>
          <p className="text-sm text-gray-500 mt-1">Avaliações que aparecem na página inicial.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm transition-colors"
        >
          <Plus className="size-4" /> Adicionar
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-display font-bold">Sem testemunhos</p>
          <p className="text-sm mt-1">Adiciona o primeiro clicando no botão acima.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((t) => (
            <div key={t.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 flex items-start gap-4">
              <GripVertical className="size-4 text-gray-300 dark:text-gray-600 mt-1 shrink-0" />
              <div className="size-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 relative">
                {t.avatarUrl ? (
                  <Image src={t.avatarUrl} alt={t.name} fill className="object-cover" unoptimized={t.avatarUrl.includes("ibb.co")} />
                ) : (
                  <div className="size-full flex items-center justify-center text-gray-400 text-lg font-bold">
                    {t.name[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-display font-black text-gray-900 dark:text-white">{t.name}</p>
                <p className="text-xs text-gray-400 mb-1">{t.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 italic">&ldquo;{t.quote}&rdquo;</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEdit(t)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deletingId === t.id}
                  className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal
          title={editingId !== null ? "Editar Testemunho" : "Novo Testemunho"}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
          saving={saving}
        />
      )}
    </div>
  );
}
