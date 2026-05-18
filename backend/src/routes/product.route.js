import {Router} from 'express';
import { ProductController } from '../controllers/product.controller.js';
const productRouter = Router();
const productController = new ProductController();

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Criar novo produto
 *     tags:
 *       - Produtos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 */
productRouter.post('/products',productController.createProduct);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Obter produto por ID
 *     tags:
 *       - Produtos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto encontrado
 */
productRouter.get('/products/:id',productController.getProductById);

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Listar todos os produtos
 *     tags:
 *       - Produtos
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
productRouter.get('/products',productController.getAllProducts);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Atualizar produto
 *     tags:
 *       - Produtos
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produto atualizado
 */
productRouter.put('/products/:id',productController.updateProduct);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Eliminar produto
 *     tags:
 *       - Produtos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Produto eliminado
 */
productRouter.delete('/products/:id',productController.deleteProduct);

export default productRouter;