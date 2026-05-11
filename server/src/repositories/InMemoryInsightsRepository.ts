import type { InsightsRepository, StoredInsight } from "./InsightsRepository";

export class InMemoryInsightsRepository implements InsightsRepository {
  private insights: StoredInsight[] = [];

  async save(insight: StoredInsight): Promise<StoredInsight> {
    this.insights.push(insight);
    return insight;
  }

  async findLatest(): Promise<StoredInsight | null> {
    return this.insights.at(-1) ?? null;
  }
}
