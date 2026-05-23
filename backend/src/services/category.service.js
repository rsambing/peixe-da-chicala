import prisma from "../lib/prisma.js";

export class CategoryService {
  async createCategory(data) {
    return await prisma.category.create({ data });
  }

  async getCategoryById(id) {
    return await prisma.category.findUnique({ where: { id } });
  }

  async getAllCategories() {
    return await prisma.category.findMany();
  }

  async updateCategory(id, data) {
    return await prisma.category.update({ where: { id }, data });
  }

  async deleteCategory(id) {
    return await prisma.category.delete({ where: { id } });
  }
}