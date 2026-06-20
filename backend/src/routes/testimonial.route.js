import { Router } from 'express';
import { TestimonialController } from '../controllers/testimonial.controller.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { upload } from '../middlewares/upload-multer.js';

const testimonialRouter = Router();
const ctrl = new TestimonialController();

/**
 * @openapi
 * /testimonials:
 *   get:
 *     summary: Listar todos os testemunhos (público)
 *     tags:
 *       - Testemunhos
 *     responses:
 *       200:
 *         description: Lista de testemunhos
 */
testimonialRouter.get('/testimonials', (req, res) => ctrl.getAll(req, res));

/**
 * @openapi
 * /testimonials:
 *   post:
 *     summary: Criar testemunho (admin)
 *     tags:
 *       - Testemunhos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               text:
 *                 type: string
 *               rating:
 *                 type: integer
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Testemunho criado
 */
testimonialRouter.post(
  '/testimonials',
  authenticate,
  authorize('ADMIN'),
  upload.single('avatar'),
  (req, res) => ctrl.create(req, res)
);

/**
 * @openapi
 * /testimonials/{id}:
 *   put:
 *     summary: Atualizar testemunho (admin)
 *     tags:
 *       - Testemunhos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               text:
 *                 type: string
 *               rating:
 *                 type: integer
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Testemunho atualizado
 */
testimonialRouter.put(
  '/testimonials/:id',
  authenticate,
  authorize('ADMIN'),
  upload.single('avatar'),
  (req, res) => ctrl.update(req, res)
);

/**
 * @openapi
 * /testimonials/{id}:
 *   delete:
 *     summary: Eliminar testemunho (admin)
 *     tags:
 *       - Testemunhos
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
 *         description: Testemunho eliminado
 */
testimonialRouter.delete(
  '/testimonials/:id',
  authenticate,
  authorize('ADMIN'),
  (req, res) => ctrl.delete(req, res)
);

export default testimonialRouter;
