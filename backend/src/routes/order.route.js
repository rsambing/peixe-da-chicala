import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { createOrderSchema, updateOrderSchema } from "../schemas/validation.schemas.js";

const orderRouter = Router();
const orderController = new OrderController();

/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Criar novo pedido (público)
 *     tags:
 *       - Pedidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerPhone
 *               - deliveryMethod
 *               - items
 *             properties:
 *               customerName:
 *                 type: string
 *               customerPhone:
 *                 type: string
 *               deliveryAddress:
 *                 type: string
 *               deliveryMethod:
 *                 type: string
 *                 enum: [ENTREGA, RETIRADA]
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *                     note:
 *                       type: string
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 */
orderRouter.post(
  '/orders',
  validateRequest(createOrderSchema),
  (req, res) => orderController.createOrder(req, res)
);

/**
 * @openapi
 * /orders/track/{code}:
 *   get:
 *     summary: Acompanhar pedido pelo código de rastreio (público)
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         example: PDC-138009
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
orderRouter.get(
  '/orders/track/:code',
  (req, res) => orderController.getOrderByTrackingCode(req, res)
);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     summary: Obter pedido por ID (admin)
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
orderRouter.get(
  '/orders/:id',
  authenticate,
  authorize('ADMIN', 'ATENDENTE'),
  (req, res) => orderController.getOrderById(req, res)
);

/**
 * @openapi
 * /orders:
 *   get:
 *     summary: Listar todos os pedidos (admin)
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
orderRouter.get(
  '/orders',
  authenticate,
  authorize('ADMIN', 'ATENDENTE'),
  (req, res) => orderController.getAllOrders(req, res)
);

/**
 * @openapi
 * /orders/{id}:
 *   put:
 *     summary: Atualizar estado do pedido (admin)
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [RECEBIDO, EM_PREPARACAO, SAIU_PARA_ENTREGA, ENTREGUE]
 *     responses:
 *       200:
 *         description: Pedido atualizado
 */
orderRouter.put(
  '/orders/:id',
  authenticate,
  authorize('ADMIN', 'ATENDENTE'),
  validateRequest(updateOrderSchema),
  (req, res) => orderController.updateOrder(req, res)
);

/**
 * @openapi
 * /orders/{id}:
 *   delete:
 *     summary: Eliminar pedido (admin)
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Pedido eliminado
 */
orderRouter.delete(
  '/orders/:id',
  authenticate,
  authorize('ADMIN', 'ATENDENTE'),
  (req, res) => orderController.deleteOrder(req, res)
);

export default orderRouter;
