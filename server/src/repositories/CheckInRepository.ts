import type { CheckInEntry, WeeklyReport } from "../types/wellbeing";

export interface CheckInRepository {
  save(entry: CheckInEntry): Promise<CheckInEntry>;
  findLatest(): Promise<CheckInEntry | null>;
  findAll(): Promise<CheckInEntry[]>;
  findRecent(limit: number): Promise<CheckInEntry[]>;
  getWeeklyReport(): Promise<WeeklyReport>;
}
