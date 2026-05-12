export type ActivityLevel = "Low" | "Moderate" | "High";
export type BreakQuality = "Yes" | "Somewhat" | "No";
export type StressLoad = "Low" | "Balanced" | "Elevated";
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

export type CheckIn = {
  date: string;
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
  notes: string;
};

export type HealthProfile = {
  patientId: string;
  fullName: string;
  age: number;
  ageRange: AgeRange;
  biologicalSex: BiologicalSex;
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
  existingConditions: string;
  dietaryPreference: string;
  wellnessGoals: WellnessGoal[];
};

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  category: string;
};

export type EnvironmentalContext = {
  postcode: string;
  airQuality: "Good" | "Moderate" | "Poor";
  greenSpaceAccess: "High" | "Moderate" | "Limited";
  walkability: "Excellent" | "Good" | "Limited";
  noisePollution: "Low" | "Moderate" | "Elevated";
  nearbyWellnessAccess: "Strong" | "Moderate" | "Limited";
  nearbyServices: string[];
  wellnessSummary: string;
};

export type ScoredCheckIn = CheckIn & {
  wellnessScore: number;
  stressLoad: StressLoad;
  weeklyTrend: "Improving" | "Stable" | "Needs attention";
  factors: { key: string; label: string; weight: number; reason: string }[];
  preventativeInsights: string[];
  aiSummary?: string;
  recommendations?: Recommendation[];
  disclaimer?: string;
};
