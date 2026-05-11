import type { InsightResponse, WellbeingInput } from "../types/wellbeing";

export interface StoredInsight {
  id: string;
  createdAt: string;
  wellbeingData: WellbeingInput;
  insight: InsightResponse;
}

export interface InsightsRepository {
  save(insight: StoredInsight): Promise<StoredInsight>;
  findLatest(): Promise<StoredInsight | null>;
}
