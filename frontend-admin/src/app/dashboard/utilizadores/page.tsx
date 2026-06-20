"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { ApiUser } from "@/lib/api-types";
import { Plus, Trash2, X, Check, KeyRound, ShieldCheck, User } from "lucide-react";

// ── Modais ────────────────────────────────────────────────────────────────────

function CreateModal({
  onSave,
  onClose,
  saving,
}: {
  onSave: (data: { name: string; email: string; password: string; role: "ADMIN" | "ATENDENTE" }) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "ATENDENTE">("ATENDENTE");

  const valid = name.trim() && email.trim() && password.length >= 6;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-gray-900 dark:text-white text-lg">Novo Utilizador</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-3">
          <input
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
          <input
            type="password"
            placeholder="Senha (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />

          <div className="grid grid-cols-2 gap-2">
            {(["ADMIN", "ATENDENTE"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={[
                  "flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-colors",
                  role === r
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
                ].join(" ")}
              >
                {r === "ADMIN" ? <ShieldCheck className="size-4" /> : <User className="size-4" />}
                {r === "ADMIN" ? "Admin" : "Atendente"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave({ name, email, password, role })}
            disabled={saving || !valid}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold text-sm transition-colors"
          >
            {saving ? "A criar…" : <><Check className="size-4" /> Criar</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordModal({
  user,
  onSave,
  onClose,
  saving,
}: {
  user: ApiUser;
  onSave: (password: string) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const match = password === confirm && password.length >= 6;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-gray-900 dark:text-white text-lg">Alterar Senha</h2>
            <p className="text-sm text-gray-400">{user.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="Nova senha (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={[
              "w-full px-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400",
              confirm && !match ? "border-red-300 dark:border-red-700" : "border-gray-200 dark:border-gray-700",
            ].join(" ")}
          />
          {confirm && !match && (
            <p className="text-xs text-red-500">
              {password.length < 6 ? "Mínimo 6 caracteres." : "As senhas não coincidem."}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(password)}
            disabled={saving || !match}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold text-sm transition-colors"
          >
            {saving ? "A guardar…" : <><Check className="size-4" /> Guardar</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function UtilizadoresPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [pwUser, setPwUser] = useState<ApiUser | null>(null);
  const [changingPw, setChangingPw] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setUsers(await adminApi.getUsers());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data: { name: string; email: string; password: string; role: "ADMIN" | "ATENDENTE" }) {
    setCreating(true);
    try {
      const created = await adminApi.createUser(data);
      setUsers((p) => [...p, created]);
      setCreateOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao criar utilizador");
    } finally {
      setCreating(false);
    }
  }

  async function handleChangePassword(password: string) {
    if (!pwUser) return;
    setChangingPw(true);
    try {
      await adminApi.updateUser(pwUser.id, { password });
      setPwUser(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao alterar senha");
    } finally {
      setChangingPw(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Tens a certeza que queres eliminar este utilizador?")) return;
    setDeletingId(id);
    try {
      await adminApi.deleteUser(id);
      setUsers((p) => p.filter((u) => u.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao eliminar");
    } finally {
      setDeletingId(null);
    }
  }

  const ROLE_LABEL: Record<string, string> = { ADMIN: "Admin", ATENDENTE: "Atendente" };
  const ROLE_COLOR: Record<string, string> = {
    ADMIN: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    ATENDENTE: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  };

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Utilizadores</h1>
          <p className="text-sm text-gray-500 mt-1">Gerentas e atendentes com acesso ao painel.</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm transition-colors"
        >
          <Plus className="size-4" /> Novo utilizador
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 flex items-center gap-4">
              <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-gray-100 dark:bg-gray-800 rounded-full w-1/4" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-1/3" />
              </div>
              <div className="w-20 h-6 bg-gray-100 dark:bg-gray-800 rounded-full" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-display font-bold">Sem utilizadores</p>
          <p className="text-sm mt-1">Cria o primeiro clicando no botão acima.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 flex items-center gap-4">
              {/* Avatar inicial */}
              <div className="size-10 rounded-full bg-zinc-100 dark:bg-zinc-800 shrink-0 flex items-center justify-center text-zinc-700 dark:text-zinc-300 font-black text-sm">
                {u.name[0].toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{u.name}</p>
                <p className="text-xs text-gray-400 truncate">{u.email}</p>
              </div>

              {/* Role badge */}
              <span className={["text-xs font-bold px-2.5 py-1 rounded-full", ROLE_COLOR[u.role] ?? "bg-gray-100 text-gray-600"].join(" ")}>
                {ROLE_LABEL[u.role] ?? u.role}
              </span>

              {/* Ações */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setPwUser(u)}
                  title="Alterar senha"
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <KeyRound className="size-4" />
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  disabled={deletingId === u.id}
                  title="Eliminar"
                  className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {createOpen && (
        <CreateModal
          onSave={handleCreate}
          onClose={() => setCreateOpen(false)}
          saving={creating}
        />
      )}

      {pwUser && (
        <PasswordModal
          user={pwUser}
          onSave={handleChangePassword}
          onClose={() => setPwUser(null)}
          saving={changingPw}
        />
      )}
    </div>
  );
}
