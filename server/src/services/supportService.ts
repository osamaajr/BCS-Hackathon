import type { SupportRepository } from "../repositories/SupportRepository";
import { getRecommendedResources } from "./resourceRecommendationService";
import type { HealthProfile, RecommendedResource, RiskLevel, SupportService, WellbeingInput } from "../types/wellbeing";

export class SupportServiceLayer {
  constructor(private readonly supportRepository: SupportRepository) {}

  async getSupportServices(riskLevel: RiskLevel): Promise<SupportService[]> {
    return this.supportRepository.findByRiskLevel(riskLevel);
  }

  async getRecommendedResources(profile: HealthProfile, latestCheckIn?: WellbeingInput): Promise<RecommendedResource[]> {
    return getRecommendedResources(profile, latestCheckIn);
  }
}
