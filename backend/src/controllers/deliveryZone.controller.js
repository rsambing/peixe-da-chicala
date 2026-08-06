import { DeliveryZoneService } from "../services/deliveryZone.service.js";

const deliveryZoneService = new DeliveryZoneService();

export class DeliveryZoneController {
  async createZone(req, res) {
    try {
      const zone = await deliveryZoneService.createZone(req.body);
      res.status(201).json(zone);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllZones(req, res) {
    try {
      const zones = await deliveryZoneService.getAllZones();
      res.status(200).json(zones);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateZone(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      const zone = await deliveryZoneService.updateZone(id, req.body);
      res.status(200).json(zone);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteZone(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      await deliveryZoneService.deleteZone(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
