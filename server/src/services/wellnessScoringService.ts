import type { HealthProfile, RiskAssessment, WellnessFactor, WellbeingInput } from "../types/wellbeing";

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function activityScore(level: WellbeingInput["activityLevel"]): number {
  if (level === "High") return 90;
  if (level === "Moderate") return 74;
  return 48;
}

function addFactor(factors: WellnessFactor[], key: string, label: string, reason: string, weight: number) {
  factors.push({ key, label, reason, weight: Math.round(weight) });
}

export function calculateWellnessScore(data: WellbeingInput, profile?: HealthProfile): RiskAssessment {
  const factors: WellnessFactor[] = [];
  const sleepDurationScore = data.sleepHours >= 7 && data.sleepHours <= 9 ? 90 : data.sleepHours >= 6 ? 72 : 48;
  const sleepScore = (sleepDurationScore + data.sleepQuality * 10) / 2;
  const stressScore = 100 - data.stressLevel * 10;
  const hydrationScore = clampScore((data.waterIntake / 2.5) * 100);
  const activity = activityScore(data.activityLevel);
  const balanceScore = data.emotionalBalance * 10;
  const energyScore = data.energyLevel * 10;
  const symptomPenalty = data.symptoms.includes("none") ? 0 : data.symptoms.length * 3;

  const profilePenalty = calculateProfilePenalty(profile);
  const wellnessScore = clampScore(
    sleepScore * 0.24 +
      stressScore * 0.2 +
      activity * 0.16 +
      hydrationScore * 0.16 +
      balanceScore * 0.14 +
      energyScore * 0.1 -
      symptomPenalty -
      profilePenalty,
  );

  const stressLoad: RiskAssessment["stressLoad"] =
    data.stressLevel >= 8 ? "Elevated" : data.stressLevel >= 5 ? "Balanced" : "Low";

  if (data.sleepQuality <= 5 || data.sleepHours < 6) {
    addFactor(factors, "sleep", "Sleep trend", "Sleep duration or quality is lower than your preferred range.", 100 - sleepScore);
  }
  if (data.stressLevel >= 7) {
    addFactor(factors, "stress", "Stress load", "Stress is one of the stronger influences on today's wellness score.", data.stressLevel * 10);
  }
  if (data.activityLevel === "Low") {
    addFactor(factors, "activity", "Activity level", "Activity is lower today, which may affect energy and stress balance.", 38);
  }
  if (data.waterIntake < 1.8) {
    addFactor(factors, "hydration", "Hydration", "Water intake is below your target range for the day.", 100 - hydrationScore);
  }
  if (data.energyLevel <= 5) {
    addFactor(factors, "energy", "Energy level", "Energy is lower than ideal today.", 100 - energyScore);
  }
  if (data.emotionalBalance <= 5) {
    addFactor(factors, "balance", "Emotional balance", "Emotional balance is lower than usual today.", 100 - balanceScore);
  }
  if (!data.symptoms.includes("none")) {
    addFactor(factors, "signals", "Health signals", "You selected signals worth tracking across future check-ins.", data.symptoms.length * 10);
  }
  if (profile?.bmi && profile.bmi >= 30) {
    addFactor(factors, "bmi", "BMI context", "The synthetic profile includes an elevated BMI, which Nura treats as a preventative lifestyle signal.", 18);
  }
  if (profile?.smokingStatus === "Current smoker") {
    addFactor(factors, "smoking", "Smoking status", "Current smoking status is included as a lifestyle risk signal for preventative conversations.", 22);
  }
  if (profile?.weeklyExerciseMinutes !== undefined && profile.weeklyExerciseMinutes < 75) {
    addFactor(factors, "activity-profile", "Weekly activity", "Weekly exercise minutes are below common activity targets, so consistency is a useful focus.", 16);
  }
  if (profile && (profile.systolicBp >= 140 || profile.diastolicBp >= 90 || profile.hasHypertension)) {
    addFactor(factors, "blood-pressure", "Blood pressure context", "The synthetic profile includes high blood pressure readings and hypertension history, which Nura flags without diagnosing.", 24);
  }
  if (profile?.alcoholUnitsPerWeek !== undefined && profile.alcoholUnitsPerWeek > 14) {
    addFactor(factors, "alcohol-units", "Alcohol intake", "Weekly alcohol units are above lower-risk guidance, so sleep, energy and recovery patterns are worth tracking.", 14);
  }

  return {
    wellnessScore,
    stressLoad,
    weeklyTrend: wellnessScore >= 75 ? "Improving" : wellnessScore >= 58 ? "Stable" : "Needs attention",
    factors: factors.sort((a, b) => b.weight - a.weight),
    preventativeInsights: generateObservations(data),
  };
}

function calculateProfilePenalty(profile?: HealthProfile): number {
  if (!profile) return 0;

  let penalty = 0;
  if (profile.bmi >= 30) penalty += 4;
  if (profile.smokingStatus === "Current smoker") penalty += 5;
  if (profile.weeklyExerciseMinutes < 75) penalty += 4;
  if (profile.alcoholUnitsPerWeek > 14) penalty += 3;
  if (profile.systolicBp >= 140 || profile.diastolicBp >= 90 || profile.hasHypertension) penalty += 5;
  if (profile.restingHeartRate >= 85) penalty += 2;

  return penalty;
}

function generateObservations(data: WellbeingInput): string[] {
  const observations: string[] = [];

  if (data.stressLevel >= 7 && data.energyLevel <= 6) {
    observations.push("Elevated stress appears alongside lower energy today, which is worth watching over future check-ins.");
  }
  if (data.stressLevel >= 7 && data.sleepQuality <= 6) {
    observations.push("Higher stress is paired with lower sleep quality in today's entry.");
  }
  if (data.waterIntake >= 2 && data.energyLevel >= 7) {
    observations.push("Hydration and energy both look strong today.");
  }
  if (data.activityLevel === "Low" && data.stressLevel >= 7) {
    observations.push("Activity is lower during a higher-stress day, a pattern Nura can track over time.");
  }
  if (data.emotionalBalance >= 7) {
    observations.push("Emotional balance is relatively steady in today's check-in.");
  }
  if (!data.symptoms.includes("none")) {
    observations.push("The selected health signals are not diagnostic, but tracking whether they repeat can support preventative awareness.");
  }

  return observations.slice(0, 4);
}
