import type { RiskLevel } from "../types/wellbeing";

export const RISK_THRESHOLDS: Record<RiskLevel, { min: number; max: number }> = {
  Low: { min: 0, max: 34 },
  Moderate: { min: 35, max: 64 },
  High: { min: 65, max: 100 },
};

export function getRiskLevel(score: number): RiskLevel {
  if (score <= RISK_THRESHOLDS.Low.max) return "Low";
  if (score <= RISK_THRESHOLDS.Moderate.max) return "Moderate";
  return "High";
}
