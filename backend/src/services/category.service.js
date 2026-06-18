import prisma from "../lib/prisma.js";
import { ImgBBService } from "./imgbb.service.js";

const imgbbService = new ImgBBService();

export class CategoryService {
  async createCategory(data, file) {
    let imageUrl = null;
    let imageDeleteUrl = null;

    if (file) {
      const result = await imgbbService.uploadImage(file);
      imageUrl = result.imageUrl;
      imageDeleteUrl = result.deleteUrl;
    }

    return await prisma.category.create({
      data: { name: data.name, imageUrl, imageDeleteUrl },
    });
  }

  async getCategoryById(id) {
    return await prisma.category.findUnique({ where: { id } });
  }

  async getAllCategories() {
    return await prisma.category.findMany({ orderBy: { id: 'asc' } });
  }

  async updateCategory(id, data, file) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw new Error('Categoria não encontrada');

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;

    if (file) {
      if (existing.imageDeleteUrl) {
        await imgbbService.deleteImage(existing.imageDeleteUrl).catch(() => {});
      }
      const result = await imgbbService.uploadImage(file);
      updateData.imageUrl = result.imageUrl;
      updateData.imageDeleteUrl = result.deleteUrl;
    }

    return await prisma.category.update({ where: { id }, data: updateData });
  }

  async deleteCategory(id) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw new Error('Categoria não encontrada');

    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw new Error(
        `Não é possível eliminar: esta categoria tem ${productCount} produto(s) associado(s). Mova ou elimine os produtos primeiro.`
      );
    }

    if (existing.imageDeleteUrl) {
      await imgbbService.deleteImage(existing.imageDeleteUrl).catch(() => {});
    }

    return await prisma.category.delete({ where: { id } });
  }
}
