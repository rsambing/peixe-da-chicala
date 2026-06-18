import {
  type User,
  type Organization,
  UserRole,
  KycStatus,
  Province,
  OrgRole,
} from "@/lib/types";

/* ================================================================
   Mock Users
   ================================================================ */

export const mockUsers: User[] = [
  {
    id: "user-1",
    fullName: "Ana Beatriz Mendes",
    email: "ana.mendes@email.co.ao",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    role: UserRole.USER,
    bio: "Empreendedora social apaixonada por educação em Angola.",
    phoneNumber: "923456789",
    province: Province.LUANDA,
    municipality: "Talatona",
    isVerified: true,
    kycStatus: KycStatus.VERIFIED,
    createdAt: "2025-06-15T10:00:00Z",
  },
  {
    id: "user-2",
    fullName: "Carlos Eduardo Silva",
    email: "carlos.silva@email.co.ao",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    role: UserRole.USER,
    bio: "Médico voluntário no Huambo.",
    phoneNumber: "912345678",
    province: Province.HUAMBO,
    municipality: "Cidade do Huambo",
    isVerified: true,
    kycStatus: KycStatus.VERIFIED,
    createdAt: "2025-08-20T14:30:00Z",
  },
  {
    id: "user-3",
    fullName: "Maria José Fernandes",
    email: "maria.fernandes@email.co.ao",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    role: UserRole.USER,
    bio: "Professora e ativista ambiental.",
    phoneNumber: "934567890",
    province: Province.BENGUELA,
    isVerified: false,
    kycStatus: KycStatus.PENDING,
    createdAt: "2025-11-10T09:00:00Z",
  },
  {
    id: "user-4",
    fullName: "Pedro Nkanga",
    email: "pedro.nkanga@email.co.ao",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    role: UserRole.MODERATOR,
    bio: "Moderador da plataforma Levanta Angola.",
    province: Province.LUANDA,
    isVerified: true,
    kycStatus: KycStatus.VERIFIED,
    createdAt: "2025-05-01T08:00:00Z",
  },
  {
    id: "user-5",
    fullName: "Super Admin",
    email: "admin@levantaangola.ao",
    role: UserRole.ADMIN,
    isVerified: true,
    kycStatus: KycStatus.VERIFIED,
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "user-6",
    fullName: "Teresa Makiesse",
    email: "teresa.makiesse@email.co.ao",
    avatarUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face",
    role: UserRole.USER,
    bio: "Artista plástica de Luanda.",
    province: Province.LUANDA,
    isVerified: true,
    kycStatus: KycStatus.VERIFIED,
    createdAt: "2025-09-05T11:00:00Z",
  },
];

export const currentUser = mockUsers[0];

/* ================================================================
   Mock Organizations
   ================================================================ */

export const mockOrganizations: Organization[] = [
  {
    id: "org-1",
    name: "Fundação Esperança Angola",
    nif: "5417234891",
    logoUrl: "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=200&h=200&fit=crop",
    website: "https://esperanca-angola.org",
    isVerified: true,
    createdAt: "2025-03-20T10:00:00Z",
    members: [
      {
        userId: "user-1",
        user: { id: "user-1", fullName: "Ana Beatriz Mendes", avatarUrl: mockUsers[0].avatarUrl },
        role: OrgRole.OWNER,
      },
      {
        userId: "user-2",
        user: { id: "user-2", fullName: "Carlos Eduardo Silva", avatarUrl: mockUsers[1].avatarUrl },
        role: OrgRole.ADMIN,
      },
    ],
  },
  {
    id: "org-2",
    name: "TechKwanza",
    nif: "5418765432",
    logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
    website: "https://techkwanza.ao",
    isVerified: true,
    createdAt: "2025-07-10T14:00:00Z",
    members: [
      {
        userId: "user-6",
        user: { id: "user-6", fullName: "Teresa Makiesse", avatarUrl: mockUsers[5].avatarUrl },
        role: OrgRole.OWNER,
      },
    ],
  },
];
