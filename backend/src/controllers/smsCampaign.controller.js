import { SmsCampaignService } from "../services/smsCampaign.service.js";

const smsCampaignService = new SmsCampaignService();

export class SmsCampaignController {
    async getRegions(req, res) {
        try {
            const regions = await smsCampaignService.listRegions();
            res.status(200).json(regions);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async preview(req, res) {
        try {
            const { audienceType, region } = req.query;
            const result = await smsCampaignService.previewAudience({ audienceType, region });
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const campaign = await smsCampaignService.createAndSendCampaign({
                ...req.body,
                createdById: req.user?.id,
            });
            res.status(201).json(campaign);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async list(req, res) {
        try {
            const campaigns = await smsCampaignService.listCampaigns();
            res.status(200).json(campaigns);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
