import 'dotenv/config';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
const adminName = process.env.ADMIN_NAME || 'Admin';

async function createAdmin() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log(`Admin já existe: ${adminEmail}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log(`Admin criado: ${adminEmail}`);
}

createAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Erro ao criar admin:', error);
    process.exit(1);
  });
