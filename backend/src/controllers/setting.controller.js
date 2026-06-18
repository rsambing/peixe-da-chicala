import { SettingService } from '../services/setting.service.js';

const settingService = new SettingService();

export class SettingController {
  async getAll(req, res) {
    try {
      const settings = await settingService.getAll();
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const { key } = req.params;

      if (req.file) {
        const imageUrl = await settingService.setImage(key, req.file);
        return res.json({ key, value: imageUrl });
      }

      const { value } = req.body;
      if (value === undefined) {
        return res.status(400).json({ error: 'Provide value or image file' });
      }

      const setting = await settingService.set(key, value);
      res.json(setting);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
