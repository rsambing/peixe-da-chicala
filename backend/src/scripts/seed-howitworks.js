import prisma from '../lib/prisma.js';

const settings = [
  {
    key: 'howItWorksStep1ImageUrl',
    value: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
  },
  {
    key: 'howItWorksStep2ImageUrl',
    value: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
  },
  {
    key: 'howItWorksStep3ImageUrl',
    value: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80',
  },
];

for (const { key, value } of settings) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  console.log(`✓ ${key}`);
}

console.log('Concluído.');
await prisma.$disconnect();
