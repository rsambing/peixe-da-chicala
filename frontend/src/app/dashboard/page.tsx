"use client";

import Link from "next/link";
import { Card, CardContent, Badge, Button } from "@/components/ui";
import { CampaignCard } from "@/components/features/campaigns";
import { currentUser, mockCampaigns, mockDonations, mockWallet } from "@/lib/mock";
import { formatCurrency, timeAgo } from "@/lib/mock/helpers";
import { CampaignStatus, KycStatus, DONATION_STATUS_LABELS } from "@/lib/types";
import {
  FiTrendingUp,
  FiHeart,
  FiCreditCard,
  FiShield,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";

export default function DashboardPage() {
  const myCampaigns = mockCampaigns.filter(
    (c) => c.creator.id === currentUser.id
  );
  const myDonations = mockDonations.filter(
    (d) => d.donorId === currentUser.id
  );
  const totalDonated = myDonations
    .filter((d) => d.status === "COMPLETED")
    .reduce((sum, d) => sum + d.amount, 0);

  const kycPending = currentUser.kycStatus !== KycStatus.VERIFIED;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground">
          Olá, {currentUser.fullName.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Aqui está o resumo da sua actividade na plataforma.
        </p>
      </div>

      {/* KYC Alert */}
      {kycPending && (
        <div className="flex items-center gap-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
          <FiAlertCircle className="size-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Verificação de identidade pendente
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              Complete a verificação KYC para desbloquear todas as funcionalidades.
            </p>
          </div>
          <Link href="/dashboard/kyc">
            <Button variant="accent" size="sm">
              Verificar Agora
            </Button>
          </Link>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-display font-medium text-muted-foreground">Minhas Campanhas</span>
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <FiTrendingUp className="size-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-display font-black text-foreground">{myCampaigns.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {myCampaigns.filter((c) => c.status === CampaignStatus.ACTIVE).length} activa{myCampaigns.filter((c) => c.status === CampaignStatus.ACTIVE).length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Total Doado</span>
              <div className="size-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <FiHeart className="size-4 text-accent" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(totalDonated)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {myDonations.length} doaç{myDonations.length !== 1 ? "ões" : "ão"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Saldo Carteira</span>
              <div className="size-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                <FiCreditCard className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(mockWallet.balance)}
            </p>
            <Link href="/dashboard/carteira" className="text-xs text-primary hover:underline mt-1 inline-block">
              Ver detalhes →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">KYC</span>
              <div className="size-9 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <FiShield className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <Badge variant={currentUser.kycStatus === KycStatus.VERIFIED ? "active" : "pending"}>
              {currentUser.kycStatus === KycStatus.VERIFIED
                ? "Verificado"
                : currentUser.kycStatus === KycStatus.PENDING
                ? "Pendente"
                : "Não Submetido"}
            </Badge>
            <Link href="/dashboard/kyc" className="text-xs text-primary hover:underline mt-2 inline-block">
              {currentUser.kycStatus === KycStatus.VERIFIED ? "Ver estado" : "Completar"} →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* My campaigns */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Minhas Campanhas</h2>
          <Link href="/dashboard/campanhas">
            <Button variant="ghost" size="sm">
              Ver Todas <FiArrowRight className="size-4 ml-1" />
            </Button>
          </Link>
        </div>
        {myCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {myCampaigns.slice(0, 4).map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} compact />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                Ainda não criou nenhuma campanha.
              </p>
              <Link href="/campanhas/criar">
                <Button variant="primary">Criar Primeira Campanha</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Recent donations */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Doações Recentes</h2>
        </div>
        {myDonations.length > 0 ? (
          <Card>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {myDonations.slice(0, 5).map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                    <FiHeart className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {donation.campaign.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo(donation.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(donation.amount)}
                    </p>
                    <Badge
                      variant={
                        donation.status === "COMPLETED"
                          ? "active"
                          : donation.status === "PENDING"
                          ? "pending"
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
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nenhuma doação efectuada.</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
