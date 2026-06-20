import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { upload } from "../middlewares/upload-multer.js";
import { createCategorySchema, updateCategorySchema } from "../schemas/validation.schemas.js";

const categoryRouter = Router();
const categoryController = new CategoryController();

const auth = [authenticate, authorize('ADMIN', 'ATENDENTE')];

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Listar todas as categorias
 *     tags:
 *       - Categorias
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
categoryRouter.get('/categories', (req, res) => categoryController.getAllCategories(req, res));

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     summary: Obter categoria por ID
 *     tags:
 *       - Categorias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
categoryRouter.get('/categories/:id', (req, res) => categoryController.getCategoryById(req, res));

/**
 * @openapi
 * /categories:
 *   post:
 *     summary: Criar categoria (admin)
 *     tags:
 *       - Categorias
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
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Categoria criada
 */
categoryRouter.post(
  '/categories',
  ...auth,
  upload.single('image'),
  validateRequest(createCategorySchema),
  (req, res) => categoryController.createCategory(req, res)
);

/**
 * @openapi
 * /categories/{id}:
 *   put:
 *     summary: Atualizar categoria (admin)
 *     tags:
 *       - Categorias
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
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Categoria atualizada
 */
categoryRouter.put(
  '/categories/:id',
  ...auth,
  upload.single('image'),
  validateRequest(updateCategorySchema),
  (req, res) => categoryController.updateCategory(req, res)
);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     summary: Eliminar categoria (admin)
 *     tags:
 *       - Categorias
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
 *         description: Categoria eliminada
 */
categoryRouter.delete(
  '/categories/:id',
  ...auth,
  (req, res) => categoryController.deleteCategory(req, res)
);

export default categoryRouter;
