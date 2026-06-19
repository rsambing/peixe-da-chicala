"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { adminApi } from "@/lib/api";
import type { ApiProduct, ApiCategory, ApiProductImage } from "@/lib/api-types";
import { Plus, Pencil, Trash2, X, ImagePlus } from "lucide-react";
import { Pagination } from "@/components/Pagination";

function fmt(n: number) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(n);
}

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=400&q=60";

const inputClass =
  "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-300";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      {children}
    </div>
  );
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  available: boolean;
  featured: boolean;
}

const emptyForm = (): ProductForm => ({
  name: "",
  description: "",
  price: "",
  categoryId: "",
  available: true,
  featured: false,
});

// Pending files selected but not yet uploaded
interface PendingFile {
  file: File;
  previewUrl: string;
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ApiProduct | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Images
  const [existingImages, setExistingImages] = useState<ApiProductImage[]>([]);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [p, c] = await Promise.all([adminApi.getProducts(), adminApi.getCategories()]);
      setProducts(p);
      setCategories(c);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setFormError(null);
    setExistingImages([]);
    setPendingFiles([]);
    setShowModal(true);
  }

  function openEdit(p: ApiProduct) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      categoryId: String(p.categoryId),
      available: p.available,
      featured: p.featured ?? false,
    });
    setFormError(null);
    setExistingImages(p.images ?? []);
    setPendingFiles([]);
    setShowModal(true);
  }

  function closeModal() {
    pendingFiles.forEach((pf) => URL.revokeObjectURL(pf.previewUrl));
    setShowModal(false);
    setEditing(null);
    setPendingFiles([]);
  }

  function addFiles(files: FileList | null) {
    if (!files) return;
    const newPending: PendingFile[] = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPendingFiles((prev) => [...prev, ...newPending]);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removePending(idx: number) {
    setPendingFiles((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  }

  async function deleteExistingImage(img: ApiProductImage) {
    if (!editing) return;
    if (!confirm("Remover esta imagem do produto?")) return;
    setDeletingImageId(img.id);
    try {
      await adminApi.deleteProductImage(editing.id, img.id);
      setExistingImages((prev) => prev.filter((i) => i.id !== img.id));
      // Reflect in product list
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? { ...p, images: p.images.filter((i) => i.id !== img.id) }
            : p
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao remover imagem");
    } finally {
      setDeletingImageId(null);
    }
  }

  async function saveProduct() {
    if (!form.name.trim() || !form.description.trim() || !form.price || !form.categoryId) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }

    setSaving(true);
    setFormError(null);

    const data = new FormData();
    data.append("name", form.name.trim());
    data.append("description", form.description.trim());
    data.append("price", form.price);
    data.append("categoryId", form.categoryId);
    data.append("available", String(form.available));
    data.append("featured", String(form.featured));
    pendingFiles.forEach((pf) => data.append("images", pf.file));

    try {
      if (editing) {
        const updated = await adminApi.updateProduct(editing.id, data);
        setProducts((prev) => prev.map((p) => (p.id === editing.id ? updated : p)));
      } else {
        const created = await adminApi.createProduct(data);
        setProducts((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erro ao guardar");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: number) {
    if (!confirm("Eliminar este produto?")) return;
    try {
      await adminApi.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao eliminar");
    }
  }

  const primaryImage = (p: ApiProduct) =>
    p.images?.[0]?.imageUrl ?? p.imageUrl ?? PLACEHOLDER;

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Produtos</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} produto(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm transition-colors"
        >
          <Plus className="size-4" />
          Novo Produto
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800" />
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-1/3" />
                  </div>
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 shrink-0" />
                </div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-full" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-4/5" />
                </div>
                <div className="flex gap-2 pt-1">
                  <div className="flex-1 h-7 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                  <div className="w-9 h-7 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">Nenhum produto cadastrado.</p>
          <button onClick={openCreate} className="mt-3 text-zinc-600 text-sm font-medium hover:text-zinc-900 hover:underline">
            Criar o primeiro produto
          </button>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
                <Image
                  src={primaryImage(p)}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized={primaryImage(p).includes("ibb.co")}
                />
                {(p.images?.length ?? 0) > 1 && (
                  <span className="absolute top-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    +{(p.images?.length ?? 1) - 1}
                  </span>
                )}
                {!p.available && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Indisponível
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category?.name}</p>
                  </div>
                  <p className="font-black text-zinc-900 dark:text-white shrink-0">{fmt(p.price)}</p>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => openEdit(p)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Pencil className="size-3" />
                    Editar
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="flex items-center justify-center px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-medium transition-colors"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination page={page} total={products.length} pageSize={PAGE_SIZE} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 md:px-4">
          <div className="w-full md:max-w-lg bg-white dark:bg-gray-900 md:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/60 dark:border-white/5">
              <h2 className="font-bold text-gray-900 dark:text-white">
                {editing ? "Editar Produto" : "Novo Produto"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <Field label="Nome *">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                  placeholder="Ex.: Tilápia Grelhada"
                />
              </Field>

              <Field label="Descrição *">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className={inputClass}
                  placeholder="Descrição do prato..."
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Preço (Kz) *">
                  <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className={inputClass}
                    placeholder="6500"
                  />
                </Field>

                <Field label="Categoria *">
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* ── Image gallery ── */}
              <Field label="Fotos do produto">
                {/* Existing images */}
                {existingImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {existingImages.map((img) => (
                      <div key={img.id} className="relative size-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 group">
                        <Image
                          src={img.imageUrl}
                          alt="foto"
                          fill
                          className="object-cover"
                          sizes="80px"
                          unoptimized={img.imageUrl.includes("ibb.co")}
                        />
                        <button
                          type="button"
                          onClick={() => deleteExistingImage(img)}
                          disabled={deletingImageId === img.id}
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        >
                          {deletingImageId === img.id ? (
                            <span className="text-white text-xs">...</span>
                          ) : (
                            <X className="size-5 text-white" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pending new files */}
                {pendingFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {pendingFiles.map((pf, i) => (
                      <div key={i} className="relative size-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 group">
                        <Image
                          src={pf.previewUrl}
                          alt="nova foto"
                          fill
                          className="object-cover"
                          sizes="80px"
                          unoptimized
                        />
                        <div className="absolute inset-x-0 bottom-0 h-5 bg-zinc-900/80 flex items-center justify-center">
                          <span className="text-white text-[9px] font-bold uppercase tracking-wide">Nova</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePending(i)}
                          className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5"
                        >
                          <X className="size-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add button */}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-zinc-500 text-sm text-gray-500 dark:text-gray-400 transition-colors"
                >
                  <ImagePlus className="size-4" />
                  Adicionar fotos
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </Field>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="available"
                    checked={form.available}
                    onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
                    className="size-4 rounded accent-zinc-900"
                  />
                  <label htmlFor="available" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Disponível no cardápio
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                    className="size-4 rounded accent-zinc-900"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Produto em destaque <span className="text-xs text-gray-400">(aparece na página inicial)</span>
                  </label>
                </div>
              </div>

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{formError}</p>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100/60 dark:border-white/5 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveProduct}
                disabled={saving}
                className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-60 text-white font-bold text-sm transition-colors"
              >
                {saving ? "A guardar…" : editing ? "Guardar" : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
