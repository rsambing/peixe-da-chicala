import axios from 'axios';

const ZEXA_BASE_URL = process.env.ZEXA_API_URL || 'https://api.zexa.ao/api/v1';
const REQUEST_TIMEOUT_MS = 6000;

export class ZexaService {
    _headers() {
        return {
            'x-api-key': process.env.ZEXA_API_KEY,
            'Content-Type': 'application/json'
        };
    }

    async sendSms({ recipient, body, isOtp = false })
    {
        if (!process.env.ZEXA_API_KEY)
        {
            console.warn('ZEXA_API_KEY ausente — SMS não enviado (no-op).');
            return null;
        }

        try
        {
            const response = await axios.post(
                `${ZEXA_BASE_URL}/sms/send`,
                { recipient, body, type: 'SMS', isOtp },
                { headers: this._headers(), timeout: REQUEST_TIMEOUT_MS }
            );

            return response.data;
        }
        catch(error)
        {
            console.error('ZEXA SEND SMS ERROR:', error.response?.data || error.message);
            throw new Error('Falha ao enviar SMS');
        }
    }

    async sendBulkSms({ recipients, body })
    {
        if (!process.env.ZEXA_API_KEY)
        {
            console.warn('ZEXA_API_KEY ausente — SMS em massa não enviado (no-op).');
            return null;
        }

        try
        {
            const response = await axios.post(
                `${ZEXA_BASE_URL}/sms/send-bulk`,
                { recipients, body, type: 'SMS' },
                { headers: this._headers(), timeout: REQUEST_TIMEOUT_MS }
            );

            return response.data;
        }
        catch(error)
        {
            console.error('ZEXA SEND BULK SMS ERROR:', error.response?.data || error.message);
            throw new Error('Falha ao enviar SMS em massa');
        }
    }

    async createCampaign({ campaignName, audience, message, scheduledAt, metadata })
    {
        if (!process.env.ZEXA_API_KEY)
        {
            console.warn('ZEXA_API_KEY ausente — campanha não enviada (no-op).');
            return null;
        }

        try
        {
            const response = await axios.post(
                `${ZEXA_BASE_URL}/sms/campaigns`,
                { campaignName, channel: 'SMS', audience, message, scheduledAt, metadata },
                { headers: this._headers(), timeout: REQUEST_TIMEOUT_MS }
            );

            return response.data;
        }
        catch(error)
        {
            console.error('ZEXA CREATE CAMPAIGN ERROR:', error.response?.data || error.message);
            throw new Error('Falha ao criar campanha SMS');
        }
    }
}
