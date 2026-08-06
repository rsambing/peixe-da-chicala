import { Router } from "express";
import { DeliveryZoneController } from "../controllers/deliveryZone.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { createDeliveryZoneSchema, updateDeliveryZoneSchema } from "../schemas/validation.schemas.js";

const deliveryZoneRouter = Router();
const deliveryZoneController = new DeliveryZoneController();

const auth = [authenticate, authorize('ADMIN', 'GESTOR')];

/**
 * @openapi
 * /delivery-zones:
 *   get:
 *     summary: Listar zonas de entrega (público)
 *     tags:
 *       - Zonas de Entrega
 *     responses:
 *       200:
 *         description: Lista de zonas de entrega
 */
deliveryZoneRouter.get('/delivery-zones', (req, res) => deliveryZoneController.getAllZones(req, res));

/**
 * @openapi
 * /delivery-zones:
 *   post:
 *     summary: Criar zona de entrega (admin)
 *     tags:
 *       - Zonas de Entrega
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               feeKz:
 *                 type: number
 *     responses:
 *       201:
 *         description: Zona de entrega criada
 */
deliveryZoneRouter.post(
  '/delivery-zones',
  ...auth,
  validateRequest(createDeliveryZoneSchema),
  (req, res) => deliveryZoneController.createZone(req, res)
);

/**
 * @openapi
 * /delivery-zones/{id}:
 *   put:
 *     summary: Atualizar zona de entrega (admin)
 *     tags:
 *       - Zonas de Entrega
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
 *         description: Zona de entrega atualizada
 */
deliveryZoneRouter.put(
  '/delivery-zones/:id',
  ...auth,
  validateRequest(updateDeliveryZoneSchema),
  (req, res) => deliveryZoneController.updateZone(req, res)
);

/**
 * @openapi
 * /delivery-zones/{id}:
 *   delete:
 *     summary: Eliminar zona de entrega (admin)
 *     tags:
 *       - Zonas de Entrega
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
 *         description: Zona de entrega eliminada
 */
deliveryZoneRouter.delete(
  '/delivery-zones/:id',
  ...auth,
  (req, res) => deliveryZoneController.deleteZone(req, res)
);

export default deliveryZoneRouter;
