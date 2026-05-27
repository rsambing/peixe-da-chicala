import prisma from "../lib/prisma.js";

export class OrderService {
  async createOrder(data) {
    return await prisma.order.create({
      data: {
        trackingCode: data.trackingCode,
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        status: data.status ?? 'pending',
        total: Number(data.total)
      }
    });
  }

  async getOrderById(id) {
    return await prisma.order.findUnique({ where: { id } });
  }

  async getAllOrders() {
    return await prisma.order.findMany();
  }

  async updateOrder(id, data) {
    const updateData = {};

    if (data.trackingCode !== undefined) updateData.trackingCode = data.trackingCode;
    if (data.customerName !== undefined) updateData.customerName = data.customerName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.total !== undefined) updateData.total = Number(data.total);

    return await prisma.order.update({ where: { id }, data: updateData });
  }

  async deleteOrder(id) {
    return await prisma.order.delete({ where: { id } });
  }
}
