import { Router } from 'express';
import { SettingController } from '../controllers/setting.controller.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { upload } from '../middlewares/upload-multer.js';

const settingRouter = Router();
const settingController = new SettingController();

/**
 * @openapi
 * /settings:
 *   get:
 *     summary: Obter todas as configurações do site (público)
 *     tags:
 *       - Configurações
 *     responses:
 *       200:
 *         description: Mapa de chave-valor com as configurações
 */
settingRouter.get('/settings', (req, res) => settingController.getAll(req, res));

/**
 * @openapi
 * /settings/{key}:
 *   put:
 *     summary: Atualizar configuração por chave (admin)
 *     tags:
 *       - Configurações
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         example: hero_background
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Configuração atualizada
 */
settingRouter.put(
  '/settings/:key',
  authenticate,
  authorize('ADMIN'),
  upload.single('image'),
  (req, res) => settingController.update(req, res)
);

export default settingRouter;
