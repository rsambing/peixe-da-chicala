import { UserService } from '../services/user.service.js';

const userService = new UserService();

export class UserController
{
    async createUser(req, res)
    {
        try
        {
            const user = await userService.createUser(req.body);
            res.status(201).json(user);
        }
        catch (error)
        {
            res.status(400).json({ error: error.message });
        }
    }
async getUserById(req, res)
{
    try
    {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "ID inválido"
            });
        }

        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User found successfully",
            data: user
        });
    }
    catch (error)
    {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
    async getAllUsers(req, res)
    {
        try
        {
            const users = await userService.getAllUsers();
            res.json(users);
        }
        catch (error)
        {
            res.status(400).json({ error: error.message });
        }
    }
   async updateUser(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "ID inválido"
            });
        }

        const user = await userService.updateUser(id, req.body);

        res.json(user);

    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}
    async deleteUser(req, res)
    {
        try
        {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "ID inválido"
                });
            }


            await userService.deleteUser(id);
            res.status(204).send();
        }
        catch (error)
        {
            res.status(400).json({ error: error.message });
        }
    }   
}