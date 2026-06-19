import { Router } from 'express';
import { TestimonialController } from '../controllers/testimonial.controller.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { upload } from '../middlewares/upload-multer.js';

const testimonialRouter = Router();
const ctrl = new TestimonialController();

testimonialRouter.get('/testimonials', (req, res) => ctrl.getAll(req, res));

testimonialRouter.post(
  '/testimonials',
  authenticate,
  authorize('ADMIN'),
  upload.single('avatar'),
  (req, res) => ctrl.create(req, res)
);

testimonialRouter.put(
  '/testimonials/:id',
  authenticate,
  authorize('ADMIN'),
  upload.single('avatar'),
  (req, res) => ctrl.update(req, res)
);

testimonialRouter.delete(
  '/testimonials/:id',
  authenticate,
  authorize('ADMIN'),
  (req, res) => ctrl.delete(req, res)
);

export default testimonialRouter;
