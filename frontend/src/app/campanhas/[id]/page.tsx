"use client";

import { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/layout";
import { Footer } from "@/components/layout";
import {
  Button,
  Badge,
  ProgressBar,
  Avatar,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";
import { DonateModal } from "./_components/DonateModal";
import { mockCampaigns, mockUpdates, mockComments } from "@/lib/mock";
import {
  formatCurrency,
  progressPercent,
  daysRemaining,
  timeAgo,
} from "@/lib/mock/helpers";
import {
  CampaignStatus,
  CATEGORY_LABELS,
  PROVINCE_LABELS,
  STATUS_LABELS,
} from "@/lib/types";
import { CategoryIcon } from "@/components/features/campaigns";
import { FiShare2, FiHeart, FiMapPin, FiClock, FiMessageCircle, FiEdit3, FiCheckCircle } from "react-icons/fi";

function findCampaign(id: string) {
  return mockCampaigns.find((c) => c.id === id);
}

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const campaign = findCampaign(id);

  const [showDonate, setShowDonate] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [liked, setLiked] = useState(false);

  if (!campaign) return notFound();

  const progress = progressPercent(campaign.currentAmount, campaign.goalAmount);
  const remaining = daysRemaining(campaign.endDate);
  const isFunded = campaign.status === CampaignStatus.FUNDED;
  const isActive = campaign.status === CampaignStatus.ACTIVE;

  const updates = mockUpdates.filter((u) => u.campaignId === campaign.id);
  const comments = mockComments.filter((c) => c.campaignId === campaign.id);

  const statusVariant: Record<string, "active" | "funded" | "pending" | "expired" | "draft" | "default"> = {
    [CampaignStatus.ACTIVE]: "active",
    [CampaignStatus.FUNDED]: "funded",
    [CampaignStatus.PENDING_REVIEW]: "pending",
    [CampaignStatus.EXPIRED]: "expired",
    [CampaignStatus.DRAFT]: "draft",
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-6xl px-6 mb-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Início
            </Link>
            <span>/</span>
            <Link href="/explorar" className="hover:text-foreground transition-colors">
              Explorar
            </Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-50">
              {campaign.title}
            </span>
          </nav>
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ─── Left column (2/3) ─── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image gallery */}
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {campaign.media.length > 0 ? (
                    <Image
                      src={campaign.media[selectedImage]?.url}
                      alt={campaign.title}
                      width={800}
                      height={450}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      <CategoryIcon category={campaign.category} className="size-16" />
                    </div>
                  )}

                  {/* Status badge */}
                  <Badge
                    variant={statusVariant[campaign.status] ?? "default"}
                    className="absolute top-4 left-4 text-sm"
                  >
                    {STATUS_LABELS[campaign.status]}
                  </Badge>
                </div>

                {/* Thumbnails */}
                {campaign.media.length > 1 && (
                  <div className="flex gap-2">
                    {campaign.media.map((m, i) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedImage(i)}
                        className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                          i === selectedImage
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={m.url}
                          alt=""
                          width={80}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & meta */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground leading-tight">
                    {campaign.title}
                  </h1>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`p-2 rounded-full transition-colors ${
                        liked
                          ? "bg-red-50 text-red-500 dark:bg-red-900/20"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <FiHeart className={`size-5 ${liked ? "fill-current" : ""}`} />
                    </button>
                    <button className="p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <FiShare2 className="size-5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <CategoryIcon category={campaign.category} className="size-3.5" />
                    {CATEGORY_LABELS[campaign.category]}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiMapPin className="size-3.5" />
                    {PROVINCE_LABELS[campaign.province]}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiClock className="size-3.5" />
                    {isFunded ? "Campanha financiada" : `${remaining} dias restantes`}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="about">
                <TabsList className="w-full">
                  <TabsTrigger value="about" className="font-display font-bold">Sobre</TabsTrigger>
                  <TabsTrigger value="updates" className="font-display font-bold">
                    Actualizações ({updates.length})
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="font-display font-bold">
                    Comentários ({comments.length})
                  </TabsTrigger>
                </TabsList>

                {/* About tab */}
                <TabsContent value="about">
                  <div className="prose prose-green dark:prose-invert max-w-none">
                    {campaign.fullDesc.split("\n").map((line, i) => {
                      const trimmed = line.trim();
                      if (!trimmed) return <br key={i} />;
                      if (trimmed.startsWith("## "))
                        return (
                          <h2
                            key={i}
                            className="font-display text-xl font-bold mt-6 mb-3 text-foreground"
                          >
                            {trimmed.replace("## ", "")}
                          </h2>
                        );
                      if (trimmed.startsWith("- **"))
                        return (
                          <li key={i} className="text-muted-foreground ml-4">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: trimmed
                                  .replace("- ", "")
                                  .replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>"),
                              }}
                            />
                          </li>
                        );
                      if (trimmed.startsWith("- "))
                        return (
                          <li key={i} className="text-muted-foreground ml-4">
                            {trimmed.replace("- ", "")}
                          </li>
                        );
                      return (
                        <p key={i} className="text-muted-foreground leading-relaxed mb-2">
                          {trimmed}
                        </p>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* Updates tab */}
                <TabsContent value="updates">
                  {updates.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <FiEdit3 className="size-10 mx-auto mb-3 opacity-40" />
                      <p>Nenhuma actualização publicada ainda.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {updates.map((update) => (
                        <article
                          key={update.id}
                          className="rounded-xl border border-gray-200 dark:border-gray-700 p-5"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar
                              src={update.author.avatarUrl}
                              fallback={update.author.fullName}
                              size="sm"
                            />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {update.author.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {timeAgo(update.createdAt)}
                              </p>
                            </div>
                          </div>
                          <h3 className="font-semibold text-foreground mb-2">
                            {update.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {update.content}
                          </p>
                        </article>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Comments tab */}
                <TabsContent value="comments">
                  {comments.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <FiMessageCircle className="size-10 mx-auto mb-3 opacity-40" />
                      <p>Seja o primeiro a comentar.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                        >
                          <Avatar
                            src={comment.author.avatarUrl}
                            fallback={comment.author.fullName}
                            size="sm"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-foreground">
                                {comment.author.fullName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {timeAgo(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Comment input */}
                      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Avatar fallback="Eu" size="sm" />
                        <div className="flex-1 flex gap-2">
                          <input
                            placeholder="Escreva um comentário..."
                            className="flex-1 h-10 rounded-lg border border-input bg-card px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                          <Button size="sm">Enviar</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* ─── Right sidebar (1/3) ─── */}
            <aside className="space-y-6 sticky top-28 self-start">
              {/* Funding card */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                {/* Amount raised */}
                <div className="mb-4">
                  <p className="text-3xl font-bold text-foreground">
                    {formatCurrency(campaign.currentAmount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    arrecadados de{" "}
                    <span className="font-medium text-foreground">
                      {formatCurrency(campaign.goalAmount)}
                    </span>
                  </p>
                </div>

                {/* Progress bar */}
                <ProgressBar
                  value={progress}
                  variant={isFunded ? "success" : "default"}
                  size="md"
                  showLabel
                />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 my-5 py-4 border-y border-gray-100 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">
                      {campaign.donorCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Doadores</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">
                      {remaining}
                    </p>
                    <p className="text-xs text-muted-foreground">Dias</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">
                      {campaign.updateCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Updates</p>
                  </div>
                </div>

                {/* CTA button */}
                {isActive && (
                  <Button
                    variant="accent"
                    size="xl"
                    className="w-full text-base"
                    onClick={() => setShowDonate(true)}
                  >
                    Apoiar esta Campanha
                  </Button>
                )}

                {isFunded && (
                  <div className="text-center py-3 px-4 bg-success/10 rounded-lg">
                    <p className="text-success font-semibold inline-flex items-center gap-1">
                      <FiCheckCircle className="size-4" /> Campanha Financiada com Sucesso!
                    </p>
                  </div>
                )}

                {/* Share */}
                <Button
                  variant="outline"
                  size="md"
                  className="w-full mt-3"
                >
                  <FiShare2 className="size-4 mr-2" />
                  Partilhar Campanha
                </Button>
              </div>

              {/* Creator card */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Criador
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar
                    src={campaign.creator.avatarUrl}
                    fallback={campaign.creator.fullName}
                    size="md"
                    verified={campaign.creator.isVerified}
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      {campaign.creator.fullName}
                    </p>
                    {campaign.organization && (
                      <p className="text-xs text-muted-foreground">
                        {campaign.organization.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Rewards */}
              {campaign.rewards.length > 0 && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
                  <h3 className="font-semibold text-foreground mb-4">
                    Recompensas
                  </h3>
                  <div className="space-y-3">
                    {campaign.rewards.map((reward) => (
                      <div
                        key={reward.id}
                        className="rounded-lg border border-gray-100 dark:border-gray-700 p-4 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground text-sm">
                            {reward.title}
                          </span>
                          <Badge variant="primary">
                            {formatCurrency(reward.minAmount)}+
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {reward.description}
                        </p>
                        {reward.stockTotal && (
                          <p className="text-xs text-muted-foreground">
                            {reward.stockClaimed}/{reward.stockTotal} reclamadas
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />

      {/* Donate modal */}
      <DonateModal
        campaign={campaign}
        open={showDonate}
        onOpenChange={setShowDonate}
      />
    </>
  );
}
