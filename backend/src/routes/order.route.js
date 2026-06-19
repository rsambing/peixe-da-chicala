import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { createOrderSchema, updateOrderSchema } from "../schemas/validation.schemas.js";

const orderRouter = Router();
const orderController = new OrderController();

// Rota pública - clientes criam pedidos sem autenticação
orderRouter.post(
  '/orders',
  validateRequest(createOrderSchema),
  (req, res) => orderController.createOrder(req, res)
);

// Rota pública - clientes acompanham o seu pedido pelo código
// NOTA: deve vir antes de /orders/:id para "track" não ser interpretado como ID
orderRouter.get(
  '/orders/track/:code',
  (req, res) => orderController.getOrderByTrackingCode(req, res)
);

orderRouter.get(
  '/orders/:id',
  authenticate,
  authorize('ADMIN', 'ATENDENTE'),
  (req, res) => orderController.getOrderById(req, res)
);

orderRouter.get(
  '/orders',
  authenticate,
  authorize('ADMIN', 'ATENDENTE'),
  (req, res) => orderController.getAllOrders(req, res)
);

orderRouter.put(
  '/orders/:id',
  authenticate,
  authorize('ADMIN', 'ATENDENTE'),
  validateRequest(updateOrderSchema),
  (req, res) => orderController.updateOrder(req, res)
);

orderRouter.delete(
  '/orders/:id',
  authenticate,
  authorize('ADMIN', 'ATENDENTE'),
  (req, res) => orderController.deleteOrder(req, res)
);

export default orderRouter;
