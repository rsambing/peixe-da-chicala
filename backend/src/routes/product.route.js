import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { upload } from '../middlewares/upload-multer.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { createProductSchema, updateProductSchema } from '../schemas/validation.schemas.js';

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 */
productRouter.post(
  '/products',
  authenticate,
  authorize('ADMIN', 'ATENDENTE'),
  upload.single('image'),
  validateRequest(createProductSchema),
  productController.createProduct
);

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
productRouter.get(
  '/products/:id',
  productController.getProductById
);

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
productRouter.get(
  '/products',
  productController.getAllProducts
);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Atualizar produto
 *     tags:
 *       - Produtos
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
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto atualizado
 */
productRouter.put(
  '/products/:id',
  authenticate,
  authorize('ADMIN', 'ATENDENTE'),
  upload.single('image'),
  validateRequest(updateProductSchema),
  productController.updateProduct
);

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
productRouter.delete(
  '/products/:id',
  authenticate,
  authorize('ADMIN', 'ATENDENTE'),
  productController.deleteProduct
);

export default productRouter;