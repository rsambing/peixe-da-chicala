import prisma from '../lib/prisma.js';
import { ImgBBService } from './imgbb.service.js';
const imgbbService = new ImgBBService();

const DEFAULTS = {
  heroImageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2200&q=80',
  heroImageDeleteUrl: '',
  loginBgUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2200&q=80',
  loginBgDeleteUrl: '',
  howItWorksStep1ImageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
  howItWorksStep1ImageDeleteUrl: '',
  howItWorksStep2ImageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
  howItWorksStep2ImageDeleteUrl: '',
  howItWorksStep3ImageUrl: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80',
  howItWorksStep3ImageDeleteUrl: '',
  sobreImageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
  sobreImageDeleteUrl: '',
  contactPhone: '(+244) 9XX XXX XXX',
  contactWhatsapp: '244900000000',
  contactEmail: 'contacto@peixedachicala.ao',
  contactAddress: 'Chicala, Luanda, Angola',
  contactHours: 'Segunda a Domingo · 11h – 22h',
  contactMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.7926625315554!2d13.2195114!3d-8.805540099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f359b0e34c9f%3A0x923f6dfbbaa7dce7!2sPeixe%20da%20Chicala!5e0!3m2!1spt-PT!2sao!4v1781841659933!5m2!1spt-PT!2sao',
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
