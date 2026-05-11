import type { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import type { SupportServiceLayer } from "../services/supportService";
import type { RiskLevel } from "../types/wellbeing";

const riskLevels: RiskLevel[] = ["Low", "Moderate", "High"];

export class SupportController {
  constructor(private readonly supportService: SupportServiceLayer) {}

  getSupportServices = async (req: Request, res: Response): Promise<void> => {
    const param = req.params.riskLevel;
    const riskLevel = normalizeRiskLevel(Array.isArray(param) ? param[0] : param);
    const services = await this.supportService.getSupportServices(riskLevel);

    res.status(200).json({
      riskLevel,
      services,
    });
  };
}

function normalizeRiskLevel(value: string | undefined): RiskLevel {
  const match = riskLevels.find((level) => level.toLowerCase() === value?.toLowerCase());
  if (!match) {
    throw new ApiError(400, "riskLevel must be Low, Moderate, or High.");
  }

  return match;
}
