import type { Request, Response } from "express";
import type { ReportService } from "../services/reportService";

export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  getMockWeeklyReport = async (_req: Request, res: Response): Promise<void> => {
    const report = await this.reportService.getMockWeeklyReport();
    res.status(200).json(report);
  };
}
