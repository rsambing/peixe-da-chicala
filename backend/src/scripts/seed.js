import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';

async function main() {
  const email = 'admin@peixedachicala.ao';
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log('Admin já existe:', existing.email);
    return;
  }

  const user = await prisma.user.create({
    data: {
      name: 'Administrador',
      email,
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  console.log('Admin criado com sucesso:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
