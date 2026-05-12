import { MEDICAL_DISCLAIMER } from "../constants/disclaimers";
import type { CheckInRepository } from "../repositories/CheckInRepository";
import type { InsightsRepository } from "../repositories/InsightsRepository";
import { createId } from "../utils/id";
import { calculateWellnessScore } from "./wellnessScoringService";
import { generateRecommendations } from "./recommendationService";
import { AiService } from "./aiService";
import type { CheckInEntry, EnvironmentalContext, HealthProfile, InsightResponse, WellbeingInput } from "../types/wellbeing";

export class InsightService {
  constructor(
    private readonly checkInRepository: CheckInRepository,
    private readonly insightsRepository: InsightsRepository,
    private readonly aiService: AiService,
  ) {}

  async createInsight(wellbeingData: WellbeingInput, profile?: HealthProfile, environmentalContext?: EnvironmentalContext): Promise<InsightResponse> {
    const assessment = calculateWellnessScore(wellbeingData, profile);
    const recommendations = generateRecommendations(assessment, profile);
    const aiSummary = await this.aiService.generateWellbeingSummary(wellbeingData, assessment, profile, environmentalContext);

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
      profile,
      environmentalContext,
      assessment,
      aiSummary,
      recommendations,
    };

    await this.checkInRepository.save(entry);
    await this.insightsRepository.save({
      id: createId("insight"),
      createdAt,
      wellbeingData,
      profile,
      insight: response,
    });

    return response;
  }
}
