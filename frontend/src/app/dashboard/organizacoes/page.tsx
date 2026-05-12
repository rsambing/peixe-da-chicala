"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Button,
  Input,
  Badge,
  Card,
  CardContent,
  Avatar,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui";
import { OrgRole } from "@/lib/types";
import { mockOrganizations, currentUser } from "@/lib/mock";
import {
  FiPlus,
  FiTrash2,
  FiUsers,
  FiGlobe,
  FiCheckCircle,
  FiClock,
  FiUserPlus,
  FiShield,
  FiStar,
} from "react-icons/fi";
import { toast } from "sonner";

const ROLE_LABELS: Record<OrgRole, string> = {
  [OrgRole.OWNER]: "Proprietário",
  [OrgRole.ADMIN]: "Administrador",
  [OrgRole.MEMBER]: "Membro",
};

const ROLE_ICONS: Record<OrgRole, React.ReactNode> = {
  [OrgRole.OWNER]: <FiStar className="size-3" />,
  [OrgRole.ADMIN]: <FiShield className="size-3" />,
  [OrgRole.MEMBER]: <FiUsers className="size-3" />,
};

export default function OrganizationsPage() {
  const userOrgs = mockOrganizations.filter((org) =>
    org.members.some((m) => m.userId === currentUser.id)
  );

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  // Create org form
  const [newName, setNewName] = useState("");
  const [newNif, setNewNif] = useState("");
  const [newWebsite, setNewWebsite] = useState("");

  // Invite member
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OrgRole>(OrgRole.MEMBER);

  // ----- Funções -----

  function handleCreateOrg() {
    if (!newName.trim()) {
      toast.error("Nome da organização é obrigatório.");
      return;
    }
    if (!newNif.trim() || newNif.length < 10) {
      toast.error("NIF inválido. Deve ter pelo menos 10 dígitos.");
      return;
    }
    toast.success(`Organização "${newName}" criada com sucesso!`);
    setShowCreateDialog(false);
    setNewName("");
    setNewNif("");
    setNewWebsite("");
  }

  function handleInviteMember() {
    if (!selectedOrgId) {
      toast.error("Organização inválida.");
      return;
    }
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      toast.error("Email inválido.");
      return;
    }

    const org = mockOrganizations.find((o) => o.id === selectedOrgId);

    toast.success(
      `Convite enviado para ${inviteEmail} na organização "${org?.name}".`
    );

    setShowInviteDialog(false);
    setInviteEmail("");
    setSelectedOrgId(null);
  }

  function getUserRole(orgId: string): OrgRole | null {
    const org = mockOrganizations.find((o) => o.id === orgId);
    const member = org?.members.find((m) => m.userId === currentUser.id);
    return member?.role ?? null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Organizações
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as organizações das quais faz parte.
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button variant="primary" size="sm">
              <FiPlus className="size-4 mr-2" /> Nova Organização
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Organização</DialogTitle>
              <DialogDescription>
                Preencha os dados para registar a sua organização na plataforma.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Input
                label="Nome da Organização"
                placeholder="Ex: Fundação Exemplo Angola"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Input
                label="NIF"
                placeholder="Ex: 5417234891"
                value={newNif}
                onChange={(e) => setNewNif(e.target.value)}
                helperText="Número de Identificação Fiscal da organização"
              />
              <Input
                label="Website (opcional)"
                placeholder="https://exemplo.org"
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button variant="primary" onClick={handleCreateOrg}>
                Criar Organização
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Org list */}
      {userOrgs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FiUsers className="size-12 mx-auto mb-3 text-muted-foreground opacity-40" />
            <h3 className="font-semibold text-foreground mb-1">
              Nenhuma organização
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie uma organização para associar às suas campanhas.
            </p>
            <Button variant="primary" onClick={() => setShowCreateDialog(true)}>
              <FiPlus className="size-4 mr-2" /> Criar Organização
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {userOrgs.map((org) => {
            const myRole = getUserRole(org.id);
            const isOwnerOrAdmin =
              myRole === OrgRole.OWNER || myRole === OrgRole.ADMIN;

            return (
              <Card key={org.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Logo */}
                    <div className="shrink-0">
                      {org.logoUrl ? (
                        <Image
                          src={org.logoUrl}
                          alt={org.name}
                          className="size-16 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                          width={64}
                          height={64}
                        />
                      ) : (
                        <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">
                            {org.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-lg truncate">
                          {org.name}
                        </h3>
                        {org.isVerified && (
                          <FiCheckCircle className="size-4 text-primary shrink-0" />
                        )}
                        <Badge
                          variant={
                            myRole === OrgRole.OWNER
                              ? "accent"
                              : myRole === OrgRole.ADMIN
                              ? "info"
                              : "default"
                          }
                          className="text-[10px] ml-1"
                        >
                          {ROLE_ICONS[myRole!]} {ROLE_LABELS[myRole!]}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                        <span>NIF: {org.nif}</span>
                        {org.website && (
                          <a
                            href={org.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            <FiGlobe className="size-3" />{" "}
                            {org.website.replace(/^https?:\/\//, "")}
                          </a>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <FiClock className="size-3" />{" "}
                          Desde{" "}
                          {new Date(org.createdAt).toLocaleDateString("pt-AO", {
                            year: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>

                      {/* Members */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-foreground">
                            Membros ({org.members.length})
                          </h4>
                          {isOwnerOrAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedOrgId(org.id);
                                setShowInviteDialog(true);
                              }}
                            >
                              <FiUserPlus className="size-4 mr-1" /> Convidar
                            </Button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {org.members.map((member) => (
                            <div
                              key={member.userId}
                              className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Avatar
                                  src={member.user.avatarUrl}
                                  fallback={member.user.fullName}
                                  size="sm"
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {member.user.fullName}
                                    {member.userId === currentUser.id && (
                                      <span className="text-xs text-muted-foreground ml-1">
                                        (você)
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    member.role === OrgRole.OWNER
                                      ? "accent"
                                      : member.role === OrgRole.ADMIN
                                      ? "info"
                                      : "default"
                                  }
                                  className="text-[10px]"
                                >
                                  {ROLE_LABELS[member.role]}
                                </Badge>
                                {isOwnerOrAdmin &&
                                  member.userId !== currentUser.id && (
                                    <button
                                      className="text-muted-foreground hover:text-destructive transition-colors"
                                      onClick={() =>
                                        toast.success(
                                          `${member.user.fullName} removido da organização.`
                                        )
                                      }
                                    >
                                      <FiTrash2 className="size-3.5" />
                                    </button>
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Invite member dialog */}
      <Dialog
        open={showInviteDialog}
        onOpenChange={(open) => {
          setShowInviteDialog(open);
          if (!open) setSelectedOrgId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar Membro</DialogTitle>
            <DialogDescription>
              Envie um convite por email para adicionar um membro à organização.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              label="Email"
              type="email"
              placeholder="membro@exemplo.ao"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Cargo
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as OrgRole)}
                className="w-full h-10 rounded-lg border border-input px-3 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value={OrgRole.MEMBER}>Membro</option>
                <option value={OrgRole.ADMIN}>Administrador</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button variant="primary" onClick={handleInviteMember}>
              <FiUserPlus className="size-4 mr-2" /> Enviar Convite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
