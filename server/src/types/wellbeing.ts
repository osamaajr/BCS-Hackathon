export type RiskLevel = "Low" | "Moderate" | "High";
export type ActivityLevel = "Low" | "Moderate" | "High";
export type BreakQuality = "Yes" | "Somewhat" | "No";
export type AgeRange = "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+";
export type BiologicalSex = "" | "Female" | "Male" | "Intersex" | "Prefer not to say";
export type SmokingStatus = "Non-smoker" | "Former smoker" | "Occasional" | "Smoker" | "Current smoker";
export type AlcoholFrequency = "None" | "Occasional" | "Weekly" | "Most days";
export type WellnessGoal =
  | "Improve sleep"
  | "Reduce stress"
  | "Improve fitness"
  | "Improve energy"
  | "Better work-life balance"
  | "Improve focus"
  | "Increase activity consistency";
export type PreventativeSymptom =
  | "persistent fatigue"
  | "headaches"
  | "poor sleep"
  | "mental exhaustion"
  | "low motivation"
  | "appetite changes"
  | "anxiety"
  | "none";

export interface WellbeingInput {
  sleepHours: number;
  sleepQuality: number;
  activityLevel: ActivityLevel;
  waterIntake: number;
  restingHeartRate: number;
  energyLevel: number;
  stressLevel: number;
  focusLevel: number;
  emotionalBalance: number;
  meaningfulBreaks: BreakQuality;
  symptoms: PreventativeSymptom[];
  notes?: string;
}

export interface HealthProfile {
  patientId: string;
  fullName: string;
  age: number;
  ageRange: AgeRange;
  biologicalSex?: BiologicalSex;
  height: number;
  weight: number;
  lsoaCode: string;
  bmi: number;
  postcode: string;
  smokingStatus: SmokingStatus;
  alcoholFrequency: AlcoholFrequency;
  weeklyExerciseMinutes: number;
  alcoholUnitsPerWeek: number;
  activityLevel: ActivityLevel;
  hasAsthma: boolean;
  hasDiabetes: boolean;
  hasHypertension: boolean;
  systolicBp: number;
  diastolicBp: number;
  restingHeartRate: number;
  glucoseMmolL: number;
  existingConditions?: string;
  dietaryPreference?: string;
  wellnessGoals: WellnessGoal[];
}

export interface EnvironmentalContext {
  postcode: string;
  airQuality: "Good" | "Moderate" | "Poor";
  greenSpaceAccess: "High" | "Moderate" | "Limited";
  walkability: "Excellent" | "Good" | "Limited";
  noisePollution: "Low" | "Moderate" | "Elevated";
  nearbyWellnessAccess: "Strong" | "Moderate" | "Limited";
  nearbyServices: string[];
  wellnessSummary: string;
}

export interface WellnessFactor {
  key: string;
  label: string;
  reason: string;
  weight: number;
}

export interface RiskAssessment {
  wellnessScore: number;
  stressLoad: "Low" | "Balanced" | "Elevated";
  weeklyTrend: "Improving" | "Stable" | "Needs attention";
  factors: WellnessFactor[];
  preventativeInsights: string[];
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
    | "energy"
    | "balance"
    | "breaks"
    | "signals"
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
  profile?: HealthProfile;
  environmentalContext?: EnvironmentalContext;
  assessment: RiskAssessment;
  aiSummary: string;
  recommendations: Recommendation[];
}

export interface TrendInsight {
  id: string;
  title: string;
  description: string;
  severity: "Positive" | "Watch" | "Elevated";
}

export interface CheckInHistoryResponse {
  checkIns: CheckInEntry[];
  trendInsights: TrendInsight[];
}

export interface WeeklyTrendPoint {
  day: string;
  wellnessScore: number;
  sleepHours: number;
  sleepQuality: number;
  stressLevel: number;
  activityLevel: ActivityLevel;
  emotionalBalance: number;
  waterIntake: number;
  energyLevel: number;
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

export interface RecommendedResource {
  id: string;
  title: string;
  category: string;
  whyRelevant: string;
  nextStep: string;
  trustedSource: string;
  urlLabel: string;
  url: string;
  priority: "Core" | "Helpful" | "General";
}
