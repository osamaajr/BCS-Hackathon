import type { WeeklyReport } from "../types/wellbeing";

export const mockWeeklyReport: WeeklyReport = {
  averageScore: 74,
  weeklyTrend: "Stable",
  stressTrend: "Stress load rose mid-week and settled as sleep and hydration improved.",
  sleepTrend: "Sleep quality improved after two lower-quality nights.",
  moodTrend: "Emotional balance stayed stable and improved on more active days.",
  weeklySummary:
    "This week shows a broadly steady wellness profile. Sleep quality dipped during higher-stress days, while hydration, activity and emotional balance helped keep the overall wellness score resilient.",
  chartData: [
    { day: "Mon", wellnessScore: 76, sleepHours: 7.2, sleepQuality: 7, stressLevel: 5, activityLevel: "Moderate", emotionalBalance: 7, waterIntake: 2.1, energyLevel: 7 },
    { day: "Tue", wellnessScore: 71, sleepHours: 6.4, sleepQuality: 6, stressLevel: 7, activityLevel: "Moderate", emotionalBalance: 6, waterIntake: 1.8, energyLevel: 6 },
    { day: "Wed", wellnessScore: 64, sleepHours: 5.8, sleepQuality: 5, stressLevel: 8, activityLevel: "Low", emotionalBalance: 6, waterIntake: 1.5, energyLevel: 5 },
    { day: "Thu", wellnessScore: 69, sleepHours: 6.2, sleepQuality: 6, stressLevel: 7, activityLevel: "Low", emotionalBalance: 6, waterIntake: 1.9, energyLevel: 6 },
    { day: "Fri", wellnessScore: 74, sleepHours: 6.9, sleepQuality: 7, stressLevel: 6, activityLevel: "Moderate", emotionalBalance: 7, waterIntake: 2.2, energyLevel: 7 },
    { day: "Sat", wellnessScore: 82, sleepHours: 7.8, sleepQuality: 8, stressLevel: 4, activityLevel: "High", emotionalBalance: 8, waterIntake: 2.4, energyLevel: 8 },
    { day: "Sun", wellnessScore: 83, sleepHours: 7.6, sleepQuality: 8, stressLevel: 4, activityLevel: "High", emotionalBalance: 8, waterIntake: 2.5, energyLevel: 8 },
  ],
};
