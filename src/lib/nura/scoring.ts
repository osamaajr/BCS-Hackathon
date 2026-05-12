import type { CheckIn, HealthProfile, ScoredCheckIn } from "./types";

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreCheckIn(c: CheckIn, profile?: HealthProfile): ScoredCheckIn {
  const stressLoad = c.stressLevel >= 8 ? "Elevated" : c.stressLevel >= 5 ? "Balanced" : "Low";
  const sleepScore = ((c.sleepHours >= 7 ? 90 : c.sleepHours >= 6 ? 72 : 48) + c.sleepQuality * 10) / 2;
  const hydrationScore = Math.min(100, (c.waterIntake / 2.5) * 100);
  const profilePenalty = profile
    ? (profile.bmi >= 30 ? 4 : 0) +
      (profile.smokingStatus === "Current smoker" ? 5 : 0) +
      (profile.weeklyExerciseMinutes < 75 ? 4 : 0) +
      (profile.alcoholUnitsPerWeek > 14 ? 3 : 0) +
      (profile.systolicBp >= 140 || profile.diastolicBp >= 90 || profile.hasHypertension ? 5 : 0) +
      (profile.restingHeartRate >= 85 ? 2 : 0)
    : 0;
  const wellnessScore = clampScore(
    sleepScore * 0.24 +
      (100 - c.stressLevel * 10) * 0.2 +
      (c.activityLevel === "High" ? 90 : c.activityLevel === "Moderate" ? 74 : 48) * 0.16 +
      hydrationScore * 0.16 +
      c.emotionalBalance * 10 * 0.14 +
      c.energyLevel * 10 * 0.1 -
      profilePenalty,
  );

  return {
    ...c,
    wellnessScore,
    stressLoad,
    weeklyTrend: wellnessScore >= 75 ? "Improving" : wellnessScore >= 58 ? "Stable" : "Needs attention",
    factors: [
      { key: "sleep", label: "Sleep trend", weight: 18, reason: "Sleep duration and quality influence today's wellness score." },
      { key: "stress", label: "Stress load", weight: 16, reason: "Stress is one of the stronger inputs today." },
      ...(profile ? [
        { key: "blood-pressure", label: "Blood pressure context", weight: 24, reason: "The synthetic profile includes high blood pressure readings and hypertension history." },
        { key: "smoking", label: "Smoking status", weight: 22, reason: "Current smoking status is included as a lifestyle risk signal." },
        { key: "bmi", label: "BMI context", weight: 18, reason: "The synthetic profile includes an elevated BMI." },
      ] : []),
    ],
    preventativeInsights: [
      "Complete a check-in to generate personalized preventative insights from the backend.",
    ],
  };
}

export function mockTrend(currentScore: number): { day: string; score: number; sleep: number; stress: number; hydration: number; balance: number }[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const base = [76, 72, 68, 70, 74, 80, currentScore];
  return days.map((d, i) => ({ day: d, score: base[i], sleep: [70, 66, 58, 62, 70, 80, 78][i], stress: [50, 60, 80, 70, 60, 40, 40][i], hydration: [84, 72, 60, 76, 88, 96, 100][i], balance: [70, 65, 60, 62, 70, 80, 80][i] }));
}
