import prisma from "../lib/prisma.js";

export class OrderService {
    async createOrder(data) {
        return await prisma.order.create({data});
    }

    async getOrderById(id) {
        return await prisma.order.findUnique({where: {id}});
    }

    async getAllOrders() {
        return await prisma.order.findMany();
    }

    async updateOrder(id, data) {
        return await prisma.order.update({where: {id}, data});
    }

    async deleteOrder(id) {
        return await prisma.order.delete({where: {id}});
    }
}
