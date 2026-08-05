import prisma from '../lib/prisma.js';
import { ZexaService } from './zexa.service.js';
import { normalizePhone, isValidAngolanMobile, toZexaRecipient } from '../lib/phone.js';

const zexaService = new ZexaService();

export class SmsCampaignService {
    async listRegions()
    {
        const rows = await prisma.order.findMany({
            where: { region: { not: null } },
            select: { region: true },
            distinct: ['region'],
            orderBy: { region: 'asc' },
        });

        return rows.map((r) => r.region).filter(Boolean);
    }

    async _resolveRecipients({ audienceType, region })
    {
        const where = audienceType === 'REGION' ? { region } : {};
        const rows = await prisma.order.findMany({ where, select: { phone: true } });

        const set = new Set();
        for (const row of rows)
        {
            const normalized = normalizePhone(row.phone);
            if (isValidAngolanMobile(normalized)) set.add(normalized);
        }

        return Array.from(set);
    }

    async previewAudience({ audienceType, region })
    {
        const recipients = await this._resolveRecipients({ audienceType, region });
        return { count: recipients.length };
    }

    async createAndSendCampaign({ name, message, audienceType, region, createdById })
    {
        const recipients = await this._resolveRecipients({ audienceType, region });
        if (recipients.length === 0)
        {
            throw new Error('Nenhum destinatário válido encontrado para esta audiência');
        }

        try
        {
            const result = await zexaService.createCampaign({
                campaignName: name,
                audience: recipients.map(toZexaRecipient),
                message,
            });

            return await prisma.smsCampaign.create({
                data: {
                    name,
                    message,
                    audienceType,
                    region: region ?? null,
                    recipientCount: recipients.length,
                    status: result?.status ?? 'QUEUED',
                    zexaCampaignId: result?.campaignId ?? null,
                    createdById: createdById ?? null,
                },
                include: { createdBy: { select: { id: true, name: true } } },
            });
        }
        catch(error)
        {
            await prisma.smsCampaign.create({
                data: {
                    name,
                    message,
                    audienceType,
                    region: region ?? null,
                    recipientCount: recipients.length,
                    status: 'FAILED',
                    createdById: createdById ?? null,
                },
            });
            throw new Error('Falha ao enviar campanha SMS');
        }
    }

    async listCampaigns()
    {
        return prisma.smsCampaign.findMany({
            orderBy: { createdAt: 'desc' },
            include: { createdBy: { select: { id: true, name: true } } },
        });
    }
}
