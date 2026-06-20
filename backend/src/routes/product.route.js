import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { upload } from '../middlewares/upload-multer.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { createProductSchema, updateProductSchema } from '../schemas/validation.schemas.js';

const productRouter = Router();
const productController = new ProductController();

const auth = [authenticate, authorize('ADMIN', 'ATENDENTE')];

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
productRouter.get('/products', (req, res) => productController.getAllProducts(req, res));

/**
 * @openapi
 * /products/featured:
 *   get:
 *     summary: Listar produtos em destaque
 *     tags:
 *       - Produtos
 *     responses:
 *       200:
 *         description: Lista de produtos em destaque
 */
productRouter.get('/products/featured', (req, res) => productController.getFeaturedProducts(req, res));

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
 *       404:
 *         description: Produto não encontrado
 */
productRouter.get('/products/:id', (req, res) => productController.getProductById(req, res));

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Criar produto (admin)
 *     tags:
 *       - Produtos
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
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Produto criado
 */
productRouter.post(
  '/products',
  ...auth,
  upload.array('images', 10),
  validateRequest(createProductSchema),
  (req, res) => productController.createProduct(req, res)
);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Atualizar produto (admin)
 *     tags:
 *       - Produtos
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
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Produto atualizado
 */
productRouter.put(
  '/products/:id',
  ...auth,
  upload.array('images', 10),
  validateRequest(updateProductSchema),
  (req, res) => productController.updateProduct(req, res)
);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Eliminar produto (admin)
 *     tags:
 *       - Produtos
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
 *         description: Produto eliminado
 */
productRouter.delete(
  '/products/:id',
  ...auth,
  (req, res) => productController.deleteProduct(req, res)
);

/**
 * @openapi
 * /products/{id}/images/{imageId}:
 *   delete:
 *     summary: Eliminar imagem de produto (admin)
 *     tags:
 *       - Produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Imagem eliminada
 */
productRouter.delete(
  '/products/:id/images/:imageId',
  ...auth,
  (req, res) => productController.deleteProductImage(req, res)
);

export default productRouter;
