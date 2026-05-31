import { Router } from "express";
import { OrderItemController } from "../controllers/orderItem.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { createOrderItemSchema, updateOrderItemSchema } from "../schemas/validation.schemas.js";

const orderItemRouter = Router();
const orderItemController = new OrderItemController();

/**
 * @openapi
 * /order-items:
 *   post:
 *     summary: Criar novo item de encomenda
 *     tags:
 *       - Itens de Encomenda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: integer
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Item de encomenda criado com sucesso
 */
orderItemRouter.post('/order-items', authenticate, authorize('ADMIN', 'ATENDENTE'), validateRequest(createOrderItemSchema), (req, res) => orderItemController.createOrderItem(req, res));

/**
 * @openapi
 * /order-items/{id}:
 *   get:
 *     summary: Obter item de encomenda por ID
 *     tags:
 *       - Itens de Encomenda
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item de encomenda encontrado
 *       404:
 *         description: Item de encomenda não encontrado
 */
orderItemRouter.get('/order-items/:id', authenticate, authorize('ADMIN', 'ATENDENTE'), (req, res) => orderItemController.getOrderItemById(req, res));

/**
 * @openapi
 * /order-items:
 *   get:
 *     summary: Listar todos os itens de encomenda
 *     tags:
 *       - Itens de Encomenda
 *     responses:
 *       200:
 *         description: Lista de itens de encomenda
 */
orderItemRouter.get('/order-items', authenticate, authorize('ADMIN', 'ATENDENTE'), (req, res) => orderItemController.getAllOrderItems(req, res));

/**
 * @openapi
 * /order-items/{id}:
 *   put:
 *     summary: Atualizar item de encomenda
 *     tags:
 *       - Itens de Encomenda
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Item de encomenda atualizado com sucesso
 */
orderItemRouter.put('/order-items/:id', authenticate, authorize('ADMIN', 'ATENDENTE'), validateRequest(updateOrderItemSchema), (req, res) => orderItemController.updateOrderItem(req, res));

/**
 * @openapi
 * /order-items/{id}:
 *   delete:
 *     summary: Deletar item de encomenda
 *     tags:
 *       - Itens de Encomenda
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Item de encomenda deletado com sucesso
 */
orderItemRouter.delete('/order-items/:id', authenticate, authorize('ADMIN'), (req, res) => orderItemController.deleteOrderItem(req, res));

export default orderItemRouter;
