import prisma from '../lib/prisma.js';
import { ImgBBService } from './imgbb.service.js';

const imgbbService = new ImgBBService();

export class TestimonialService {
  getAll() {
    return prisma.testimonial.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  }

  async create(data, file) {
    let avatarUrl = null;
    let avatarDeleteUrl = null;
    if (file) {
      const result = await imgbbService.uploadImage(file);
      avatarUrl = result.imageUrl;
      avatarDeleteUrl = result.deleteUrl;
    }
    return prisma.testimonial.create({
      data: {
        quote: data.quote,
        name: data.name,
        role: data.role,
        sortOrder: data.sortOrder ? parseInt(data.sortOrder) : 0,
        avatarUrl,
        avatarDeleteUrl,
      },
    });
  }

  async update(id, data, file) {
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) throw new Error('Testemunho não encontrado');

    let avatarUrl = existing.avatarUrl;
    let avatarDeleteUrl = existing.avatarDeleteUrl;

    if (file) {
      if (existing.avatarDeleteUrl) {
        await imgbbService.deleteImage(existing.avatarDeleteUrl).catch(() => {});
      }
      const result = await imgbbService.uploadImage(file);
      avatarUrl = result.imageUrl;
      avatarDeleteUrl = result.deleteUrl;
    }

    return prisma.testimonial.update({
      where: { id },
      data: {
        quote: data.quote ?? existing.quote,
        name: data.name ?? existing.name,
        role: data.role ?? existing.role,
        sortOrder: data.sortOrder !== undefined ? parseInt(data.sortOrder) : existing.sortOrder,
        avatarUrl,
        avatarDeleteUrl,
      },
    });
  }

  async delete(id) {
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) throw new Error('Testemunho não encontrado');
    if (existing.avatarDeleteUrl) {
      await imgbbService.deleteImage(existing.avatarDeleteUrl).catch(() => {});
    }
    return prisma.testimonial.delete({ where: { id } });
  }
}
