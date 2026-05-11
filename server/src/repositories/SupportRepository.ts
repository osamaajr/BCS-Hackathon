import type { RiskLevel, SupportService } from "../types/wellbeing";

export interface SupportRepository {
  findByRiskLevel(riskLevel: RiskLevel): Promise<SupportService[]>;
}
