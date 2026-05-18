import { CategoryService } from "../services/category.service.js";
const categoryService = new CategoryService();

export class CategoryController
{
    async createCategory(req, res)
    {
        try
        {
            const category = await categoryService.createCategory(req.body);
            res.status(201).json(category);
        }
        catch (error)
        {
            res.status(400).json({ error: error.message });
        }
    }
    async getCategoryById(req, res)
    {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const category = await categoryService.getCategoryById(id);
            res.status(200).json(category);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async getAllCategories(req, res)
    {
        try {
            const categories = await categoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updateCategory(req, res)
    {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const category = await categoryService.updateCategory(id, req.body);
            res.status(200).json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async deleteCategory(req, res)
    {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            await categoryService.deleteCategory(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}