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
 *     summary: Criar nova encomenda
 *     tags:
 *       - Encomendas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trackingCode:
 *                 type: string
 *               customerName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               status:
 *                 type: string
 *               total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Encomenda criada com sucesso
 */
orderRouter.post(
  '/orders',
  authenticate,
  authorize('ADMIN', 'ATENDENTE'),
  validateRequest(createOrderSchema),
  (req, res) => orderController.createOrder(req, res)
);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     summary: Obter encomenda por ID
 *     tags:
 *       - Encomendas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Encomenda encontrada
 *       404:
 *         description: Encomenda não encontrada
 */
orderRouter.get('/orders/:id', (req, res) => orderController.getOrderById(req, res));

/**
 * @openapi
 * /orders:
 *   get:
 *     summary: Listar todas as encomendas
 *     tags:
 *       - Encomendas
 *     responses:
 *       200:
 *         description: Lista de encomendas
 */
orderRouter.get('/orders', (req, res) => orderController.getAllOrders(req, res));

/**
 * @openapi
 * /orders/{id}:
 *   put:
 *     summary: Atualizar encomenda
 *     tags:
 *       - Encomendas
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
 *         description: Encomenda atualizada com sucesso
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
 *     summary: Deletar encomenda
 *     tags:
 *       - Encomendas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Encomenda deletada com sucesso
 */
orderRouter.delete(
  '/orders/:id',
  authenticate,
  authorize('ADMIN', 'ATENDENTE'),
  (req, res) => orderController.deleteOrder(req, res)
);

export default orderRouter;
