import prisma from "../lib/prisma.js";

export class OrderItemService {
    async createOrderItem(data) {
        return await prisma.orderItem.create({data});
    }

    async getOrderItemById(id) {
        return await prisma.orderItem.findUnique({where: {id}});
    }

    async getAllOrderItems() {
        return await prisma.orderItem.findMany();
    }

    async updateOrderItem(id, data) {
        return await prisma.orderItem.update({where: {id}, data});
    }

    async deleteOrderItem(id) {
        return await prisma.orderItem.delete({where: {id}});
    }
}
