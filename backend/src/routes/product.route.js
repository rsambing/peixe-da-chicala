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

// Public
productRouter.get('/products', (req, res) => productController.getAllProducts(req, res));
productRouter.get('/products/featured', (req, res) => productController.getFeaturedProducts(req, res));
productRouter.get('/products/:id', (req, res) => productController.getProductById(req, res));

// Protected — support multiple images via field name "images"
productRouter.post(
  '/products',
  ...auth,
  upload.array('images', 10),
  validateRequest(createProductSchema),
  (req, res) => productController.createProduct(req, res)
);

productRouter.put(
  '/products/:id',
  ...auth,
  upload.array('images', 10),
  validateRequest(updateProductSchema),
  (req, res) => productController.updateProduct(req, res)
);

productRouter.delete(
  '/products/:id',
  ...auth,
  (req, res) => productController.deleteProduct(req, res)
);

// Delete a single product image
productRouter.delete(
  '/products/:id/images/:imageId',
  ...auth,
  (req, res) => productController.deleteProductImage(req, res)
);

export default productRouter;
