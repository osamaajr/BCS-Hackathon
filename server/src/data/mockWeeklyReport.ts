import type { WeeklyReport } from "../types/wellbeing";

export const mockWeeklyReport: WeeklyReport = {
  averageScore: 43,
  weeklyTrend: "Stable",
  stressTrend: "Stress was highest mid-week and eased slightly over the weekend.",
  sleepTrend: "Sleep consistency improved after two shorter nights.",
  moodTrend: "Mood stayed broadly steady, with a small lift after more activity.",
  weeklySummary:
    "This week shows a moderate but manageable wellbeing pattern. The main signals were stress and reduced sleep consistency, while activity and social connection helped keep the overall trend stable.",
  chartData: [
    { day: "Mon", score: 38, sleepHours: 7.2, moodScore: 7, stressScore: 5 },
    { day: "Tue", score: 46, sleepHours: 6.1, moodScore: 6, stressScore: 7 },
    { day: "Wed", score: 55, sleepHours: 5.4, moodScore: 5, stressScore: 8 },
    { day: "Thu", score: 49, sleepHours: 6.0, moodScore: 6, stressScore: 7 },
    { day: "Fri", score: 42, sleepHours: 6.8, moodScore: 7, stressScore: 6 },
    { day: "Sat", score: 36, sleepHours: 7.6, moodScore: 7, stressScore: 4 },
    { day: "Sun", score: 35, sleepHours: 7.4, moodScore: 8, stressScore: 4 },
  ],
};
