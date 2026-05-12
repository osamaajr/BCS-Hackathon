import type { CheckIn, EnvironmentalContext, HealthProfile, Recommendation, ScoredCheckIn, StressLoad } from "./types";

type WellbeingInput = Omit<CheckIn, "date">;

type InsightResponse = {
  wellnessScore: number;
  stressLoad: StressLoad;
  weeklyTrend: "Improving" | "Stable" | "Needs attention";
  factors: ScoredCheckIn["factors"];
  preventativeInsights: string[];
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
    wellnessScore: number;
    sleepHours: number;
    sleepQuality: number;
    stressLevel: number;
    activityLevel: "Low" | "Moderate" | "High";
    emotionalBalance: number;
    waterIntake: number;
    energyLevel: number;
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
  riskLevel: "Low" | "Moderate" | "High";
  services: SupportService[];
};

export type RecommendedResource = {
  id: string;
  title: string;
  category: string;
  whyRelevant: string;
  nextStep: string;
  trustedSource: string;
  urlLabel: string;
  url: string;
  priority: "Core" | "Helpful" | "General";
};

export type ResourceRecommendationResponse = {
  patientId: string;
  resources: RecommendedResource[];
  safetyNote: string;
};

export type TrendInsight = {
  id: string;
  title: string;
  description: string;
  severity: "Positive" | "Watch" | "Elevated";
};

export type CheckInHistoryEntry = {
  id: string;
  createdAt: string;
  wellbeingData: WellbeingInput;
  assessment: {
    wellnessScore: number;
    stressLoad: StressLoad;
    weeklyTrend: "Improving" | "Stable" | "Needs attention";
    factors: ScoredCheckIn["factors"];
    preventativeInsights: string[];
  };
  aiSummary: string;
  recommendations: Recommendation[];
};

export type CheckInHistoryResponse = {
  checkIns: CheckInHistoryEntry[];
  trendInsights: TrendInsight[];
};

function toWellbeingInput(checkIn: CheckIn): WellbeingInput {
  const { date: _date, ...wellbeingData } = checkIn;
  return wellbeingData;
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function createInsight(checkIn: CheckIn, profile?: HealthProfile, environmentalContext?: EnvironmentalContext): Promise<ScoredCheckIn> {
  const response = await fetch("/api/insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wellbeingData: toWellbeingInput(checkIn), profile, environmentalContext }),
  });
  const insight = await parseJson<InsightResponse>(response);

  return {
    ...checkIn,
    ...insight,
  };
}

export async function getWeeklyReport(): Promise<WeeklyReport> {
  const response = await fetch("/api/mock-weekly-report");
  return parseJson<WeeklyReport>(response);
}

export async function getSupportServices(stressLoad: StressLoad): Promise<SupportResponse> {
  const mappedLevel = stressLoad === "Low" ? "Low" : stressLoad === "Balanced" ? "Moderate" : "High";
  const response = await fetch(`/api/support/${mappedLevel}`);
  return parseJson<SupportResponse>(response);
}

export async function getRecommendedResources(profile: HealthProfile, latestCheckIn?: CheckIn): Promise<ResourceRecommendationResponse> {
  const response = await fetch("/api/resources/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, latestCheckIn: latestCheckIn ? toWellbeingInput(latestCheckIn) : undefined }),
  });
  return parseJson<ResourceRecommendationResponse>(response);
}

export async function getCheckInHistory(): Promise<CheckInHistoryResponse> {
  const response = await fetch("/api/checkins");
  return parseJson<CheckInHistoryResponse>(response);
}
