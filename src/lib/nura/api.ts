import type { CheckIn, Recommendation, RiskLevel, ScoredCheckIn } from "./types";

type WellbeingInput = {
  sleepHours: number;
  moodScore: number;
  stressScore: number;
  activityMinutes: number;
  restingHeartRate: number;
  waterIntake: number;
  fatigueLevel: number;
  socialInteraction: number;
  smokingAlcohol: boolean;
  notes: string;
};

type InsightResponse = {
  score: number;
  level: RiskLevel;
  factors: ScoredCheckIn["factors"];
  aiSummary: string;
  recommendations: Recommendation[];
  disclaimer: string;
};

export type WeeklyReport = {
  averageScore: number;
  weeklyTrend: "Improving" | "Stable" | "Needs attention";
  stressTrend: string;
  sleepTrend: string;
  moodTrend: string;
  weeklySummary: string;
  chartData: {
    day: string;
    score: number;
    sleepHours: number;
    moodScore: number;
    stressScore: number;
  }[];
};

export type SupportService = {
  id: string;
  name: string;
  description: string;
  urgency: "Low" | "Medium" | "High" | "Urgent";
  openingHours: string;
  contact: string;
  disclaimer: string;
};

export type SupportResponse = {
  riskLevel: RiskLevel;
  services: SupportService[];
};

function toWellbeingInput(checkIn: CheckIn): WellbeingInput {
  return {
    sleepHours: checkIn.sleep,
    moodScore: checkIn.mood,
    stressScore: checkIn.stress,
    activityMinutes: checkIn.activity,
    restingHeartRate: checkIn.restingHr,
    waterIntake: checkIn.water,
    fatigueLevel: checkIn.fatigue,
    socialInteraction: checkIn.social,
    smokingAlcohol: checkIn.smokingAlcohol,
    notes: checkIn.notes,
  };
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function createInsight(checkIn: CheckIn): Promise<ScoredCheckIn> {
  const response = await fetch("/api/insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wellbeingData: toWellbeingInput(checkIn) }),
  });
  const insight = await parseJson<InsightResponse>(response);

  return {
    ...checkIn,
    score: insight.score,
    level: insight.level,
    factors: insight.factors,
    aiSummary: insight.aiSummary,
    recommendations: insight.recommendations,
    disclaimer: insight.disclaimer,
  };
}

export async function getWeeklyReport(): Promise<WeeklyReport> {
  const response = await fetch("/api/mock-weekly-report");
  return parseJson<WeeklyReport>(response);
}

export async function getSupportServices(riskLevel: RiskLevel): Promise<SupportResponse> {
  const response = await fetch(`/api/support/${riskLevel}`);
  return parseJson<SupportResponse>(response);
}
