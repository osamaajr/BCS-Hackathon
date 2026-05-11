import type { SupportRepository } from "../repositories/SupportRepository";
import type { RiskLevel, SupportService } from "../types/wellbeing";

export class SupportServiceLayer {
  constructor(private readonly supportRepository: SupportRepository) {}

  async getSupportServices(riskLevel: RiskLevel): Promise<SupportService[]> {
    return this.supportRepository.findByRiskLevel(riskLevel);
  }
}
