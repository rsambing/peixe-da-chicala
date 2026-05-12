"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button, Input, Badge, Card, CardContent, ProgressBar, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import {
  CampaignStatus,
  STATUS_LABELS,
  CATEGORY_LABELS,
  PROVINCE_LABELS,
  DONATION_STATUS_LABELS,
  PAYMENT_LABELS,
} from "@/lib/types";
import { CategoryIcon } from "@/components/features/campaigns";
import {
  mockCampaigns,
  mockUpdates,
  mockComments,
  mockDonations,
  formatCurrency,
  progressPercent,
  daysRemaining,
  timeAgo,
} from "@/lib/mock";
import {
  FiArrowLeft,
  FiExternalLink,
  FiSend,
  FiPause,
  FiPlay,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiMessageCircle,
  FiFileText,
  FiPlus,
} from "react-icons/fi";
import { toast } from "sonner";

export default function ManageCampaignPage() {
  const params = useParams();
  const id = params.id as string;

  const campaign = mockCampaigns.find((c) => c.id === id);
  const updates = mockUpdates.filter((u) => u.campaignId === id);
  const comments = mockComments.filter((c) => c.campaignId === id);
  const donations = mockDonations.filter((d) => d.campaignId === id);

  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-4">
            Campanha não encontrada.
          </p>
          <Link href="/dashboard/campanhas">
            <Button variant="outline">
              <FiArrowLeft className="size-4 mr-2" /> Voltar
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <CampaignPanel campaign={campaign} updates={updates} comments={comments} donations={donations} />;
}

function CampaignPanel({
  campaign,
  updates,
  comments,
  donations,
}: {
  campaign: NonNullable<ReturnType<typeof mockCampaigns.find>>;
  updates: typeof mockUpdates;
  comments: typeof mockComments;
  donations: typeof mockDonations;
}) {
  const [newUpdateTitle, setNewUpdateTitle] = useState("");
  const [newUpdateContent, setNewUpdateContent] = useState("");
  const [publishingUpdate, setPublishingUpdate] = useState(false);
  const [showNewUpdate, setShowNewUpdate] = useState(false);

  const progress = progressPercent(campaign.currentAmount, campaign.goalAmount);
  const remaining = daysRemaining(campaign.endDate);
  // const totalDonated = donations.reduce((s, d) => s + d.amount, 0);

  const statusBadgeVariant = {
    [CampaignStatus.ACTIVE]: "active" as const,
    [CampaignStatus.FUNDED]: "funded" as const,
    [CampaignStatus.PAUSED]: "paused" as const,
    [CampaignStatus.DRAFT]: "draft" as const,
    [CampaignStatus.PENDING_REVIEW]: "pending" as const,
    [CampaignStatus.APPROVED]: "success" as const,
    [CampaignStatus.REJECTED]: "rejected" as const,
    [CampaignStatus.SUSPENDED]: "suspended" as const,
    [CampaignStatus.EXPIRED]: "expired" as const,
    [CampaignStatus.ARCHIVED]: "default" as const,
  };

  function handlePublishUpdate() {
    if (!newUpdateTitle.trim() || !newUpdateContent.trim()) {
      toast.error("Preencha o título e o conteúdo da actualização.");
      return;
    }
    setPublishingUpdate(true);
    setTimeout(() => {
      setPublishingUpdate(false);
      setShowNewUpdate(false);
      setNewUpdateTitle("");
      setNewUpdateContent("");
      toast.success("Actualização publicada com sucesso!");
    }, 1500);
  }

  function handleTogglePause() {
    const action =
      campaign.status === CampaignStatus.PAUSED ? "retomada" : "pausada";
    toast.success(`Campanha ${action} com sucesso!`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/campanhas"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <FiArrowLeft className="size-4" /> Voltar às campanhas
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {campaign.title}
              </h1>
              <Badge variant={statusBadgeVariant[campaign.status]}>
                {STATUS_LABELS[campaign.status]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground inline-flex items-center gap-1">
              <CategoryIcon category={campaign.category} className="size-3.5" />
              {CATEGORY_LABELS[campaign.category]} ·{" "}
              {PROVINCE_LABELS[campaign.province]}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/campanhas/${campaign.id}`} target="_blank">
              <Button variant="outline" size="sm">
                <FiExternalLink className="size-4 mr-1" /> Ver Pública
              </Button>
            </Link>
            <Button
              variant={campaign.status === CampaignStatus.PAUSED ? "primary" : "ghost"}
              size="sm"
              onClick={handleTogglePause}
            >
              {campaign.status === CampaignStatus.PAUSED ? (
                <>
                  <FiPlay className="size-4 mr-1" /> Retomar
                </>
              ) : (
                <>
                  <FiPause className="size-4 mr-1" /> Pausar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Arrecadado",
            value: formatCurrency(campaign.currentAmount),
            icon: FiDollarSign,
            color: "text-emerald-600",
          },
          {
            label: "Doadores",
            value: campaign.donorCount || donations.length,
            icon: FiUsers,
            color: "text-blue-600",
          },
          {
            label: "Progresso",
            value: `${progress}%`,
            icon: FiTrendingUp,
            color: "text-amber-600",
          },
          {
            label: "Dias Restantes",
            value: remaining > 0 ? remaining : "Terminada",
            icon: FiCalendar,
            color: "text-purple-600",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`size-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {formatCurrency(campaign.currentAmount)} de{" "}
              {formatCurrency(campaign.goalAmount)}
            </span>
            <span className="font-semibold text-primary">{progress}%</span>
          </div>
          <ProgressBar value={progress} variant="success" size="md" />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="donations">
        <TabsList>
          <TabsTrigger value="donations">
            <FiDollarSign className="size-4 mr-1" />
            Doações ({donations.length})
          </TabsTrigger>
          <TabsTrigger value="updates">
            <FiFileText className="size-4 mr-1" />
            Actualizações ({updates.length})
          </TabsTrigger>
          <TabsTrigger value="comments">
            <FiMessageCircle className="size-4 mr-1" />
            Comentários ({comments.length})
          </TabsTrigger>
        </TabsList>

        {/* ── Donations tab ── */}
        <TabsContent value="donations">
          <Card>
            <CardContent className="p-0">
              {donations.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <FiDollarSign className="size-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Nenhuma doação recebida ainda.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {donations.map((donation) => (
                    <div
                      key={donation.id}
                      className="p-4 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {donation.isAnonymous ? (
                            <span className="text-xs font-bold text-primary">A</span>
                          ) : donation.donor?.avatarUrl ? (
                            <Image
                              src={donation.donor.avatarUrl}
                              alt=""
                              className="size-10 rounded-full object-cover"
                              width={40}
                              height={40}
                            />
                          ) : (
                            <span className="text-xs font-bold text-primary">
                              {donation.donor?.fullName?.charAt(0) || "?"}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {donation.isAnonymous
                              ? "Doador Anónimo"
                              : donation.donor?.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {timeAgo(donation.createdAt)} ·{" "}
                            {PAYMENT_LABELS[donation.paymentProvider]}
                          </p>
                          {donation.message && (
                            <p className="text-xs text-muted-foreground mt-0.5 italic truncate">
                              &ldquo;{donation.message}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-primary">
                          {formatCurrency(donation.amount)}
                        </p>
                        <Badge
                          variant={
                            donation.status === "COMPLETED"
                              ? "success"
                              : donation.status === "PENDING"
                              ? "warning"
                              : "default"
                          }
                          className="text-[10px]"
                        >
                          {DONATION_STATUS_LABELS[donation.status]}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Updates tab ── */}
        <TabsContent value="updates">
          <div className="space-y-4">
            {/* New update CTA */}
            {!showNewUpdate && (
              <Button
                variant="outline"
                onClick={() => setShowNewUpdate(true)}
                className="w-full"
              >
                <FiPlus className="size-4 mr-2" /> Publicar Nova Actualização
              </Button>
            )}

            {/* New update form */}
            {showNewUpdate && (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-foreground text-sm">
                    Nova Actualização
                  </h3>
                  <Input
                    label="Título"
                    placeholder="Ex: Progresso da obra — semana 3"
                    value={newUpdateTitle}
                    onChange={(e) => setNewUpdateTitle(e.target.value)}
                  />
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Conteúdo
                    </label>
                    <textarea
                      placeholder="Partilhe novidades sobre o progresso do projecto..."
                      value={newUpdateContent}
                      onChange={(e) => setNewUpdateContent(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-input px-3 py-2 text-sm bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewUpdate(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      loading={publishingUpdate}
                      onClick={handlePublishUpdate}
                    >
                      <FiSend className="size-4 mr-1" /> Publicar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Existing updates */}
            {updates.length === 0 && !showNewUpdate ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <FiFileText className="size-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Nenhuma actualização publicada.</p>
                  <p className="text-xs mt-1">
                    Mantenha os seus apoiantes informados sobre o progresso.
                  </p>
                </CardContent>
              </Card>
            ) : (
              updates.map((update) => (
                <Card key={update.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground text-sm">
                        {update.title}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {timeAgo(update.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {update.content}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* ── Comments tab ── */}
        <TabsContent value="comments">
          <Card>
            <CardContent className="p-0">
              {comments.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <FiMessageCircle className="size-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Nenhum comentário ainda.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="size-7 rounded-full bg-primary/10 overflow-hidden shrink-0">
                          {comment.author.avatarUrl ? (
                            <Image
                              src={comment.author.avatarUrl}
                              alt=""
                              className="size-7 rounded-full object-cover"
                              width={28}
                              height={28}
                            />
                          ) : (
                            <div className="size-7 flex items-center justify-center text-xs font-bold text-primary">
                              {comment.author.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {comment.author.fullName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          · {timeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-9">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
