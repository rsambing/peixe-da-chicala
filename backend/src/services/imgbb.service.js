import axios from 'axios';
import FormData from 'form-data';

export class ImgBBService
{
    async uploadImage(file)
    {
        try
        {
            const formData = new FormData();

            formData.append(
                'image',
                file.buffer.toString('base64')
            );

            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
                formData,
                {
                    headers: formData.getHeaders()
                }
            );

            return {
                imageUrl: response.data.data.url,
                deleteUrl: response.data.data.delete_url
            };
        }
        catch(error)
        {
            console.error(
                'IMGBB UPLOAD ERROR:',
                error.response?.data || error.message
            );

            throw new Error('Error the send image to ImgBB');
        }
    }

    async deleteImage(deleteUrl)
    {
        try
        {
            if(!deleteUrl)
            {
                return;
            }

            await axios.get(deleteUrl);

            console.log('Img deleted from ImgBB');
        }
        catch(error)
        {
            console.error(
                'IMGBB DELETE ERROR:',
                error.response?.data || error.message
            );
        }
    }
}