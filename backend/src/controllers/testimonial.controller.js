import { TestimonialService } from '../services/testimonial.service.js';

const svc = new TestimonialService();

export class TestimonialController {
  async getAll(req, res) {
    try {
      res.json(await svc.getAll());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      res.status(201).json(await svc.create(req.body, req.file));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      res.json(await svc.update(parseInt(req.params.id), req.body, req.file));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await svc.delete(parseInt(req.params.id));
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
