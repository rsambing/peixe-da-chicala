import prisma from '../lib/prisma.js';

export class ProductService {
  async createProduct(data) {
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        categoryId: Number(data.categoryId),
        imageUrl: data.imageUrl,
        imageDeleteUrl: data.imageDeleteUrl
      }
    });
  }

  async getProductById(id) {
    return await prisma.product.findUnique({ where: { id } });
  }

  async getAllProducts() {
    return await prisma.product.findMany();
  }

  async updateProduct(id, data) {
    const updateData = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.imageDeleteUrl !== undefined) updateData.imageDeleteUrl = data.imageDeleteUrl;
    if (data.categoryId !== undefined) updateData.categoryId = Number(data.categoryId);
    if (data.available !== undefined) updateData.available = data.available;

    return await prisma.product.update({ where: { id }, data: updateData });
  }

  async deleteProduct(id) {
    return await prisma.product.delete({ where: { id } });
  }
}