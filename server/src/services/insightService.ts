import { MEDICAL_DISCLAIMER } from "../constants/disclaimers";
import type { CheckInRepository } from "../repositories/CheckInRepository";
import type { InsightsRepository } from "../repositories/InsightsRepository";
import { createId } from "../utils/id";
import { calculateRiskScore } from "./riskService";
import { generateRecommendations } from "./recommendationService";
import { AiService } from "./aiService";
import type { CheckInEntry, InsightResponse, WellbeingInput } from "../types/wellbeing";

export class InsightService {
  constructor(
    private readonly checkInRepository: CheckInRepository,
    private readonly insightsRepository: InsightsRepository,
    private readonly aiService: AiService,
  ) {}

  async createInsight(wellbeingData: WellbeingInput): Promise<InsightResponse> {
    const assessment = calculateRiskScore(wellbeingData);
    const recommendations = generateRecommendations(assessment);
    const aiSummary = await this.aiService.generateWellbeingSummary(wellbeingData, assessment);

    const response: InsightResponse = {
      ...assessment,
      aiSummary,
      recommendations,
      disclaimer: MEDICAL_DISCLAIMER,
    };

    const createdAt = new Date().toISOString();
    const entry: CheckInEntry = {
      id: createId("checkin"),
      createdAt,
      wellbeingData,
      assessment,
      aiSummary,
      recommendations,
    };

    await this.checkInRepository.save(entry);
    await this.insightsRepository.save({
      id: createId("insight"),
      createdAt,
      wellbeingData,
      insight: response,
    });

    return response;
  }
}
