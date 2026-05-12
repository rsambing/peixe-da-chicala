/* ================================================================
   Enums — Mirrored from Prisma Schema
   ================================================================ */

export enum UserRole {
  USER = "USER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
}

export enum OrgRole {
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
  OWNER = "OWNER",
}

export enum CampaignStatus {
  DRAFT = "DRAFT",
  PENDING_REVIEW = "PENDING_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  SUSPENDED = "SUSPENDED",
  FUNDED = "FUNDED",
  EXPIRED = "EXPIRED",
  ARCHIVED = "ARCHIVED",
}

export enum Category {
  EDUCATION = "EDUCATION",
  HEALTH = "HEALTH",
  TECHNOLOGY = "TECHNOLOGY",
  ARTS = "ARTS",
  COMMUNITY = "COMMUNITY",
  BUSINESS = "BUSINESS",
  EMERGENCY = "EMERGENCY",
  ENVIRONMENT = "ENVIRONMENT",
}

export enum Province {
  BENGO = "BENGO",
  BENGUELA = "BENGUELA",
  BIE = "BIE",
  CABINDA = "CABINDA",
  CUANDO_CUBANGO = "CUANDO_CUBANGO",
  CUANZA_NORTE = "CUANZA_NORTE",
  CUANZA_SUL = "CUANZA_SUL",
  CUNENE = "CUNENE",
  HUAMBO = "HUAMBO",
  HUILA = "HUILA",
  LUANDA = "LUANDA",
  LUNDA_NORTE = "LUNDA_NORTE",
  LUNDA_SUL = "LUNDA_SUL",
  MALANJE = "MALANJE",
  MOXICO = "MOXICO",
  NAMIBE = "NAMIBE",
  UIGE = "UIGE",
  ZAIRE = "ZAIRE",
}

export enum PaymentProvider {
  MULTICAIXA_EXPRESS = "MULTICAIXA_EXPRESS",
  BANK_TRANSFER = "BANK_TRANSFER",
  UNITEL_MONEY = "UNITEL_MONEY",
  AFRIMONEY = "AFRIMONEY",
  MANUAL_PROOF = "MANUAL_PROOF",
}

export enum DonationStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  WAITING_PROOF = "WAITING_PROOF",
  REFUNDED = "REFUNDED",
}

export enum KycStatus {
  NOT_SUBMITTED = "NOT_SUBMITTED",
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  DOCUMENT = "DOCUMENT",
}

export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  DONATION = "DONATION",
  WITHDRAWAL = "WITHDRAWAL",
  PLATFORM_FEE = "PLATFORM_FEE",
  REFUND = "REFUND",
}

/* ================================================================
   Models
   ================================================================ */

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  bio?: string;
  phoneNumber?: string;
  province?: Province;
  municipality?: string;
  address?: string;
  isVerified: boolean;
  kycStatus: KycStatus;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  nif: string;
  logoUrl?: string;
  website?: string;
  isVerified: boolean;
  createdAt: string;
  members: OrganizationMember[];
}

export interface OrganizationMember {
  userId: string;
  user: Pick<User, "id" | "fullName" | "avatarUrl">;
  role: OrgRole;
}

export interface Campaign {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: Category;
  province: Province;
  status: CampaignStatus;
  goalAmount: number;
  currentAmount: number;
  startDate?: string;
  endDate: string;
  createdAt: string;
  creator: Pick<User, "id" | "fullName" | "avatarUrl" | "isVerified">;
  organization?: Pick<Organization, "id" | "name" | "logoUrl">;
  media: CampaignMedia[];
  rewards: Reward[];
  donorCount: number;
  updateCount: number;
  commentCount: number;
}

export interface CampaignMedia {
  id: string;
  url: string;
  type: MediaType;
  isFeatured: boolean;
  order: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  minAmount: number;
  stockTotal?: number;
  stockClaimed: number;
}

export interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  createdAt: string;
  author: Pick<User, "id" | "fullName" | "avatarUrl">;
}

export interface Comment {
  id: string;
  campaignId: string;
  content: string;
  createdAt: string;
  author: Pick<User, "id" | "fullName" | "avatarUrl">;
}

export interface Donation {
  id: string;
  campaignId: string;
  campaign: Pick<Campaign, "id" | "title">;
  donorId?: string;
  donor?: Pick<User, "id" | "fullName" | "avatarUrl">;
  amount: number;
  status: DonationStatus;
  paymentProvider: PaymentProvider;
  isAnonymous: boolean;
  createdAt: string;
  message?: string;
}

export interface Wallet {
  id: string;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  createdAt: string;
  reference?: string;
}

export interface LedgerEntry {
  id: string;
  transactionId: string;
  amount: number;
  type: "DEBIT" | "CREDIT";
  walletId: string;
  hashChain: string;
  isValid: boolean;
  createdAt: string;
}

/* ================================================================
   API Response Types
   ================================================================ */

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
  code: string;
}

/* ================================================================
   Stats
   ================================================================ */

export interface PlatformStats {
  totalRaised: number;
  campaignsFunded: number;
  uniqueDonors: number;
  activeCampaigns: number;
}

export interface AdminStats extends PlatformStats {
  platformFees: number;
  pendingKyc: number;
  pendingCampaigns: number;
  pendingProofs: number;
}

/* ================================================================
   UI Helpers
   ================================================================ */

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.EDUCATION]: "Educação",
  [Category.HEALTH]: "Saúde",
  [Category.TECHNOLOGY]: "Tecnologia",
  [Category.ARTS]: "Artes & Cultura",
  [Category.COMMUNITY]: "Comunidade",
  [Category.BUSINESS]: "Negócios",
  [Category.EMERGENCY]: "Emergência",
  [Category.ENVIRONMENT]: "Meio Ambiente",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  [Category.EDUCATION]: "education",
  [Category.HEALTH]: "health",
  [Category.TECHNOLOGY]: "technology",
  [Category.ARTS]: "arts",
  [Category.COMMUNITY]: "community",
  [Category.BUSINESS]: "business",
  [Category.EMERGENCY]: "emergency",
  [Category.ENVIRONMENT]: "environment",
};

export const PROVINCE_LABELS: Record<Province, string> = {
  [Province.BENGO]: "Bengo",
  [Province.BENGUELA]: "Benguela",
  [Province.BIE]: "Bié",
  [Province.CABINDA]: "Cabinda",
  [Province.CUANDO_CUBANGO]: "Cuando Cubango",
  [Province.CUANZA_NORTE]: "Cuanza Norte",
  [Province.CUANZA_SUL]: "Cuanza Sul",
  [Province.CUNENE]: "Cunene",
  [Province.HUAMBO]: "Huambo",
  [Province.HUILA]: "Huíla",
  [Province.LUANDA]: "Luanda",
  [Province.LUNDA_NORTE]: "Lunda Norte",
  [Province.LUNDA_SUL]: "Lunda Sul",
  [Province.MALANJE]: "Malanje",
  [Province.MOXICO]: "Moxico",
  [Province.NAMIBE]: "Namibe",
  [Province.UIGE]: "Uíge",
  [Province.ZAIRE]: "Zaire",
};

export const STATUS_LABELS: Record<CampaignStatus, string> = {
  [CampaignStatus.DRAFT]: "Rascunho",
  [CampaignStatus.PENDING_REVIEW]: "Em Análise",
  [CampaignStatus.APPROVED]: "Aprovada",
  [CampaignStatus.REJECTED]: "Rejeitada",
  [CampaignStatus.ACTIVE]: "Activa",
  [CampaignStatus.PAUSED]: "Pausada",
  [CampaignStatus.SUSPENDED]: "Suspensa",
  [CampaignStatus.FUNDED]: "Financiada",
  [CampaignStatus.EXPIRED]: "Expirada",
  [CampaignStatus.ARCHIVED]: "Arquivada",
};

export const DONATION_STATUS_LABELS: Record<DonationStatus, string> = {
  [DonationStatus.PENDING]: "Pendente",
  [DonationStatus.PROCESSING]: "A processar",
  [DonationStatus.COMPLETED]: "Concluída",
  [DonationStatus.FAILED]: "Falhada",
  [DonationStatus.CANCELLED]: "Cancelada",
  [DonationStatus.WAITING_PROOF]: "Aguarda comprovativo",
  [DonationStatus.REFUNDED]: "Reembolsada",
};

export const PAYMENT_LABELS: Record<PaymentProvider, string> = {
  [PaymentProvider.MULTICAIXA_EXPRESS]: "Multicaixa Express",
  [PaymentProvider.BANK_TRANSFER]: "Transferência Bancária",
  [PaymentProvider.UNITEL_MONEY]: "Unitel Money",
  [PaymentProvider.AFRIMONEY]: "Afrimoney",
  [PaymentProvider.MANUAL_PROOF]: "Comprovativo Manual",
};
