import { z } from 'zod';

const roleEnum = z.enum(['ADMIN', 'ATENDENTE']);

// AUTH SCHEMAS
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

export const createUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').transform((value) => value.toLowerCase()),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: roleEnum.optional().default('ATENDENTE')
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  role: roleEnum.optional()
}).strict();


// CATEGORY SCHEMAS
export const createCategorySchema = z.object({
  name: z.string().min(2, 'Nome da categoria deve ter pelo menos 2 caracteres')
});

export const updateCategorySchema = z.object({
  name: z.string().min(2, 'Nome da categoria deve ter pelo menos 2 caracteres').optional()
}).strict();

// Coerce string "true"/"false" from FormData to real boolean
const booleanField = z.preprocess(
  (v) => (v === 'true' || v === true ? true : v === 'false' || v === false ? false : v),
  z.boolean()
);

// PRODUCT SCHEMAS
export const createProductSchema = z.object({
  name: z.string().min(2, 'Nome do produto deve ter pelo menos 2 caracteres'),
  description: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
  price: z.string().or(z.number()).pipe(z.coerce.number().positive('Preço deve ser positivo')),
  categoryId: z.string().or(z.number()).pipe(z.coerce.number().int('Category ID deve ser um número inteiro')),
  available: booleanField.optional().default(true),
  featured: booleanField.optional().default(false),
});

export const updateProductSchema = z.object({
  name: z.string().min(2, 'Nome do produto deve ter pelo menos 2 caracteres').optional(),
  description: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres').optional(),
  price: z.string().or(z.number()).pipe(z.coerce.number().positive('Preço deve ser positivo')).optional(),
  categoryId: z.string().or(z.number()).pipe(z.coerce.number().int('Category ID deve ser um número inteiro')).optional(),
  available: booleanField.optional(),
  featured: booleanField.optional(),
});

// ORDER SCHEMAS
export const createOrderSchema = z.object({
  trackingCode: z.string().min(3, 'Código de rastreio deve ter pelo menos 3 caracteres'),
  customerName: z.string().min(2, 'Nome do cliente deve ter pelo menos 2 caracteres'),
  phone: z.string().min(9, 'Telefone inválido'),
  address: z.string().optional().default(''),
  status: z.string().optional().default('RECEBIDO'),
  total: z.string().or(z.number()).pipe(z.coerce.number().positive('Total deve ser positivo')),
  items: z.array(z.object({
    productId: z.string().or(z.number()).pipe(z.coerce.number().int().positive()),
    quantity: z.string().or(z.number()).pipe(z.coerce.number().int().positive()),
    price: z.string().or(z.number()).pipe(z.coerce.number().positive()),
  })).optional(),
});

export const updateOrderSchema = z.object({
  trackingCode: z.string().min(3, 'Código de rastreio deve ter pelo menos 3 caracteres').optional(),
  customerName: z.string().min(2, 'Nome do cliente deve ter pelo menos 2 caracteres').optional(),
  phone: z.string().min(9, 'Telefone inválido').optional(),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres').optional(),
  status: z.string().optional(),
  total: z.string().or(z.number()).pipe(z.coerce.number().positive('Total deve ser positivo')).optional()
}).strict();

// ORDER ITEM SCHEMAS
export const createOrderItemSchema = z.object({
  orderId: z.string().or(z.number()).pipe(z.coerce.number().int('Order ID deve ser um número inteiro')),
  productId: z.string().or(z.number()).pipe(z.coerce.number().int('Product ID deve ser um número inteiro')),
  quantity: z.string().or(z.number()).pipe(z.coerce.number().int('Quantidade deve ser um número inteiro').positive('Quantidade deve ser maior que 0')),
  price: z.string().or(z.number()).pipe(z.coerce.number().positive('Preço deve ser positivo'))
});

export const updateOrderItemSchema = z.object({
  orderId: z.string().or(z.number()).pipe(z.coerce.number().int('Order ID deve ser um número inteiro')).optional(),
  productId: z.string().or(z.number()).pipe(z.coerce.number().int('Product ID deve ser um número inteiro')).optional(),
  quantity: z.string().or(z.number()).pipe(z.coerce.number().int('Quantidade deve ser um número inteiro').positive('Quantidade deve ser maior que 0')).optional(),
  price: z.string().or(z.number()).pipe(z.coerce.number().positive('Preço deve ser positivo')).optional()
}).strict();
