import prisma from "../lib/prisma.js";

export class DeliveryZoneService {
  async createZone(data) {
    return await prisma.deliveryZone.create({
      data: { name: data.name, feeKz: Number(data.feeKz) },
    });
  }

  async getAllZones() {
    return await prisma.deliveryZone.findMany({ orderBy: { name: 'asc' } });
  }

  async updateZone(id, data) {
    const existing = await prisma.deliveryZone.findUnique({ where: { id } });
    if (!existing) throw new Error('Zona de entrega não encontrada');

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.feeKz !== undefined) updateData.feeKz = Number(data.feeKz);

    return await prisma.deliveryZone.update({ where: { id }, data: updateData });
  }

  async deleteZone(id) {
    const existing = await prisma.deliveryZone.findUnique({ where: { id } });
    if (!existing) throw new Error('Zona de entrega não encontrada');

    return await prisma.deliveryZone.delete({ where: { id } });
  }
}
