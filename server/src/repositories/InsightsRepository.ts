import type { HealthProfile, InsightResponse, WellbeingInput } from "../types/wellbeing";

export interface StoredInsight {
  id: string;
  createdAt: string;
  wellbeingData: WellbeingInput;
  profile?: HealthProfile;
  insight: InsightResponse;
}

export interface InsightsRepository {
  save(insight: StoredInsight): Promise<StoredInsight>;
  findLatest(): Promise<StoredInsight | null>;
}
