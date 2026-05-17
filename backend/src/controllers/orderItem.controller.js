import { OrderItemService } from "../services/orderItem.service.js";

const orderItemService = new OrderItemService();

export class OrderItemController {
    async createOrderItem(req, res) {
        try {
            const orderItem = await orderItemService.createOrderItem(req.body);
            res.status(201).json(orderItem);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getOrderItemById(req, res) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const orderItem = await orderItemService.getOrderItemById(id);
            res.status(200).json(orderItem);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async getAllOrderItems(req, res) {
        try {
            const orderItems = await orderItemService.getAllOrderItems();
            res.status(200).json(orderItems);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateOrderItem(req, res) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const orderItem = await orderItemService.updateOrderItem(id, req.body);
            res.status(200).json(orderItem);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteOrderItem(req, res) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            await orderItemService.deleteOrderItem(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
