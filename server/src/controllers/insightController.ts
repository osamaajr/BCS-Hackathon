import type { Request, Response } from "express";
import type { InsightService } from "../services/insightService";
import { validateWellbeingInput } from "../utils/validation";

export class InsightController {
  constructor(private readonly insightService: InsightService) {}

  createInsight = async (req: Request, res: Response): Promise<void> => {
    const wellbeingData = validateWellbeingInput(req.body?.wellbeingData);
    const insight = await this.insightService.createInsight(wellbeingData);

    res.status(200).json(insight);
  };
}
