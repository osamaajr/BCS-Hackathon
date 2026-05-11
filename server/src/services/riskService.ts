import { getRiskLevel } from "../constants/risk";
import type { RiskAssessment, RiskFactor, WellbeingInput } from "../types/wellbeing";

function addFactor(
  factors: RiskFactor[],
  key: string,
  label: string,
  reason: string,
  weight: number,
): number {
  factors.push({ key, label, reason, weight: Math.round(weight) });
  return weight;
}

export function calculateRiskScore(data: WellbeingInput): RiskAssessment {
  const factors: RiskFactor[] = [];
  let score = 10;

  if (data.sleepHours < 6) {
    score += addFactor(
      factors,
      "sleep",
      "Reduced sleep",
      `Sleep was ${data.sleepHours} hours, which can make recovery harder.`,
      (6 - data.sleepHours) * 8,
    );
  }

  if (data.stressScore > 7) {
    score += addFactor(
      factors,
      "stress",
      "Elevated stress",
      `Stress was ${data.stressScore}/10, suggesting a higher strain day.`,
      (data.stressScore - 7) * 7,
    );
  }

  if (data.moodScore < 5) {
    score += addFactor(
      factors,
      "mood",
      "Lower mood",
      `Mood was ${data.moodScore}/10, which may be worth gently monitoring.`,
      (5 - data.moodScore) * 6,
    );
  }

  if (data.activityMinutes < 20) {
    score += addFactor(
      factors,
      "activity",
      "Low activity",
      `Activity was ${data.activityMinutes} minutes, below today's gentle movement target.`,
      (20 - data.activityMinutes) * 0.6,
    );
  }

  if (data.waterIntake < 1.5) {
    score += addFactor(
      factors,
      "hydration",
      "Low hydration",
      `Water intake was ${data.waterIntake}L, below a supportive daily baseline.`,
      (1.5 - data.waterIntake) * 10,
    );
  }

  if (data.fatigueLevel > 7) {
    score += addFactor(
      factors,
      "fatigue",
      "High fatigue",
      `Fatigue was ${data.fatigueLevel}/10, suggesting recovery may be stretched.`,
      (data.fatigueLevel - 7) * 6,
    );
  }

  if (data.socialInteraction < 4) {
    score += addFactor(
      factors,
      "social",
      "Low social connection",
      `Social interaction was ${data.socialInteraction}/10, so connection may be low today.`,
      (4 - data.socialInteraction) * 4,
    );
  }

  if (data.restingHeartRate > 90) {
    score += addFactor(
      factors,
      "heart-rate",
      "Elevated resting heart rate",
      `Resting heart rate was ${data.restingHeartRate} bpm, above the typical range used by this prototype.`,
      (data.restingHeartRate - 90) * 1.2,
    );
  }

  if (data.smokingAlcohol) {
    score += addFactor(
      factors,
      "lifestyle",
      "Smoking or alcohol logged",
      "Smoking or alcohol can contribute to short-term recovery strain.",
      8,
    );
  }

  const boundedScore = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score: boundedScore,
    level: getRiskLevel(boundedScore),
    factors: factors.sort((a, b) => b.weight - a.weight),
  };
}
