import axios from 'axios';
import FormData from 'form-data';

export class ImgBBService {
  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file.buffer.toString('base64'));

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      return response.data.data.url;
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw new Error('Erro ao fazer upload da imagem');
    }
  }
}