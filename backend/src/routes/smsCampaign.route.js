import { Router } from "express";
import { SmsCampaignController } from "../controllers/smsCampaign.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { createSmsCampaignSchema } from "../schemas/validation.schemas.js";

const smsCampaignRouter = Router();
const smsCampaignController = new SmsCampaignController();

const auth = [authenticate, authorize('ADMIN')];

/**
 * @openapi
 * /sms-campaigns/regions:
 *   get:
 *     summary: Listar regiões com pedidos (para filtrar campanhas) (admin)
 *     tags:
 *       - Mensagens SMS
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de regiões
 */
smsCampaignRouter.get('/sms-campaigns/regions', ...auth, (req, res) => smsCampaignController.getRegions(req, res));

/**
 * @openapi
 * /sms-campaigns/preview:
 *   get:
 *     summary: Pré-visualizar número de destinatários de uma campanha (admin)
 *     tags:
 *       - Mensagens SMS
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: audienceType
 *         schema:
 *           type: string
 *           enum: [ALL, REGION]
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contagem de destinatários
 */
smsCampaignRouter.get('/sms-campaigns/preview', ...auth, (req, res) => smsCampaignController.preview(req, res));

/**
 * @openapi
 * /sms-campaigns:
 *   get:
 *     summary: Listar histórico de campanhas SMS (admin)
 *     tags:
 *       - Mensagens SMS
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de campanhas
 */
smsCampaignRouter.get('/sms-campaigns', ...auth, (req, res) => smsCampaignController.list(req, res));

/**
 * @openapi
 * /sms-campaigns:
 *   post:
 *     summary: Criar e enviar campanha SMS (admin)
 *     tags:
 *       - Mensagens SMS
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - message
 *               - audienceType
 *             properties:
 *               name:
 *                 type: string
 *               message:
 *                 type: string
 *               audienceType:
 *                 type: string
 *                 enum: [ALL, REGION]
 *               region:
 *                 type: string
 *     responses:
 *       201:
 *         description: Campanha criada e enviada
 */
smsCampaignRouter.post(
  '/sms-campaigns',
  ...auth,
  validateRequest(createSmsCampaignSchema),
  (req, res) => smsCampaignController.create(req, res)
);

export default smsCampaignRouter;
