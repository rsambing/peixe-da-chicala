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

// Public
categoryRouter.get('/categories', (req, res) => categoryController.getAllCategories(req, res));
categoryRouter.get('/categories/:id', (req, res) => categoryController.getCategoryById(req, res));

// Protected
categoryRouter.post(
  '/categories',
  ...auth,
  upload.single('image'),
  validateRequest(createCategorySchema),
  (req, res) => categoryController.createCategory(req, res)
);

categoryRouter.put(
  '/categories/:id',
  ...auth,
  upload.single('image'),
  validateRequest(updateCategorySchema),
  (req, res) => categoryController.updateCategory(req, res)
);

categoryRouter.delete(
  '/categories/:id',
  ...auth,
  (req, res) => categoryController.deleteCategory(req, res)
);

export default categoryRouter;
