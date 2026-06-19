import prisma from '../lib/prisma.js';

const testimonials = [
  {
    quote: 'O cacusso grelhado daqui não tem comparação. Temperado no ponto, servido quente — é o sabor de Luanda de verdade. Já peço duas vezes por semana.',
    name: 'Domingos Ferreira',
    role: 'Cliente habitual, Chicala',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    sortOrder: 0,
  },
  {
    quote: 'Fiz o pedido pelo site, acompanhei em tempo real com o código e chegou quentinho. Nem sabia que era possível. Agora não peço de outra forma.',
    name: 'Carla Nzinga',
    role: 'Cliente online, Luanda',
    avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop&crop=face',
    sortOrder: 1,
  },
  {
    quote: 'Trouxe a minha família toda ao fim-de-semana. O combo Brasa para 2 acabou a alimentar quatro pessoas — generoso, saboroso e bem servido.',
    name: 'Paulo Tchipalanga',
    role: 'Cliente familiar, Luanda Sul',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    sortOrder: 2,
  },
];

for (const t of testimonials) {
  await prisma.testimonial.upsert({
    where: { id: t.sortOrder + 1 },
    update: t,
    create: t,
  });
  console.log(`✓ ${t.name}`);
}

console.log('Concluído.');
await prisma.$disconnect();
