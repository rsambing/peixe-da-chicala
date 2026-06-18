import { OrderService } from "../services/order.service.js";

const orderService = new OrderService();

export class OrderController {
    async createOrder(req, res) {
        try {
            const order = await orderService.createOrder(req.body);
            res.status(201).json(order);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getOrderByTrackingCode(req, res) {
        try {
            const order = await orderService.getOrderByTrackingCode(req.params.code);
            res.status(200).json(order);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async getOrderById(req, res) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const order = await orderService.getOrderById(id);
            if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
            res.status(200).json(order);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async getAllOrders(req, res) {
        try {
            const orders = await orderService.getAllOrders();
            res.status(200).json(orders);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateOrder(req, res) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const order = await orderService.updateOrder(id, req.body);
            res.status(200).json(order);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteOrder(req, res) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            await orderService.deleteOrder(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
