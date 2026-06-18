"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { adminApi } from "@/lib/api";
import type { ApiCategory } from "@/lib/api-types";
import { Plus, Pencil, Trash2, Check, X, ImagePlus } from "lucide-react";

export default function CategoriasPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New category
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const newFileRef = useRef<HTMLInputElement>(null);

  // Inline edit
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const editFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setCategories(await adminApi.getCategories());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  }

  function handleNewImagePick(file: File | null) {
    setNewImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setNewPreview(url);
    } else {
      setNewPreview(null);
    }
  }

  function handleEditImagePick(file: File | null) {
    setEditImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setEditPreview(url);
    } else {
      setEditPreview(null);
    }
  }

  async function createCategory() {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const created = await adminApi.createCategory(newName.trim(), newImage ?? undefined);
      setCategories((prev) => [...prev, created]);
      setNewName("");
      setNewImage(null);
      setNewPreview(null);
      if (newFileRef.current) newFileRef.current.value = "";
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao criar");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(cat: ApiCategory) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditImage(null);
    setEditPreview(cat.imageUrl ?? null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditImage(null);
    setEditPreview(null);
  }

  async function saveEdit() {
    if (!editName.trim() || !editingId) return;
    setSavingEdit(true);
    try {
      const updated = await adminApi.updateCategory(
        editingId,
        editName.trim(),
        editImage ?? undefined
      );
      setCategories((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
      cancelEdit();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao actualizar");
    } finally {
      setSavingEdit(false);
    }
  }

  async function deleteCategory(id: number) {
    if (!confirm("Eliminar esta categoria? Os produtos associados ficam sem categoria.")) return;
    try {
      await adminApi.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao eliminar");
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Categorias</h1>
        <p className="text-sm text-gray-500 mt-1">{categories.length} categoria(s)</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Add new */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 space-y-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nova Categoria</p>

        <div className="flex gap-4 items-start">
          {/* Image picker */}
          <button
            type="button"
            onClick={() => newFileRef.current?.click()}
            className="shrink-0 size-16 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-zinc-400 transition-colors overflow-hidden flex items-center justify-center"
          >
            {newPreview ? (
              <Image src={newPreview} alt="preview" width={64} height={64} className="object-cover size-full" unoptimized />
            ) : (
              <ImagePlus className="size-5 text-gray-400" />
            )}
          </button>
          <input
            ref={newFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleNewImagePick(e.target.files?.[0] ?? null)}
          />

          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createCategory()}
            placeholder="Ex.: Peixes Grelhados"
            className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />

          <button
            onClick={createCategory}
            disabled={creating || !newName.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-60 text-white font-bold text-sm transition-colors shrink-0"
          >
            <Plus className="size-4" />
            {creating ? "A criar…" : "Criar"}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Nenhuma categoria criada ainda.
          </div>
        ) : (
          <ul>
            {categories.map((cat, i) => (
              <li
                key={cat.id}
                className={[
                  "flex items-center gap-3 px-5 py-3",
                  i < categories.length - 1 ? "border-b border-gray-50 dark:border-white/5" : "",
                  "hover:bg-gray-50 dark:hover:bg-gray-800/30",
                ].join(" ")}
              >
                {/* Thumbnail */}
                <div className="relative shrink-0 size-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                      unoptimized={cat.imageUrl.includes("ibb.co") || cat.imageUrl.includes("unsplash.com")}
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center">
                      <ImagePlus className="size-4 text-gray-300" />
                    </div>
                  )}
                </div>

                {editingId === cat.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    {/* Edit image picker */}
                    <button
                      type="button"
                      onClick={() => editFileRef.current?.click()}
                      className="shrink-0 size-8 rounded-lg border border-dashed border-zinc-300 hover:border-zinc-500 overflow-hidden flex items-center justify-center transition-colors"
                      title="Alterar imagem"
                    >
                      {editPreview ? (
                        <Image src={editPreview} alt="edit preview" width={32} height={32} className="object-cover size-full" unoptimized />
                      ) : (
                        <ImagePlus className="size-3.5 text-gray-400" />
                      )}
                    </button>
                    <input
                      ref={editFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleEditImagePick(e.target.files?.[0] ?? null)}
                    />

                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="flex-1 rounded-lg border border-zinc-300 bg-transparent px-2 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-300"
                    />
                  </div>
                ) : (
                  <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">
                    {cat.name}
                  </span>
                )}

                <div className="flex items-center gap-1 shrink-0">
                  {editingId === cat.id ? (
                    <>
                      <button
                        onClick={saveEdit}
                        disabled={savingEdit}
                        className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/20 text-green-600 transition-colors disabled:opacity-50"
                      >
                        <Check className="size-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
