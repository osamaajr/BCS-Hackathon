import { supportServicesByRiskLevel } from "../data/supportServices";
import type { SupportRepository } from "./SupportRepository";
import type { RiskLevel, SupportService } from "../types/wellbeing";

export class MockSupportRepository implements SupportRepository {
  async findByRiskLevel(riskLevel: RiskLevel): Promise<SupportService[]> {
    return supportServicesByRiskLevel[riskLevel] ?? supportServicesByRiskLevel.Low;
  }
}
