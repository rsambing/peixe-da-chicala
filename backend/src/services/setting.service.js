import prisma from '../lib/prisma.js';
import { ImgBBService } from './imgbb.service.js';
const imgbbService = new ImgBBService();

const DEFAULTS = {
  heroImageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2200&q=80',
  heroImageDeleteUrl: '',
  loginBgUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2200&q=80',
  loginBgDeleteUrl: '',
};

export class SettingService {
  async getAll() {
    const rows = await prisma.siteSetting.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    // merge with defaults so keys always exist
    return { ...DEFAULTS, ...map };
  }

  async set(key, value) {
    return prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async setImage(key, file) {
    const deleteKey = `${key}DeleteUrl`;

    // delete old image from ImgBB if present
    const existing = await prisma.siteSetting.findUnique({ where: { key: deleteKey } });
    if (existing?.value) {
      await imgbbService.deleteImage(existing.value).catch(() => {});
    }

    const { imageUrl, deleteUrl } = await imgbbService.uploadImage(file);

    await this.set(key, imageUrl);
    await this.set(deleteKey, deleteUrl);

    return imageUrl;
  }
}
