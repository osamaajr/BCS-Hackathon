import type { Request, Response } from "express";
import type { InsightService } from "../services/insightService";
import { validateEnvironmentalContext, validateHealthProfile, validateWellbeingInput } from "../utils/validation";

export class InsightController {
  constructor(private readonly insightService: InsightService) {}

  createInsight = async (req: Request, res: Response): Promise<void> => {
    const wellbeingData = validateWellbeingInput(req.body?.wellbeingData);
    const profile = validateHealthProfile(req.body?.profile);
    const environmentalContext = validateEnvironmentalContext(req.body?.environmentalContext);
    const insight = await this.insightService.createInsight(wellbeingData, profile, environmentalContext);

    res.status(200).json(insight);
  };
}
