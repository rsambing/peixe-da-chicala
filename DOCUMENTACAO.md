# Peixe da Chicala — Documentação Técnica

> Última atualização: Junho 2026

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura e Padrões](#2-arquitetura-e-padrões)
3. [Tecnologias Utilizadas](#3-tecnologias-utilizadas)
4. [Guia para o Desenvolvedor (Onboarding)](#4-guia-para-o-desenvolvedor-onboarding)
5. [Estrutura de Pastas](#5-estrutura-de-pastas)
6. [Deployment / CI·CD](#6-deployment--cicd)

---

## 1. Visão Geral

**Peixe da Chicala** é uma plataforma de cardápio digital e gestão de pedidos para um restaurante de peixe grelhado na brasa, localizado em Luanda, Angola.

### Problema que resolve

Os restaurantes angolanos dependem maioritariamente de pedidos presenciais ou por WhatsApp, sem rastreamento de estado e sem histórico de pedidos. O Peixe da Chicala elimina esse atrito ao oferecer:

- Um **cardápio digital** acessível pelo telemóvel, com imagens, preços em kwanzas e categorias.
- Um **fluxo de encomenda** completo: selecionar pratos → carrinho → checkout → código de rastreamento.
- **Acompanhamento em tempo real** do estado do pedido pelo cliente, sem necessidade de conta.
- Um **painel de administração** para gerir produtos, categorias, pedidos, testemunhos e utilizadores internos.

### Objetivo principal

Digitalizar a operação do restaurante, reduzir o esforço humano no atendimento e melhorar a experiência do cliente final.

---

## 2. Arquitetura e Padrões

O projeto segue uma arquitetura **Multi-Frontend + REST API Monolítica**, organizada num monorepo Git com três módulos independentes.

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENTE FINAL                          │
│                     (browser / telemóvel)                       │
└───────────────────────┬─────────────────────────────────────────┘
                        │ HTTPS
                        ▼
┌───────────────────────────────────────┐
│           frontend  (Next.js)          │  porta 3000 (dev)
│  • Cardápio, Carrinho, Checkout        │
│  • Rastreamento de pedido              │
└───────────────────────┬───────────────┘
                        │ fetch() / REST
                        ▼
┌───────────────────────────────────────┐
│       backend  (Express.js + Prisma)   │  porta 3000 (dev)
│  • REST API com autenticação JWT       │
│  • Validação com Zod                  │
│  • Upload de imagens via ImgBB        │
│  • Swagger UI em /docs                │
└───────────────────────┬───────────────┘
                        │ Prisma ORM
                        ▼
┌───────────────────────────────────────┐
│         PostgreSQL  (base de dados)    │
└───────────────────────────────────────┘
                        ▲
                        │ fetch() / REST + JWT
┌───────────────────────────────────────┐
│       frontend-admin  (Next.js)        │  porta 3003 (dev)
│  • Dashboard, Pedidos, Produtos        │
│  • Categorias, Utilizadores            │
│  • Testemunhos, Configurações          │
└───────────────────────────────────────┘
                        ▲
                    ADMINISTRADOR
```

### Padrões do Backend

O backend segue o padrão **MVC com camada de serviço**:

| Camada        | Responsabilidade                                                  |
|---------------|-------------------------------------------------------------------|
| **Route**     | Define os endpoints HTTP e aplica middlewares                     |
| **Middleware**| Autenticação JWT, autorização por role, validação Zod, upload     |
| **Controller**| Recebe o request, chama o serviço, devolve a resposta HTTP        |
| **Service**   | Lógica de negócio e acesso à base de dados via Prisma             |

### Fluxo de um pedido

```
Cliente escolhe pratos
       ↓
Carrinho (localStorage) — estado gerido pelo CartContext
       ↓
Checkout → POST /orders (backend)
       ↓
Backend gera trackingCode único → devolve pedido
       ↓
Cliente usa trackingCode em /acompanhar → GET /orders/track/:code
       ↓
Admin atualiza estado no painel → PATCH /orders/:id/status
```

### Autenticação

- O painel de admin usa **JWT** (`jsonwebtoken`). O token é guardado em `localStorage` no cliente.
- As rotas do backend que requerem autenticação aplicam o middleware `authenticate.middleware.js` (verificação do Bearer token) seguido de `authorize.middleware.js` (verificação de role: `ADMIN` ou `ATENDENTE`).
- O frontend público (`/frontend`) **não** requer autenticação para consultar o cardápio ou criar pedidos.

---

## 3. Tecnologias Utilizadas

### Backend

| Tecnologia        | Versão    | Uso                                               |
|-------------------|-----------|---------------------------------------------------|
| Node.js           | ≥ 18      | Runtime JavaScript                                |
| Express.js        | ^5.2.1    | Framework HTTP / REST API                         |
| Prisma ORM        | ^7.8.0    | Acesso à base de dados e migrações                |
| PostgreSQL         | —         | Base de dados relacional                          |
| Zod               | ^4.4.3    | Validação de schemas de entrada                   |
| jsonwebtoken      | ^9.0.3    | Geração e verificação de tokens JWT               |
| bcrypt            | ^6.0.0    | Hashing de passwords                              |
| Multer            | ^2.1.1    | Upload de ficheiros multipart/form-data           |
| swagger-jsdoc     | ^6.2.8    | Geração automática da spec OpenAPI                |
| swagger-ui-express| ^5.0.1    | UI de documentação em `/docs`                     |
| dotenv            | ^17.4.2   | Gestão de variáveis de ambiente                   |
| pg                | ^8.20.0   | Driver PostgreSQL para Node.js                    |

### Frontend (cliente)

| Tecnologia        | Versão    | Uso                                               |
|-------------------|-----------|---------------------------------------------------|
| Next.js           | ^16.1.6   | Framework React com App Router (SSR/CSR)          |
| React             | 19.2.3    | Biblioteca de UI                                  |
| TypeScript        | ^5        | Tipagem estática                                  |
| Tailwind CSS      | ^4.1.18   | Estilização utility-first                         |
| GSAP              | ^3.14.2   | Animações (bounce do carrinho, etc.)              |
| Framer Motion     | ^12.34.3  | Animações de componentes                          |
| Radix UI          | vários    | Componentes acessíveis (Dialog, Select, Tabs…)    |
| Lucide React      | ^0.563.0  | Biblioteca de ícones SVG                          |
| Sonner            | ^2.0.7    | Notificações toast                                |
| clsx + tw-merge   | —         | Composição condicional de classes CSS             |

### Frontend Admin

Partilha o mesmo stack do frontend cliente, com as diferenças:

- Porta de desenvolvimento: **3003**
- Inclui `auth-context.tsx` para gestão do estado de autenticação JWT
- Dashboard com vistas de Pedidos, Produtos, Categorias, Utilizadores, Testemunhos e Configurações

---

## 4. Guia para o Desenvolvedor (Onboarding)

### 4.1 Pré-requisitos

- **Node.js** ≥ 18.x ([nodejs.org](https://nodejs.org))
- **npm** ≥ 9.x (incluído com o Node.js)
- **PostgreSQL** ≥ 14 a correr localmente (ou acesso a uma instância remota)
- **Git**

### 4.2 Clonar o repositório

```bash
git clone git@github.com:rsambing/peixe-da-chicala.git
cd peixe-da-chicala
```

### 4.3 Configurar o Backend

```bash
cd backend
npm install
```

Crie o ficheiro `.env` na raiz de `backend/` com base no seguinte template:

```env
# Base de dados PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/peixe_da_chicala"

# JWT
JWT_SECRET="uma_string_segura_e_longa"

# ImgBB (upload de imagens)
IMGBB_API_KEY="a_sua_chave_imgbb"

# Porta (opcional, default: 3000)
PORT=3000
```

Executar as migrações e gerar o cliente Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

Opcional — popular a base de dados com dados iniciais:

```bash
node src/seed/admin.seed.js        # Cria o utilizador admin padrão
node src/scripts/seed.js           # Produtos e categorias de exemplo
node src/scripts/seed-testimonials.js
```

Iniciar o servidor de desenvolvimento:

```bash
npm run dev
# API disponível em http://localhost:3000
# Swagger UI em  http://localhost:3000/docs
```

### 4.4 Configurar o Frontend (cliente)

```bash
cd ../frontend
npm install
```

Crie o ficheiro `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Iniciar em modo de desenvolvimento:

```bash
npm run dev
# http://localhost:3001
```

### 4.5 Configurar o Frontend Admin

```bash
cd ../frontend-admin
npm install
```

Crie o ficheiro `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Iniciar em modo de desenvolvimento:

```bash
npm run dev
# http://localhost:3003
```

### 4.6 Padrões de código e boas práticas

| Área              | Padrão / Convenção                                                      |
|-------------------|-------------------------------------------------------------------------|
| **TypeScript**    | Ativar `strict: true`. Nunca usar `any` sem justificação.               |
| **Componentes**   | Um componente por ficheiro. Exportar com nome explícito (não `default` para componentes de UI reutilizáveis). |
| **State global**  | Usar React Context (`CartContext`, `ProductsContext`, `AuthContext`). Evitar prop drilling. |
| **API calls**     | Centralizar em `src/lib/api.ts`. Nunca fazer fetch diretamente dentro de componentes. |
| **Estilização**   | Usar `cn()` (clsx + tailwind-merge) para composição de classes. Evitar estilos inline. |
| **Validação**     | Toda a entrada do backend deve ser validada com Zod em `validation.schemas.js`. |
| **Commits**       | Seguir Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`. |
| **Linter**        | ESLint com `eslint-config-next`. Executar `npm run lint` antes de cada commit. |
| **Comentários**   | Comentar apenas o *porquê*, nunca o *o quê*. Código bem nomeado dispensa explicação. |

---

## 5. Estrutura de Pastas

```
peixe-da-chicala/
├── backend/                        # API REST (Express.js + Prisma)
│   ├── docs/
│   │   └── swagger.js              # Configuração do Swagger / OpenAPI
│   ├── src/
│   │   ├── controllers/            # Recebem requests, delegam ao serviço
│   │   │   ├── auth.controller.js
│   │   │   ├── category.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── orderItem.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── setting.controller.js
│   │   │   ├── testimonial.controller.js
│   │   │   └── user.controller.js
│   │   ├── middlewares/
│   │   │   ├── authenticate.middleware.js  # Verifica JWT no header
│   │   │   ├── authorize.middleware.js     # Verifica role (ADMIN / ATENDENTE)
│   │   │   ├── upload-multer.js            # Gestão de uploads de imagens
│   │   │   └── validate.middleware.js      # Validação de body com Zod
│   │   ├── routes/                 # Define endpoints e aplica middlewares
│   │   ├── services/               # Lógica de negócio + queries Prisma
│   │   │   ├── imgbb.service.js    # Upload de imagens para ImgBB CDN
│   │   │   └── ...
│   │   ├── schemas/
│   │   │   └── validation.schemas.js  # Schemas Zod para todos os endpoints
│   │   ├── seed/                   # Seeds para dados iniciais (admin)
│   │   ├── scripts/                # Scripts de seed avulsos
│   │   ├── migrations/             # Histórico de migrações SQL (Prisma)
│   │   └── prisma/
│   │       └── schema.prisma       # Modelos da base de dados
│   ├── server.js                   # Entry point da aplicação
│   ├── vercel.json                 # Configuração de deploy na Vercel
│   └── package.json
│
├── frontend/                       # App pública (Next.js — cliente)
│   └── src/
│       ├── app/                    # App Router do Next.js
│       │   ├── layout.tsx          # Layout raiz (fontes, providers, toaster)
│       │   ├── providers.tsx       # ProductsProvider + CartProvider + FloatingCart
│       │   ├── page.tsx            # Página inicial (landing)
│       │   ├── menu/               # Listagem do cardápio e detalhe de prato
│       │   ├── carrinho/           # Página do carrinho de compras
│       │   ├── checkout/           # Formulário de finalização do pedido
│       │   └── acompanhar/         # Rastreamento de pedido por código
│       ├── components/
│       │   ├── layout/             # Header e Footer globais
│       │   ├── features/menu/      # MenuItemCard (card do produto)
│       │   └── ui/                 # Design system (Button, Badge, Dialog…)
│       │       └── FloatingCart.tsx  # Botão flutuante do carrinho
│       └── lib/
│           ├── api.ts              # Todas as chamadas à API REST
│           ├── api-types.ts        # Tipos TypeScript dos recursos da API
│           ├── cart-context.tsx    # Estado global do carrinho (localStorage)
│           ├── products-context.tsx # Cache de produtos carregados da API
│           └── utils.ts            # Utilitários (cn, formatCurrency…)
│
├── frontend-admin/                 # Painel de gestão (Next.js — admin)
│   └── src/
│       ├── app/
│       │   ├── login/              # Página de autenticação
│       │   └── dashboard/          # Área protegida
│       │       ├── page.tsx        # Dashboard com stats e pedidos recentes
│       │       ├── pedidos/        # Listagem e gestão de pedidos
│       │       ├── produtos/       # CRUD de produtos
│       │       ├── categorias/     # CRUD de categorias
│       │       ├── utilizadores/   # Gestão de utilizadores internos
│       │       ├── testemunhos/    # CRUD de testemunhos
│       │       └── configuracoes/  # Definições do site (SiteSetting)
│       └── lib/
│           ├── api.ts              # Chamadas autenticadas (adminApi)
│           └── auth-context.tsx    # Estado de autenticação JWT
│
└── .gitignore
```

### Modelos da base de dados

| Modelo         | Descrição                                                       |
|----------------|-----------------------------------------------------------------|
| `User`         | Utilizadores internos com role `ADMIN` ou `ATENDENTE`           |
| `Product`      | Pratos do cardápio com preço, disponibilidade e imagens         |
| `ProductImage` | Imagens adicionais de um produto (galeria)                      |
| `Category`     | Categorias de agrupamento dos produtos                          |
| `Order`        | Pedido do cliente com código de rastreamento e estado           |
| `OrderItem`    | Linha de pedido: produto + quantidade + preço + observação      |
| `SiteSetting`  | Configurações chave-valor do site (nome, horário, etc.)         |
| `Testimonial`  | Testemunhos de clientes exibidos na landing page                |

---

## 6. Deployment / CI·CD

### Backend — Vercel (Serverless)

O backend está configurado para deploy na **Vercel** como função serverless através do `vercel.json`:

```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

O Express é exportado como `default` e o `app.listen()` só é chamado fora do ambiente Vercel (detecção via `process.env.VERCEL`).

**Variáveis de ambiente a configurar na Vercel:**

| Variável         | Descrição                              |
|------------------|----------------------------------------|
| `DATABASE_URL`   | URL de conexão PostgreSQL (ex: Neon, Supabase) |
| `JWT_SECRET`     | Chave secreta para assinar tokens JWT  |
| `IMGBB_API_KEY`  | Chave da API ImgBB para uploads        |

### Frontend e Frontend Admin — Vercel / Netlify

Ambos os frontends são projetos Next.js e fazem deploy padrão com:

```bash
npm run build   # Gera build de produção (.next/)
npm run start   # Inicia servidor de produção
```

**Variáveis de ambiente a configurar:**

| Variável               | Descrição                           |
|------------------------|-------------------------------------|
| `NEXT_PUBLIC_API_URL`  | URL pública da API do backend       |

### Processo de build resumido

```
git push → Vercel CI deteta mudanças
         → npm install
         → npm run build (prisma generate + next build)
         → Deploy automático
```

> **Nota:** As migrações de base de dados (`prisma migrate deploy`) devem ser executadas manualmente ou num step de CI separado antes do deploy do backend, para evitar inconsistências entre schema e base de dados em produção.

---

*Documentação gerada com base no estado do repositório em Junho de 2026.*
