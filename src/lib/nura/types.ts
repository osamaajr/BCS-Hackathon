export type CheckIn = {
  date: string; // ISO
  sleep: number;
  mood: number;
  stress: number;
  activity: number;
  restingHr: number;
  water: number;
  fatigue: number;
  social: number;
  notes: string;
  smokingAlcohol: boolean;
};

export type RiskLevel = "Low" | "Moderate" | "High";

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  category: string;
};

export type ScoredCheckIn = CheckIn & {
  score: number;
  level: RiskLevel;
  factors: { key: string; label: string; weight: number; reason: string }[];
  aiSummary?: string;
  recommendations?: Recommendation[];
  disclaimer?: string;
};
