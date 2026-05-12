import {
  type Donation,
  type Wallet,
  type Transaction,
  type PlatformStats,
  type AdminStats,
  DonationStatus,
  PaymentProvider,
  TransactionType,
} from "@/lib/types";
import { mockUsers } from "./users";

/* ================================================================
   Mock Donations
   ================================================================ */

export const mockDonations: Donation[] = [
  {
    id: "don-1",
    campaignId: "camp-1",
    campaign: { id: "camp-1", title: "Construção da Escola Primária em Viana" },
    donorId: "user-6",
    donor: { id: "user-6", fullName: "Teresa Makiesse", avatarUrl: mockUsers[5].avatarUrl },
    amount: 50_000,
    status: DonationStatus.COMPLETED,
    paymentProvider: PaymentProvider.MULTICAIXA_EXPRESS,
    isAnonymous: false,
    createdAt: "2026-02-01T14:30:00Z",
    message: "Força com o projecto!",
  },
  {
    id: "don-2",
    campaignId: "camp-1",
    campaign: { id: "camp-1", title: "Construção da Escola Primária em Viana" },
    donorId: "user-2",
    donor: { id: "user-2", fullName: "Carlos Eduardo Silva", avatarUrl: mockUsers[1].avatarUrl },
    amount: 100_000,
    status: DonationStatus.COMPLETED,
    paymentProvider: PaymentProvider.BANK_TRANSFER,
    isAnonymous: false,
    createdAt: "2026-01-28T09:00:00Z",
  },
  {
    id: "don-3",
    campaignId: "camp-2",
    campaign: { id: "camp-2", title: "Equipamento para o Hospital do Huambo" },
    amount: 25_000,
    status: DonationStatus.COMPLETED,
    paymentProvider: PaymentProvider.UNITEL_MONEY,
    isAnonymous: true,
    createdAt: "2026-02-03T16:00:00Z",
  },
  {
    id: "don-4",
    campaignId: "camp-3",
    campaign: { id: "camp-3", title: "Lab de Programação para Jovens em Benguela" },
    donorId: "user-1",
    donor: { id: "user-1", fullName: "Ana Beatriz Mendes", avatarUrl: mockUsers[0].avatarUrl },
    amount: 200_000,
    status: DonationStatus.COMPLETED,
    paymentProvider: PaymentProvider.MULTICAIXA_EXPRESS,
    isAnonymous: false,
    createdAt: "2026-02-05T11:00:00Z",
    message: "A tecnologia vai transformar Angola!",
  },
  {
    id: "don-5",
    campaignId: "camp-6",
    campaign: { id: "camp-6", title: "Ajuda de Emergência — Cheias em Cabinda" },
    donorId: "user-6",
    donor: { id: "user-6", fullName: "Teresa Makiesse", avatarUrl: mockUsers[5].avatarUrl },
    amount: 75_000,
    status: DonationStatus.WAITING_PROOF,
    paymentProvider: PaymentProvider.MANUAL_PROOF,
    isAnonymous: false,
    createdAt: "2026-02-08T10:00:00Z",
  },
  {
    id: "don-6",
    campaignId: "camp-4",
    campaign: { id: "camp-4", title: "Poço de Água Potável no Bié" },
    amount: 15_000,
    status: DonationStatus.PENDING,
    paymentProvider: PaymentProvider.MULTICAIXA_EXPRESS,
    isAnonymous: true,
    createdAt: "2026-02-10T08:00:00Z",
  },
];

/* ================================================================
   Mock Wallet & Transactions (for current user)
   ================================================================ */

export const mockWallet: Wallet = {
  id: "wallet-user-1",
  balance: 350_000,
  currency: "AOA",
};

export const mockTransactions: Transaction[] = [
  {
    id: "txn-1",
    type: TransactionType.DEPOSIT,
    amount: 500_000,
    description: "Carregamento via Multicaixa Express",
    createdAt: "2026-01-15T10:00:00Z",
    reference: "MCX-20260115-001",
  },
  {
    id: "txn-2",
    type: TransactionType.DONATION,
    amount: -200_000,
    description: "Doação — Lab de Programação para Jovens em Benguela",
    createdAt: "2026-02-05T11:00:00Z",
    reference: "DON-20260205-004",
  },
  {
    id: "txn-3",
    type: TransactionType.DONATION,
    amount: -50_000,
    description: "Doação — Construção da Escola Primária em Viana",
    createdAt: "2026-02-01T14:30:00Z",
    reference: "DON-20260201-001",
  },
  {
    id: "txn-4",
    type: TransactionType.DEPOSIT,
    amount: 100_000,
    description: "Carregamento via Transferência Bancária",
    createdAt: "2026-02-07T09:00:00Z",
    reference: "TRF-20260207-001",
  },
];

/* ================================================================
   Platform Stats
   ================================================================ */

export const mockPlatformStats: PlatformStats = {
  totalRaised: 42_250_000,
  campaignsFunded: 12,
  uniqueDonors: 1_847,
  activeCampaigns: 6,
};

export const mockAdminStats: AdminStats = {
  ...mockPlatformStats,
  platformFees: 845_000,
  pendingKyc: 3,
  pendingCampaigns: 2,
  pendingProofs: 4,
};
