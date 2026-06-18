import {
  type Campaign,
  type CampaignUpdate,
  type Comment,
  CampaignStatus,
  Category,
  Province,
  MediaType,
} from "@/lib/types";
import { mockUsers } from "./users";

/* ================================================================
   Mock Campaigns  — realistic Angolan context
   ================================================================ */

export const mockCampaigns: Campaign[] = [
  {
    id: "camp-1",
    title: "Construção da Escola Primária em Viana",
    shortDesc:
      "Ajude a construir uma escola para 300 crianças na comunidade de Viana, Luanda.",
    fullDesc: `
## O Problema

Na comunidade de Viana, mais de 300 crianças não têm acesso a uma escola adequada. As aulas acontecem debaixo de árvores ou em estruturas improvisadas que não resistem à época das chuvas.

## A Nossa Solução

Queremos construir uma escola com 6 salas de aula, casa de banho, um espaço de recreio e uma biblioteca comunitária. O projecto já tem o terreno cedido pela administração local e o projecto arquitetónico aprovado.

## Como os Fundos Serão Utilizados

- **60%** — Materiais de construção
- **25%** — Mão de obra qualificada
- **10%** — Equipamento escolar (carteiras, quadros)
- **5%** — Custos administrativos

## Impacto Esperado

- 300 crianças com acesso a educação de qualidade
- 15 postos de trabalho criados durante a construção
- 8 professores empregados permanentemente
    `,
    category: Category.EDUCATION,
    province: Province.LUANDA,
    status: CampaignStatus.ACTIVE,
    goalAmount: 15_000_000,
    currentAmount: 11_250_000,
    startDate: "2025-12-01T00:00:00Z",
    endDate: "2026-04-30T23:59:59Z",
    createdAt: "2025-11-20T10:00:00Z",
    creator: {
      id: "user-1",
      fullName: "Ana Beatriz Mendes",
      avatarUrl: mockUsers[0].avatarUrl,
      isVerified: true,
    },
    organization: {
      id: "org-1",
      name: "Fundação Esperança Angola",
      logoUrl: "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=200&h=200&fit=crop",
    },
    media: [
      {
        id: "media-1",
        url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=800&fit=crop",
        type: MediaType.IMAGE,
        isFeatured: true,
        order: 0,
      },
      {
        id: "media-2",
        url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop",
        type: MediaType.IMAGE,
        isFeatured: false,
        order: 1,
      },
      {
        id: "media-3",
        url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&h=800&fit=crop",
        type: MediaType.IMAGE,
        isFeatured: false,
        order: 2,
      },
    ],
    rewards: [
      {
        id: "reward-1",
        title: "Certificado de Apoiante",
        description: "Receba um certificado digital personalizado de agradecimento.",
        minAmount: 5_000,
        stockClaimed: 45,
      },
      {
        id: "reward-2",
        title: "Nome no Mural da Escola",
        description: "O seu nome será eternizado no mural de apoiantes da escola.",
        minAmount: 25_000,
        stockTotal: 100,
        stockClaimed: 38,
      },
      {
        id: "reward-3",
        title: "Padrinho de uma Sala",
        description: "Torne-se padrinho de uma sala de aula com placa personalizada.",
        minAmount: 500_000,
        stockTotal: 6,
        stockClaimed: 4,
      },
    ],
    donorCount: 284,
    updateCount: 5,
    commentCount: 47,
  },
  {
    id: "camp-2",
    title: "Equipamento para o Hospital do Huambo",
    shortDesc:
      "O Hospital Central do Huambo precisa de equipamento médico urgente para a maternidade.",
    fullDesc: `
## Situação Actual

A maternidade do Hospital Central do Huambo atende mais de 200 partos por mês com equipamento desactualizado e insuficiente. Muitas complicações surgem pela falta de monitores fetais e incubadoras.

## O Que Precisamos

- 3 incubadoras neonatais
- 5 monitores de sinais vitais
- 2 mesas cirúrgicas
- Material de consumo para 6 meses

## Impacto

Estimamos salvar pelo menos 50 vidas adicionais por ano com o novo equipamento.
    `,
    category: Category.HEALTH,
    province: Province.HUAMBO,
    status: CampaignStatus.ACTIVE,
    goalAmount: 25_000_000,
    currentAmount: 8_750_000,
    startDate: "2026-01-10T00:00:00Z",
    endDate: "2026-06-30T23:59:59Z",
    createdAt: "2026-01-05T14:00:00Z",
    creator: {
      id: "user-2",
      fullName: "Carlos Eduardo Silva",
      avatarUrl: mockUsers[1].avatarUrl,
      isVerified: true,
    },
    media: [
      {
        id: "media-4",
        url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop",
        type: MediaType.IMAGE,
        isFeatured: true,
        order: 0,
      },
      {
        id: "media-5",
        url: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&h=800&fit=crop",
        type: MediaType.IMAGE,
        isFeatured: false,
        order: 1,
      },
    ],
    rewards: [
      {
        id: "reward-4",
        title: "Agradecimento digital",
        description: "Vídeo de agradecimento da equipa médica.",
        minAmount: 10_000,
        stockClaimed: 22,
      },
    ],
    donorCount: 156,
    updateCount: 3,
    commentCount: 28,
  },
  {
    id: "camp-3",
    title: "Lab de Programação para Jovens em Benguela",
    shortDesc:
      "Criar um espaço de aprendizagem de tecnologia para jovens de 14-25 anos em Benguela.",
    fullDesc: `
## Visão

Montar um laboratório de programação equipado com 20 computadores, internet de alta velocidade e mentores para ensinar desenvolvimento web, mobile e robótica a jovens benguelenses.

## Plano

- Fase 1: Aquisição de equipamento (computadores, rede, mobiliário)
- Fase 2: Contratação de 3 mentores a tempo inteiro
- Fase 3: Programa de formação de 6 meses com certificação

## Objectivos

- Formar 100 jovens por ano
- Criar 5 startups locais em 2 anos
- Reduzir o desemprego juvenil na região
    `,
    category: Category.TECHNOLOGY,
    province: Province.BENGUELA,
    status: CampaignStatus.ACTIVE,
    goalAmount: 8_000_000,
    currentAmount: 6_400_000,
    startDate: "2026-01-15T00:00:00Z",
    endDate: "2026-05-15T23:59:59Z",
    createdAt: "2026-01-10T09:00:00Z",
    creator: {
      id: "user-6",
      fullName: "Teresa Makiesse",
      avatarUrl: mockUsers[5].avatarUrl,
      isVerified: true,
    },
    organization: {
      id: "org-2",
      name: "TechKwanza",
      logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop",
    },
    media: [
      {
        id: "media-6",
        url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800&fit=crop",
        type: MediaType.IMAGE,
        isFeatured: true,
        order: 0,
      },
      {
        id: "media-7",
        url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=800&fit=crop",
        type: MediaType.IMAGE,
        isFeatured: false,
        order: 1,
      },
    ],
    rewards: [
      {
        id: "reward-5",
        title: "Menção de Apoiante",
        description: "O seu nome no website do projecto.",
        minAmount: 5_000,
        stockClaimed: 60,
      },
      {
        id: "reward-6",
        title: "Workshop VIP",
        description: "Acesso a um workshop exclusivo de tech com os mentores.",
        minAmount: 50_000,
        stockTotal: 20,
        stockClaimed: 12,
      },
    ],
    donorCount: 198,
    updateCount: 7,
    commentCount: 63,
  },
  {
    id: "camp-4",
    title: "Poço de Água Potável no Bié",
    shortDesc:
      "Construir um poço de água potável para a aldeia de Kuito, fornecendo água a 500 famílias.",
    fullDesc: `
## Contexto

A aldeia de Kuito, província do Bié, não tem acesso a água potável. As famílias caminham mais de 5km diariamente para recolher água de um rio contaminado.

## O Projecto

Perfuração de um poço artesiano com bomba solar, sistema de distribuição e formação da comunidade local na manutenção.

## Orçamento

- Perfuração: 3.000.000 Kz
- Bomba solar: 1.500.000 Kz  
- Sistema de distribuição: 1.000.000 Kz
- Formação e manutenção: 500.000 Kz
    `,
    category: Category.COMMUNITY,
    province: Province.BIE,
    status: CampaignStatus.ACTIVE,
    goalAmount: 6_000_000,
    currentAmount: 4_200_000,
    startDate: "2026-01-20T00:00:00Z",
    endDate: "2026-04-20T23:59:59Z",
    createdAt: "2026-01-15T16:00:00Z",
    creator: {
      id: "user-3",
      fullName: "Maria José Fernandes",
      avatarUrl: mockUsers[2].avatarUrl,
      isVerified: true,
    },
    media: [
      {
        id: "media-8",
        url: "https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=1200&h=800&fit=crop",
        type: MediaType.IMAGE,
        isFeatured: true,
        order: 0,
      },
    ],
    rewards: [
      {
        id: "reward-7",
        title: "Foto da Inauguração",
        description: "Receba uma foto da inauguração do poço.",
        minAmount: 2_500,
        stockClaimed: 80,
      },
    ],
    donorCount: 312,
    updateCount: 4,
    commentCount: 56,
  },
  {
    id: "camp-5",
    title: "Festival de Arte Contemporânea de Luanda",
    shortDesc:
      "Organizar o primeiro festival de arte contemporânea angolana unindo artistas de todas as províncias.",
    fullDesc: `
## O Festival

Um evento de 3 dias que reúne artistas plásticos, músicos, poetas e performers de todas as 18 províncias de Angola. O objectivo é celebrar a diversidade cultural e dar visibilidade aos artistas emergentes.

## Programa

- Dia 1: Exposição + Abertura
- Dia 2: Workshops + Performances ao Vivo
- Dia 3: Leilão Solidário + Encerramento

## Artistas Confirmados

Mais de 40 artistas de 12 províncias já confirmaram participação.
    `,
    category: Category.ARTS,
    province: Province.LUANDA,
    status: CampaignStatus.FUNDED,
    goalAmount: 5_000_000,
    currentAmount: 5_800_000,
    startDate: "2025-10-01T00:00:00Z",
    endDate: "2026-02-28T23:59:59Z",
    createdAt: "2025-09-15T12:00:00Z",
    creator: {
      id: "user-6",
      fullName: "Teresa Makiesse",
      avatarUrl: mockUsers[5].avatarUrl,
      isVerified: true,
    },
    media: [
      {
        id: "media-9",
        url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=800&fit=crop",
        type: MediaType.IMAGE,
        isFeatured: true,
        order: 0,
      },
    ],
    rewards: [],
    donorCount: 420,
    updateCount: 12,
    commentCount: 89,
  },
  {
    id: "camp-6",
    title: "Ajuda de Emergência — Cheias em Cabinda",
    shortDesc:
      "Famílias desalojadas pelas cheias em Cabinda precisam de apoio urgente: alimentos, abrigo e medicamentos.",
    fullDesc: `
## Situação de Emergência

As fortes chuvas de Janeiro causaram inundações graves na província de Cabinda, afectando mais de 2.000 famílias. Muitas perderam as suas casas e pertenças.

## Necessidades Imediatas

- Kits de alimentos para 30 dias
- Tendas temporárias
- Medicamentos e kits de primeiros socorros
- Água potável

## Distribuição

Parceria com a Cruz Vermelha de Angola para garantir distribuição eficiente e transparente.
    `,
    category: Category.EMERGENCY,
    province: Province.CABINDA,
    status: CampaignStatus.ACTIVE,
    goalAmount: 12_000_000,
    currentAmount: 3_600_000,
    startDate: "2026-01-25T00:00:00Z",
    endDate: "2026-03-25T23:59:59Z",
    createdAt: "2026-01-24T20:00:00Z",
    creator: {
      id: "user-2",
      fullName: "Carlos Eduardo Silva",
      avatarUrl: mockUsers[1].avatarUrl,
      isVerified: true,
    },
    media: [
      {
        id: "media-10",
        url: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1200&h=800&fit=crop",
        type: MediaType.IMAGE,
        isFeatured: true,
        order: 0,
      },
    ],
    rewards: [],
    donorCount: 189,
    updateCount: 8,
    commentCount: 34,
  },
  {
    id: "camp-7",
    title: "Projecto de Reflorestação no Namibe",
    shortDesc:
      "Plantar 10.000 árvores nativas no Namibe para combater a desertificação.",
    fullDesc: `
## O Desafio

O Namibe enfrenta avanço da desertificação que ameaça comunidades rurais e a biodiversidade local. 

## A Solução

Plantar 10.000 árvores de espécies nativas em parceria com comunidades locais, criando emprego e restaurando ecossistemas.

## Metas

- Ano 1: 10.000 árvores plantadas
- Ano 2: Sistema de irrigação sustentável
- Ano 3: Programa de ecoturismo comunitário
    `,
    category: Category.ENVIRONMENT,
    province: Province.NAMIBE,
    status: CampaignStatus.ACTIVE,
    goalAmount: 7_500_000,
    currentAmount: 2_250_000,
    startDate: "2026-02-01T00:00:00Z",
    endDate: "2026-07-31T23:59:59Z",
    createdAt: "2026-01-28T10:00:00Z",
    creator: {
      id: "user-3",
      fullName: "Maria José Fernandes",
      avatarUrl: mockUsers[2].avatarUrl,
      isVerified: true,
    },
    media: [
      {
        id: "media-11",
        url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=800&fit=crop",
        type: MediaType.IMAGE,
        isFeatured: true,
        order: 0,
      },
    ],
    rewards: [
      {
        id: "reward-8",
        title: "Certificado verde",
        description: "Certificado digital com a localização GPS da sua árvore.",
        minAmount: 2_500,
        stockClaimed: 130,
      },
    ],
    donorCount: 145,
    updateCount: 2,
    commentCount: 19,
  },
  {
    id: "camp-8",
    title: "Bolsas de Estudo para Jovens Empreendedores",
    shortDesc:
      "Financiar 20 bolsas de estudo para jovens angolanos em cursos de gestão e empreendedorismo.",
    fullDesc: `
## O Programa

Oferecer bolsas de estudo completas para 20 jovens talentosos de famílias vulneráveis, incluindo propinas, material, transporte e mentoria personalizada durante 2 anos.

## Critérios de Selecção

- Idade: 18-25 anos
- Baixa renda familiar comprovada
- Motivação e plano de negócio preliminar
- Residência em Angola

## Parceiros Académicos

Universidade Agostinho Neto e ISCTE Angola.
    `,
    category: Category.BUSINESS,
    province: Province.LUANDA,
    status: CampaignStatus.PENDING_REVIEW,
    goalAmount: 10_000_000,
    currentAmount: 0,
    endDate: "2026-08-31T23:59:59Z",
    createdAt: "2026-02-05T11:00:00Z",
    creator: {
      id: "user-1",
      fullName: "Ana Beatriz Mendes",
      avatarUrl: mockUsers[0].avatarUrl,
      isVerified: true,
    },
    organization: {
      id: "org-1",
      name: "Fundação Esperança Angola",
      logoUrl: "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=200&h=200&fit=crop",
    },
    media: [
      {
        id: "media-12",
        url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=800&fit=crop",
        type: MediaType.IMAGE,
        isFeatured: true,
        order: 0,
      },
    ],
    rewards: [],
    donorCount: 0,
    updateCount: 0,
    commentCount: 0,
  },
];

/* ================================================================
   Mock Updates
   ================================================================ */

export const mockUpdates: CampaignUpdate[] = [
  {
    id: "update-1",
    campaignId: "camp-1",
    title: "Fundações concluídas!",
    content:
      "Temos o prazer de anunciar que as fundações da escola foram concluídas com sucesso. A construção está a avançar conforme o planeado. Obrigado a todos os apoiantes!",
    createdAt: "2026-02-01T10:00:00Z",
    author: { id: "user-1", fullName: "Ana Beatriz Mendes", avatarUrl: mockUsers[0].avatarUrl },
  },
  {
    id: "update-2",
    campaignId: "camp-1",
    title: "Paredes do primeiro bloco erguidas",
    content:
      "O primeiro bloco de 3 salas já tem as paredes levantadas. A equipa de 12 trabalhadores está motivada e o progresso é visível todos os dias.",
    createdAt: "2026-02-08T15:00:00Z",
    author: { id: "user-1", fullName: "Ana Beatriz Mendes", avatarUrl: mockUsers[0].avatarUrl },
  },
  {
    id: "update-3",
    campaignId: "camp-2",
    title: "Primeiras incubadoras chegaram!",
    content:
      "Graças ao vosso apoio, as primeiras 2 incubadoras chegaram ao Hospital do Huambo. A equipa médica está muito grata.",
    createdAt: "2026-02-05T09:00:00Z",
    author: { id: "user-2", fullName: "Carlos Eduardo Silva", avatarUrl: mockUsers[1].avatarUrl },
  },
];

/* ================================================================
   Mock Comments
   ================================================================ */

export const mockComments: Comment[] = [
  {
    id: "comment-1",
    campaignId: "camp-1",
    content: "Projecto incrível! Partilhei com toda a minha família. Força!",
    createdAt: "2026-02-03T18:00:00Z",
    author: { id: "user-6", fullName: "Teresa Makiesse", avatarUrl: mockUsers[5].avatarUrl },
  },
  {
    id: "comment-2",
    campaignId: "camp-1",
    content: "Cada criança merece uma escola digna. Obrigado por este trabalho.",
    createdAt: "2026-02-04T10:30:00Z",
    author: { id: "user-2", fullName: "Carlos Eduardo Silva", avatarUrl: mockUsers[1].avatarUrl },
  },
  {
    id: "comment-3",
    campaignId: "camp-3",
    content: "A tecnologia é o futuro de Angola. Apoio total!",
    createdAt: "2026-02-06T14:00:00Z",
    author: { id: "user-1", fullName: "Ana Beatriz Mendes", avatarUrl: mockUsers[0].avatarUrl },
  },
];
