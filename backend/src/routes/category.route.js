import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";

const categoryRouter = Router();
const categoryController = new CategoryController();

/**
 * @openapi
 * /categories:
 *   post:
 *     summary: Criar nova categoria
 *     tags:
 *       - Categorias
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 */
categoryRouter.post('/categories', categoryController.createCategory);

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
 */
categoryRouter.get('/categories/:id', categoryController.getCategoryById);

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
categoryRouter.get('/categories', categoryController.getAllCategories);

/**
 * @openapi
 * /categories/{id}:
 *   put:
 *     summary: Atualizar categoria
 *     tags:
 *       - Categorias
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
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoria atualizada
 */
categoryRouter.put('/categories/:id', categoryController.updateCategory);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     summary: Eliminar categoria
 *     tags:
 *       - Categorias
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
categoryRouter.delete('/categories/:id', categoryController.deleteCategory);

export default categoryRouter;