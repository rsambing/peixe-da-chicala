import { ProductService } from "../services/product.service.js";
const productService = new ProductService();

export class ProductController
{
    async createProduct(req, res)
    {
        try
        {
            const product = await productService.createProduct(req.body);
            res.status(201).json(product);
        }
        catch (error)
        {
            res.status(400).json({ error: error.message });
        }
    }
    async getProductById(req, res)
    {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const product = await productService.getProductById(id);
            res.status(200).json(product);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async getAllProducts(req, res)
    {
        try {
            const products = await productService.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updateProduct(req, res)
    {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            const product = await productService.updateProduct(id, req.body);
            res.status(200).json(product);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async deleteProduct(req, res)
    {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            await productService.deleteProduct(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}