import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { loginSchema } from '../schemas/validation.schemas.js';

const authRouter = Router();
const authController = new AuthController();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autenticar utilizador
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna token JWT
 *       401:
 *         description: Credenciais inválidas
 */
authRouter.post('/auth/login', validateRequest(loginSchema), (req, res) => authController.login(req, res));

export default authRouter;
