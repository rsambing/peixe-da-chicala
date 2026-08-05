# Peixe da Chicala — API REST

Documentação da API do backend (Node.js/Express + Prisma/PostgreSQL). Também disponível interactivamente em `/docs` (Swagger UI), gerada a partir dos mesmos comentários `@openapi` nas rotas.

## Base URLs

| Ambiente | URL |
|---|---|
| Produção | `https://backend-peixe-da-chicala.onrender.com` |
| Local | `http://localhost:3000` |

## Autenticação

Rotas de administração usam **JWT Bearer**. Faça login em `POST /auth/login` para obter um `token`, e envie-o em pedidos autenticados:

```
Authorization: Bearer <token>
```

O token contém `{ id, email, role }` e expira em `JWT_EXPIRES_IN` (por omissão `1d`). Roles existentes: `ADMIN`, `GESTOR`, `ATENDENTE`.

Rotas marcadas **(público)** não exigem autenticação — são usadas pelo site do cliente. As restantes exigem o Bearer token e, nalguns casos, uma role específica (indicada entre parêntesis).

---

## Autenticação

### `POST /auth/login` — (público)
Autentica um utilizador do painel admin.

**Body**
```json
{ "email": "admin@exemplo.com", "password": "••••••" }
```

**Resposta 200**
```json
{
  "token": "eyJhbGciOi...",
  "user": { "id": 1, "name": "Administrador", "email": "admin@exemplo.com", "role": "ADMIN", "createdAt": "..." }
}
```

**401** — credenciais inválidas.

---

## Utilizadores (staff do admin)

Todas as rotas exigem `ADMIN`.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/users` | Criar utilizador `{ name, email, password, role? }` (role por omissão `ATENDENTE`) |
| GET | `/users` | Listar todos |
| GET | `/users/:id` | Obter por ID |
| PUT | `/users/:id` | Actualizar `{ name?, email?, password?, role? }` |
| DELETE | `/users/:id` | Eliminar (204) |

---

## Categorias

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/categories` | público | Listar todas |
| GET | `/categories/:id` | público | Obter por ID |
| POST | `/categories` | ADMIN, GESTOR | Criar — `multipart/form-data`: `name`, `image?` |
| PUT | `/categories/:id` | ADMIN, GESTOR | Actualizar — `multipart/form-data`: `name?`, `image?` |
| DELETE | `/categories/:id` | ADMIN, GESTOR | Eliminar (204). Produtos associados ficam sem categoria. |

**Modelo**
```json
{ "id": 1, "name": "Peixes Grelhados", "imageUrl": "https://...", "imageDeleteUrl": "https://..." }
```

---

## Produtos

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/products` | público | Listar todos (inclui `category` e `images`) |
| GET | `/products/featured` | público | Listar produtos em destaque |
| GET | `/products/:id` | público | Obter por ID |
| POST | `/products` | ADMIN, GESTOR | Criar — `multipart/form-data`: `name`, `description`, `price`, `categoryId`, `available?`, `featured?`, `images[]?` (até 10) |
| PUT | `/products/:id` | ADMIN, GESTOR | Actualizar — mesmos campos, todos opcionais |
| DELETE | `/products/:id` | ADMIN, GESTOR | Eliminar (204) |
| DELETE | `/products/:id/images/:imageId` | ADMIN, GESTOR | Eliminar uma imagem específica do produto (204) |

**Modelo**
```json
{
  "id": 1, "name": "Corvina Grelhada", "description": "...", "price": 4500,
  "imageUrl": "https://...", "imageDeleteUrl": "https://...",
  "available": true, "featured": false,
  "categoryId": 1, "category": { "id": 1, "name": "Peixes Grelhados" },
  "images": [{ "id": 1, "productId": 1, "imageUrl": "https://...", "imageDeleteUrl": "https://...", "sortOrder": 0 }],
  "createdAt": "..."
}
```

---

## Pedidos

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/orders` | público | Criar pedido |
| GET | `/orders/track/:code` | público | Obter pedido pelo código de rastreio |
| GET | `/orders` | ADMIN, GESTOR, ATENDENTE | Listar todos (mais recentes primeiro) |
| GET | `/orders/:id` | ADMIN, GESTOR, ATENDENTE | Obter por ID |
| PUT | `/orders/:id` | ADMIN, ATENDENTE | Actualizar estado/dados |
| DELETE | `/orders/:id` | ADMIN | Eliminar (204) |

**Body de criação (`POST /orders`)**
```json
{
  "trackingCode": "PDC-138009",
  "customerName": "João",
  "phone": "923456789",
  "address": "Coreia - Rua X, 12 - perto do mercado",
  "region": "Coreia",
  "total": 5000,
  "items": [
    { "productId": 1, "quantity": 2, "price": 4500, "note": "sem picante" }
  ]
}
```
- `status` por omissão `RECEBIDO`. `paymentMethod` é sempre `TRANSFERENCIA` (único método suportado — pagamento por transferência bancária, comprovativo enviado manualmente pelo WhatsApp).
- `region` é opcional (nome do bairro, usado para filtrar campanhas de SMS por região).
- Ao criar o pedido, é enviado automaticamente um **SMS de confirmação** ao `phone` indicado (via Zexa), se o número for um angolano válido.

**Estados possíveis (`status`)**
| Valor | Significado |
|---|---|
| `RECEBIDO` | Pedido recebido (estado inicial) |
| `EM_PREPARACAO` | Em preparação na cozinha |
| `SAIU_PARA_ENTREGA` | A caminho do cliente |
| `ENTREGUE` | Entregue |

Ao mudar o estado para `SAIU_PARA_ENTREGA` (ou directamente para `ENTREGUE`, caso o anterior nunca tenha sido enviado), é disparado automaticamente um **SMS de "pedido a caminho"** — no máximo uma vez por pedido (ver `readySmsSentAt`).

**Modelo de resposta**
```json
{
  "id": 10, "trackingCode": "PDC-138009", "customerName": "João", "phone": "244923456789",
  "address": "Coreia - Rua X, 12 - perto do mercado", "region": "Coreia",
  "status": "RECEBIDO", "paymentMethod": "TRANSFERENCIA", "total": 5000,
  "confirmSmsSentAt": "2026-08-05T10:00:00.000Z", "readySmsSentAt": null,
  "createdAt": "...",
  "items": [{ "id": 1, "orderId": 10, "productId": 1, "quantity": 2, "price": 4500, "note": null, "product": { "...": "ApiProduct" } }]
}
```

---

## Itens de Encomenda

CRUD directo sobre `OrderItem`, normalmente não usado directamente (os itens são criados em conjunto com o pedido via `POST /orders`). Todas as rotas exigem `ADMIN` ou `ATENDENTE`.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/order-items` | Criar `{ orderId, productId, quantity, price }` |
| GET | `/order-items` | Listar todos |
| GET | `/order-items/:id` | Obter por ID |
| PUT | `/order-items/:id` | Actualizar |
| DELETE | `/order-items/:id` | Eliminar (204) |

---

## Mensagens SMS (campanhas)

Integração com a [Zexa](https://api.zexa.ao) para envio de SMS. Todas as rotas exigem `ADMIN`.

| Método | Rota | Descrição |
|---|---|---|
| GET | `/sms-campaigns/regions` | Lista as regiões (bairros) com pelo menos um pedido — usadas como filtro de audiência |
| GET | `/sms-campaigns/preview?audienceType=ALL\|REGION&region=` | Pré-visualiza quantos destinatários únicos a campanha atingiria |
| POST | `/sms-campaigns` | Cria e envia imediatamente uma campanha |
| GET | `/sms-campaigns` | Histórico de campanhas enviadas |

**Body de `POST /sms-campaigns`**
```json
{
  "name": "Promoção Fim-de-semana",
  "message": "Peixe da Chicala: aproveite 10% de desconto este fim-de-semana!",
  "audienceType": "REGION",
  "region": "Coreia"
}
```
- `audienceType`: `"ALL"` (todos os clientes com pedidos) ou `"REGION"` (requer `region`).
- Destinatários são resolvidos a partir dos números de telefone únicos dos pedidos existentes (normalizados, sem duplicados).
- Mensagem limitada a 1600 caracteres; cada 160 caracteres correspondem a ~1 crédito SMS por destinatário.

**Modelo de resposta**
```json
{
  "id": 3, "name": "Promoção Fim-de-semana", "message": "...",
  "audienceType": "REGION", "region": "Coreia", "recipientCount": 42,
  "status": "queued", "zexaCampaignId": "cmp8s0a1b0002zb",
  "createdBy": { "id": 1, "name": "Administrador" }, "createdAt": "..."
}
```

---

## Testemunhos

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/testimonials` | público | Listar todos |
| POST | `/testimonials` | ADMIN, GESTOR | Criar — `multipart/form-data`: `name`, `text`, `rating`, `avatar?` |
| PUT | `/testimonials/:id` | ADMIN, GESTOR | Actualizar |
| DELETE | `/testimonials/:id` | ADMIN, GESTOR | Eliminar (204) |

---

## Configurações do site

Par chave-valor genérico usado para conteúdo editável do site (imagens de fundo, dados de contacto).

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/settings` | público | Devolve todas as configurações como objecto `{ chave: valor }`, com defaults para chaves nunca definidas |
| PUT | `/settings/:key` | ADMIN, GESTOR | Actualizar uma chave — `multipart/form-data`: `value` (texto) **ou** `image` (ficheiro, para chaves `*ImageUrl`) |

**Chaves conhecidas**: `heroImageUrl`, `loginBgUrl`, `howItWorksStep1ImageUrl`, `howItWorksStep2ImageUrl`, `howItWorksStep3ImageUrl`, `sobreImageUrl`, `contactPhone`, `contactWhatsapp`, `contactEmail`, `contactAddress`, `contactHours`, `contactMapEmbedUrl`.

> Nota: `heroImageUrl` deixou de ser consumido pelo site do cliente (a imagem do hero passou a ser um ficheiro estático, por performance) — o valor continua editável aqui mas sem efeito visível até essa ligação ser restabelecida.

---

## Erros

Respostas de erro seguem o formato:
```json
{ "error": "Mensagem descritiva" }
```

| Código | Significado |
|---|---|
| 400 | Payload inválido (falha de validação) ou erro de negócio |
| 401 | Sem token, token inválido/expirado, ou credenciais erradas |
| 403 | Autenticado mas sem permissão (role) para esta acção |
| 404 | Recurso não encontrado |

## Serviços externos usados pelo backend

| Serviço | Uso | Variável de ambiente |
|---|---|---|
| ImgBB | Upload de imagens (produtos, categorias, testemunhos, configurações) | `IMGBB_API_KEY` |
| Zexa | Envio de SMS (confirmação/entrega de pedidos, campanhas) | `ZEXA_API_KEY`, `ZEXA_API_URL` |
| Neon (PostgreSQL) | Base de dados | `DATABASE_URL` |
