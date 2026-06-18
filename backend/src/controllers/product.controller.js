import { ProductService } from '../services/product.service.js';

const productService = new ProductService();

export class ProductController {
  async createProduct(req, res) {
    try {
      const files = req.files ?? (req.file ? [req.file] : []);
      const product = await productService.createProduct(req.body, files);
      return res.status(201).json(product);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      const product = await productService.getProductById(id);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
      res.status(200).json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getFeaturedProducts(req, res) {
    try {
      const products = await productService.getFeaturedProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      const files = req.files ?? (req.file ? [req.file] : []);
      const product = await productService.updateProduct(id, req.body, files);
      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProductImage(req, res) {
    try {
      const imageId = Number(req.params.imageId);
      if (isNaN(imageId)) return res.status(400).json({ error: 'ID inválido' });
      await productService.deleteProductImage(imageId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      await productService.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
}
