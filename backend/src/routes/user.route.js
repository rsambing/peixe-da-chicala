import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
const userRouter = Router();
const userController = new UserController();

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Criar novo utilizador
 *     tags:
 *       - Utilizadores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilizador criado com sucesso
 */
userRouter.post('/users',userController.createUser);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Obter utilizador por ID
 *     tags:
 *       - Utilizadores
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilizador encontrado
 */
userRouter.get('/users/:id',userController.getUserById);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Listar todos os utilizadores
 *     tags:
 *       - Utilizadores
 *     responses:
 *       200:
 *         description: Lista de utilizadores
 */
userRouter.get('/users',userController.getAllUsers);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Atualizar utilizador
 *     tags:
 *       - Utilizadores
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
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilizador atualizado
 */
userRouter.put('/users/:id',userController.updateUser);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Eliminar utilizador
 *     tags:
 *       - Utilizadores
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Utilizador eliminado
 */
userRouter.delete('/users/:id',userController.deleteUser);

export default userRouter;