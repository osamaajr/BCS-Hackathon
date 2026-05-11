import type { CheckInRepository } from "../repositories/CheckInRepository";
import type { WeeklyReport } from "../types/wellbeing";

export class ReportService {
  constructor(private readonly checkInRepository: CheckInRepository) {}

  async getMockWeeklyReport(): Promise<WeeklyReport> {
    return this.checkInRepository.getWeeklyReport();
  }
}
