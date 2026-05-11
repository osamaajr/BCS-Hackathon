import { mockWeeklyReport } from "../data/mockWeeklyReport";
import type { CheckInRepository } from "./CheckInRepository";
import type { CheckInEntry, WeeklyReport } from "../types/wellbeing";

export class InMemoryCheckInRepository implements CheckInRepository {
  private entries: CheckInEntry[] = [];

  async save(entry: CheckInEntry): Promise<CheckInEntry> {
    this.entries.push(entry);
    return entry;
  }

  async findLatest(): Promise<CheckInEntry | null> {
    return this.entries.at(-1) ?? null;
  }

  async findAll(): Promise<CheckInEntry[]> {
    return [...this.entries];
  }

  async getWeeklyReport(): Promise<WeeklyReport> {
    return mockWeeklyReport;
  }
}
