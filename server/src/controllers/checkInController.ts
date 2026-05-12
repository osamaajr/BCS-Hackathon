import type { Request, Response } from "express";
import type { CheckInService } from "../services/checkInService";

export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  getRecentHistory = async (_req: Request, res: Response): Promise<void> => {
    const history = await this.checkInService.getRecentHistory(7);
    res.status(200).json(history);
  };
}
