"use client";

import { useState } from "react";
import { Button, Input, Avatar, Badge } from "@/components/ui";
import { currentUser } from "@/lib/mock";
import { Province, PROVINCE_LABELS, KycStatus } from "@/lib/types";
import { FiCamera, FiSave } from "react-icons/fi";
import { toast } from "sonner";

export default function ProfilePage() {
  const [form, setForm] = useState({
    fullName: currentUser.fullName,
    email: currentUser.email,
    phone: currentUser.phoneNumber ?? "",
    bio: currentUser.bio ?? "",
    province: currentUser.province ?? "",
    municipality: currentUser.municipality ?? "",
    address: currentUser.address ?? "",
  });
  const [saving, setSaving] = useState(false);

  function update(field: string, value: string) {
    setForm({ ...form, [field]: value });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Perfil actualizado com sucesso!");
    }, 1200);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
        <p className="text-muted-foreground mt-1">
          Gerir a sua informação pessoal e preferências.
        </p>
      </div>

      {/* Avatar section */}
      <div className="flex items-center gap-6 p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="relative group">
          <Avatar
            src={currentUser.avatarUrl}
            fallback={currentUser.fullName}
            size="xl"
            verified={currentUser.isVerified}
          />
          <button className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <FiCamera className="size-6 text-white" />
          </button>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {currentUser.fullName}
          </h2>
          <p className="text-sm text-muted-foreground">{currentUser.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={currentUser.kycStatus === KycStatus.VERIFIED ? "active" : "pending"}>
              {currentUser.kycStatus === KycStatus.VERIFIED ? "Verificado" : "Não verificado"}
            </Badge>
            <Badge variant="default" className="capitalize">
              {currentUser.role.toLowerCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-5">
          <h3 className="font-semibold text-foreground">Informação Pessoal</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome Completo"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Telefone"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="9XX XXX XXX"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              rows={3}
              placeholder="Conte um pouco sobre si..."
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-5">
          <h3 className="font-semibold text-foreground">Localização</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Província
              </label>
              <select
                value={form.province}
                onChange={(e) => update("province", e.target.value)}
                className="w-full h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Seleccione</option>
                {Object.values(Province).map((p) => (
                  <option key={p} value={p}>
                    {PROVINCE_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Município"
              value={form.municipality}
              onChange={(e) => update("municipality", e.target.value)}
              placeholder="O seu município"
            />
          </div>

          <Input
            label="Endereço"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Rua, número, bairro..."
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" loading={saving}>
            <FiSave className="size-4 mr-2" />
            Guardar Alterações
          </Button>
        </div>
      </form>
    </div>
  );
}
