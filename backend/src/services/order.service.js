import prisma from "../lib/prisma.js";
import { normalizePhone, isValidAngolanMobile, toZexaRecipient } from "../lib/phone.js";
import { ZexaService } from "./zexa.service.js";
import { buildOrderConfirmedSms, buildReadySms } from "../lib/sms-copy.js";

const zexaService = new ZexaService();
const READY_STATUSES = ['SAIU_PARA_ENTREGA', 'ENTREGUE'];

async function sendOrderSms(order, body) {
  const normalizedPhone = normalizePhone(order.phone);
  if (!isValidAngolanMobile(normalizedPhone)) return false;
  try {
    await zexaService.sendSms({ recipient: toZexaRecipient(normalizedPhone), body, isOtp: false });
    return true;
  } catch (error) {
    console.error('SMS de pedido não enviado:', error.message);
    return false;
  }
}

export class OrderService {
  async createOrder(data) {
    const normalizedPhone = normalizePhone(data.phone);
    const orderData = {
      trackingCode: data.trackingCode,
      customerName: data.customerName,
      phone: normalizedPhone,
      address: data.address || '',
      region: data.region || null,
      status: data.status ?? 'RECEBIDO',
      paymentMethod: data.paymentMethod ?? 'TRANSFERENCIA',
      total: Number(data.total),
    };

    let order;
    if (data.items && data.items.length > 0) {
      order = await prisma.$transaction(async (tx) => {
        const created = await tx.order.create({ data: orderData });
        await tx.orderItem.createMany({
          data: data.items.map((item) => ({
            orderId: created.id,
            productId: Number(item.productId),
            quantity: Number(item.quantity),
            price: Number(item.price),
            note: item.note ?? null,
          })),
        });
        return await tx.order.findUnique({
          where: { id: created.id },
          include: { items: { include: { product: { include: { images: { orderBy: { sortOrder: 'asc' } } } } } } },
        });
      });
    } else {
      order = await prisma.order.create({ data: orderData });
    }

    const sent = await sendOrderSms(order, buildOrderConfirmedSms(order));
    if (sent) {
      order = await prisma.order.update({
        where: { id: order.id },
        data: { confirmSmsSentAt: new Date() },
        include: order.items ? { items: { include: { product: { include: { images: { orderBy: { sortOrder: 'asc' } } } } } } } : undefined,
      });
    }

    return order;
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
    if (data.phone !== undefined) updateData.phone = normalizePhone(data.phone);
    if (data.address !== undefined) updateData.address = data.address;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.total !== undefined) updateData.total = Number(data.total);

    let updatedOrder = await prisma.order.update({ where: { id }, data: updateData });

    const shouldSendReadySms =
      data.status !== undefined &&
      data.status !== existingOrder.status &&
      READY_STATUSES.includes(data.status) &&
      !existingOrder.readySmsSentAt;

    if (shouldSendReadySms) {
      const sent = await sendOrderSms(updatedOrder, buildReadySms(updatedOrder, data.status));
      if (sent) {
        updatedOrder = await prisma.order.update({ where: { id }, data: { readySmsSentAt: new Date() } });
      }
    }

    return updatedOrder;
  }

  async deleteOrder(id) {
    return await prisma.order.delete({ where: { id } });
  }
}
