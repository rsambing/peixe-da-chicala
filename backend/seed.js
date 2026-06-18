import 'dotenv/config';
import bcrypt from 'bcrypt';
import * as PrismaPkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const PrismaClient =
  PrismaPkg.PrismaClient ??
  PrismaPkg.default?.PrismaClient ??
  PrismaPkg.default ??
  PrismaPkg;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  {
    name: 'Peixes Grelhados',
    imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Pratos Tradicionais',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Mariscos',
    imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Bebidas',
    imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Sobremesas',
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Extras',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80',
  },
];

async function main() {
  // Admin user
  const hashed = await bcrypt.hash('Senha123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@peixedachicala.ao' },
    update: { password: hashed, role: 'ADMIN' },
    create: {
      name: 'Admin PDC',
      email: 'admin@peixedachicala.ao',
      password: hashed,
      role: 'ADMIN',
    },
  });
  console.log('✓ Admin:', admin.email);

  // Categories
  for (const cat of CATEGORIES) {
    const result = await prisma.category.upsert({
      where: { name: cat.name },
      update: { imageUrl: cat.imageUrl },
      create: { name: cat.name, imageUrl: cat.imageUrl },
    });
    console.log('✓ Categoria:', result.name);
  }

  console.log('\nSeed concluído!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
