import { Router } from 'express';
import { SettingController } from '../controllers/setting.controller.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { upload } from '../middlewares/upload-multer.js';

const settingRouter = Router();
const settingController = new SettingController();

// Public — frontend reads hero/login backgrounds without auth
settingRouter.get('/settings', (req, res) => settingController.getAll(req, res));

// Protected — admin changes backgrounds
settingRouter.put(
  '/settings/:key',
  authenticate,
  authorize('ADMIN'),
  upload.single('image'),
  (req, res) => settingController.update(req, res)
);

export default settingRouter;
