import type { CheckInRepository } from "../repositories/CheckInRepository";
import type { CheckInEntry, CheckInHistoryResponse, TrendInsight } from "../types/wellbeing";

export class CheckInService {
  constructor(private readonly checkInRepository: CheckInRepository) {}

  async getRecentHistory(limit = 7): Promise<CheckInHistoryResponse> {
    const checkIns = await this.checkInRepository.findRecent(limit);

    return {
      checkIns,
      trendInsights: detectTrendInsights(checkIns),
    };
  }
}

function detectTrendInsights(checkIns: CheckInEntry[]): TrendInsight[] {
  const insights: TrendInsight[] = [];
  const lastThree = checkIns.slice(-3);

  if (lastThree.length >= 3) {
    const stressValues = lastThree.map((entry) => entry.wellbeingData.stressLevel);
    const sleepQualityValues = lastThree.map((entry) => entry.wellbeingData.sleepQuality);
    const wellnessValues = lastThree.map((entry) => entry.assessment.wellnessScore);
    const hydrationValues = lastThree.map((entry) => entry.wellbeingData.waterIntake);
    const energyValues = lastThree.map((entry) => entry.wellbeingData.energyLevel);
    const activityValues = lastThree.map((entry) => entry.wellbeingData.activityLevel);

    if (isStrictlyIncreasing(stressValues)) {
      insights.push({
        id: "stress-rising-three-days",
        title: "Stress load has increased across your last 3 check-ins",
        description:
          "This suggests stress is trending upward. It may be worth protecting sleep, breaks and hydration over the next few days.",
        severity: "Elevated",
      });
    }

    if (sleepQualityValues.filter((sleepQuality) => sleepQuality <= 5).length >= 2) {
      insights.push({
        id: "sleep-quality-variable",
        title: "Sleep quality has been below ideal on multiple recent check-ins",
        description:
          "Sleep quality has been lower more than once recently. A consistent wind-down and wake time may help make the pattern easier to shift.",
        severity: "Watch",
      });
    }

    if (energyValues.every((energyLevel) => energyLevel <= 5)) {
      insights.push({
        id: "energy-lower-recently",
        title: "Energy has stayed lower across recent check-ins",
        description:
          "This is not a medical signal by itself, but it is useful to track alongside sleep, stress and hydration.",
        severity: "Elevated",
      });
    }

    if (hydrationValues.length >= 3 && hydrationValues.every((waterIntake) => waterIntake < 1.8)) {
      insights.push({
        id: "hydration-energy-link",
        title: "Hydration has stayed below the ideal range",
        description:
          "Hydration is one of the simplest variables to adjust and compare against future energy and focus entries.",
        severity: "Watch",
      });
    }

    if (activityValues.filter((level) => level === "Low").length >= 2 && stressValues.some((stress) => stress >= 7)) {
      insights.push({
        id: "activity-lower-with-stress",
        title: "Activity appears lower around higher-stress check-ins",
        description:
          "Nura has noticed lower activity during periods of higher stress. Light, realistic movement may be worth testing as a small habit.",
        severity: "Watch",
      });
    }

    if (isStrictlyIncreasing(wellnessValues)) {
      insights.push({
        id: "wellness-score-improving",
        title: "Your wellness score is improving across recent check-ins",
        description:
          "Recent lifestyle inputs appear to be moving in a positive direction. Keep the same simple habits visible.",
        severity: "Positive",
      });
    }
  }

  if (checkIns.length >= 3 && insights.length === 0) {
    insights.push({
      id: "pattern-stable",
      title: "Recent wellness patterns look relatively steady",
      description:
        "Your recent entries look relatively steady. Keep checking in so Nura can identify useful relationships between sleep, stress, hydration and energy.",
      severity: "Positive",
    });
  }

  if (checkIns.length < 3) {
    insights.push({
      id: "more-data-needed",
      title: "More check-ins will unlock personalized preventative insights",
      description:
        "After three check-ins, Nura can start spotting patterns like stress changes, sleep quality shifts, hydration-energy links and activity trends.",
      severity: "Watch",
    });
  }

  return insights.slice(0, 4);
}

function isStrictlyIncreasing(values: number[]): boolean {
  return values.every((value, index) => index === 0 || value > values[index - 1]);
}
