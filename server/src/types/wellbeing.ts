export type RiskLevel = "Low" | "Moderate" | "High";

export interface WellbeingInput {
  sleepHours: number;
  moodScore: number;
  stressScore: number;
  activityMinutes: number;
  restingHeartRate: number;
  waterIntake: number;
  fatigueLevel: number;
  socialInteraction: number;
  smokingAlcohol: boolean;
  notes?: string;
}

export interface RiskFactor {
  key: string;
  label: string;
  reason: string;
  weight: number;
}

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category:
    | "sleep"
    | "stress"
    | "mood"
    | "activity"
    | "hydration"
    | "fatigue"
    | "social"
    | "heart-rate"
    | "lifestyle"
    | "general";
}

export interface InsightResponse extends RiskAssessment {
  aiSummary: string;
  recommendations: Recommendation[];
  disclaimer: string;
}

export interface CheckInEntry {
  id: string;
  createdAt: string;
  wellbeingData: WellbeingInput;
  assessment: RiskAssessment;
  aiSummary: string;
  recommendations: Recommendation[];
}

export interface WeeklyTrendPoint {
  day: string;
  score: number;
  sleepHours: number;
  moodScore: number;
  stressScore: number;
}

export interface WeeklyReport {
  averageScore: number;
  weeklyTrend: "Improving" | "Stable" | "Needs attention";
  stressTrend: string;
  sleepTrend: string;
  moodTrend: string;
  weeklySummary: string;
  chartData: WeeklyTrendPoint[];
}

export interface SupportService {
  id: string;
  name: string;
  description: string;
  urgency: "Low" | "Medium" | "High" | "Urgent";
  openingHours: string;
  contact: string;
  disclaimer: string;
}
