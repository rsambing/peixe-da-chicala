import prisma from "../lib/prisma.js";

export class OrderItemService {
  async createOrderItem(data) {
    return await prisma.orderItem.create({
      data: {
        orderId: Number(data.orderId),
        productId: Number(data.productId),
        quantity: Number(data.quantity),
        price: Number(data.price)
      }
    });
  }

  async getOrderItemById(id) {
    return await prisma.orderItem.findUnique({ where: { id } });
  }

  async getAllOrderItems() {
    return await prisma.orderItem.findMany();
  }

  async updateOrderItem(id, data) {
    const updateData = {};

    if (data.orderId !== undefined) updateData.orderId = Number(data.orderId);
    if (data.productId !== undefined) updateData.productId = Number(data.productId);
    if (data.quantity !== undefined) updateData.quantity = Number(data.quantity);
    if (data.price !== undefined) updateData.price = Number(data.price);

    return await prisma.orderItem.update({ where: { id }, data: updateData });
  }

  async deleteOrderItem(id) {
    return await prisma.orderItem.delete({ where: { id } });
  }
}
