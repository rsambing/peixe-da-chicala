import prisma from '../lib/prisma.js';
import { ImgBBService } from './imgbb.service.js';

const imgbbService = new ImgBBService();

const INCLUDE = {
  category: true,
  images: { orderBy: { sortOrder: 'asc' } },
};

export class ProductService {
  async getAllProducts() {
    return await prisma.product.findMany({ include: INCLUDE, orderBy: { createdAt: 'desc' } });
  }

  async getProductById(id) {
    return await prisma.product.findUnique({ where: { id }, include: INCLUDE });
  }

  async createProduct(data, files = []) {
    let imageUrl = null;
    let imageDeleteUrl = null;

    // Upload first file as primary thumbnail
    const uploads = await Promise.all(files.map((f) => imgbbService.uploadImage(f)));

    if (uploads.length > 0) {
      imageUrl = uploads[0].imageUrl;
      imageDeleteUrl = uploads[0].deleteUrl;
    }

    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: Number(data.price),
          categoryId: Number(data.categoryId),
          available: data.available !== undefined ? data.available === 'true' || data.available === true : true,
          imageUrl,
          imageDeleteUrl,
        },
      });

      if (uploads.length > 0) {
        await tx.productImage.createMany({
          data: uploads.map((u, i) => ({
            productId: product.id,
            imageUrl: u.imageUrl,
            imageDeleteUrl: u.deleteUrl,
            sortOrder: i,
          })),
        });
      }

      return await tx.product.findUnique({ where: { id: product.id }, include: INCLUDE });
    });
  }

  async updateProduct(id, data, files = []) {
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.categoryId !== undefined) updateData.categoryId = Number(data.categoryId);
    if (data.available !== undefined) updateData.available = data.available === 'true' || data.available === true;

    return await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { id }, data: updateData });

      if (files.length > 0) {
        const existing = await tx.productImage.count({ where: { productId: id } });
        const uploads = await Promise.all(files.map((f) => imgbbService.uploadImage(f)));

        // If product has no primary image yet, set first upload as primary
        const product = await tx.product.findUnique({ where: { id }, select: { imageUrl: true } });
        if (!product.imageUrl && uploads.length > 0) {
          await tx.product.update({
            where: { id },
            data: { imageUrl: uploads[0].imageUrl, imageDeleteUrl: uploads[0].deleteUrl },
          });
        }

        await tx.productImage.createMany({
          data: uploads.map((u, i) => ({
            productId: id,
            imageUrl: u.imageUrl,
            imageDeleteUrl: u.deleteUrl,
            sortOrder: existing + i,
          })),
        });
      }

      return await tx.product.findUnique({ where: { id }, include: INCLUDE });
    });
  }

  async deleteProductImage(imageId) {
    const img = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!img) throw new Error('Imagem não encontrada');

    if (img.imageDeleteUrl) {
      await imgbbService.deleteImage(img.imageDeleteUrl).catch(() => {});
    }

    await prisma.productImage.delete({ where: { id: imageId } });

    // If this was also the product's primary image, update it to the next one
    const next = await prisma.productImage.findFirst({
      where: { productId: img.productId },
      orderBy: { sortOrder: 'asc' },
    });

    const product = await prisma.product.findUnique({ where: { id: img.productId }, select: { imageUrl: true } });
    if (product?.imageUrl === img.imageUrl) {
      await prisma.product.update({
        where: { id: img.productId },
        data: { imageUrl: next?.imageUrl ?? null, imageDeleteUrl: next?.imageDeleteUrl ?? null },
      });
    }
  }

  async deleteProduct(id) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!product) throw new Error('Produto não encontrado');

    const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
    if (orderItemCount > 0) {
      throw new Error(
        `Não é possível eliminar: este produto faz parte de ${orderItemCount} pedido(s). Marque-o como indisponível em vez de eliminar.`
      );
    }

    // Clean up ImgBB images
    await Promise.all(product.images.map((img) => imgbbService.deleteImage(img.imageDeleteUrl).catch(() => {})));
    if (product.imageDeleteUrl) {
      await imgbbService.deleteImage(product.imageDeleteUrl).catch(() => {});
    }

    return await prisma.product.delete({ where: { id } });
  }
}
