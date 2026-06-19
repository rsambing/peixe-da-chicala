import prisma from "../lib/prisma.js";

export class OrderService {
  async createOrder(data) {
    const orderData = {
      trackingCode: data.trackingCode,
      customerName: data.customerName,
      phone: data.phone,
      address: data.address || '',
      status: data.status ?? 'RECEBIDO',
      total: Number(data.total),
    };

    if (data.items && data.items.length > 0) {
      return await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({ data: orderData });
        await tx.orderItem.createMany({
          data: data.items.map((item) => ({
            orderId: order.id,
            productId: Number(item.productId),
            quantity: Number(item.quantity),
            price: Number(item.price),
            note: item.note ?? null,
          })),
        });
        return await tx.order.findUnique({
          where: { id: order.id },
          include: { items: { include: { product: { include: { images: { orderBy: { sortOrder: 'asc' } } } } } } },
        });
      });
    }

    return await prisma.order.create({ data: orderData });
  }

  async getOrderById(id) {
    return await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: { include: { images: { orderBy: { sortOrder: 'asc' } } } } } } },
    });
  }

  async getOrderByTrackingCode(code) {
    const order = await prisma.order.findUnique({
      where: { trackingCode: code },
      include: { items: { include: { product: { include: { images: { orderBy: { sortOrder: 'asc' } } } } } } },
    });
    if (!order) throw new Error('Pedido não encontrado');
    return order;
  }

  async getAllOrders() {
    return await prisma.order.findMany({
      include: { items: { include: { product: { include: { images: { orderBy: { sortOrder: 'asc' } } } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrder(id, data) {
    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) throw new Error('Order não encontrado');

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
