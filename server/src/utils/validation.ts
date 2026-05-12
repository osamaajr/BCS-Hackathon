import { ApiError } from "./apiError";
import type {
  ActivityLevel,
  AgeRange,
  AlcoholFrequency,
  BiologicalSex,
  BreakQuality,
  EnvironmentalContext,
  HealthProfile,
  PreventativeSymptom,
  SmokingStatus,
  WellbeingInput,
  WellnessGoal,
} from "../types/wellbeing";

const numericFields: Array<keyof Pick<WellbeingInput, "sleepHours" | "sleepQuality" | "waterIntake" | "restingHeartRate" | "energyLevel" | "stressLevel" | "focusLevel" | "emotionalBalance">> = [
  "sleepHours",
  "sleepQuality",
  "waterIntake",
  "restingHeartRate",
  "energyLevel",
  "stressLevel",
  "focusLevel",
  "emotionalBalance",
];

const activityLevels: ActivityLevel[] = ["Low", "Moderate", "High"];
const breakQualities: BreakQuality[] = ["Yes", "Somewhat", "No"];
const ageRanges: AgeRange[] = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
const biologicalSexOptions: BiologicalSex[] = ["", "Female", "Male", "Intersex", "Prefer not to say"];
const smokingStatuses: SmokingStatus[] = ["Non-smoker", "Former smoker", "Occasional", "Smoker", "Current smoker"];
const alcoholFrequencies: AlcoholFrequency[] = ["None", "Occasional", "Weekly", "Most days"];
const wellnessGoals: WellnessGoal[] = [
  "Improve sleep",
  "Reduce stress",
  "Improve fitness",
  "Improve energy",
  "Better work-life balance",
  "Improve focus",
  "Increase activity consistency",
];
const symptoms: PreventativeSymptom[] = [
  "persistent fatigue",
  "headaches",
  "poor sleep",
  "mental exhaustion",
  "low motivation",
  "appetite changes",
  "anxiety",
  "none",
];

const airQualityOptions: EnvironmentalContext["airQuality"][] = ["Good", "Moderate", "Poor"];
const greenSpaceOptions: EnvironmentalContext["greenSpaceAccess"][] = ["High", "Moderate", "Limited"];
const walkabilityOptions: EnvironmentalContext["walkability"][] = ["Excellent", "Good", "Limited"];
const noiseOptions: EnvironmentalContext["noisePollution"][] = ["Low", "Moderate", "Elevated"];
const wellnessAccessOptions: EnvironmentalContext["nearbyWellnessAccess"][] = ["Strong", "Moderate", "Limited"];

export function validateWellbeingInput(input: unknown): WellbeingInput {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ApiError(400, "wellbeingData must be an object.");
  }

  const data = input as Partial<WellbeingInput>;

  for (const field of numericFields) {
    if (typeof data[field] !== "number" || Number.isNaN(data[field])) {
      throw new ApiError(400, `${field} must be a valid number.`);
    }
  }

  if (data.notes !== undefined && typeof data.notes !== "string") {
    throw new ApiError(400, "notes must be a string when provided.");
  }

  if (!activityLevels.includes(data.activityLevel as ActivityLevel)) {
    throw new ApiError(400, "activityLevel must be Low, Moderate, or High.");
  }

  if (!breakQualities.includes(data.meaningfulBreaks as BreakQuality)) {
    throw new ApiError(400, "meaningfulBreaks must be Yes, Somewhat, or No.");
  }

  if (!Array.isArray(data.symptoms) || !data.symptoms.every((symptom) => symptoms.includes(symptom))) {
    throw new ApiError(400, "symptoms must be an array of supported preventative health signals.");
  }

  const wellbeingData = data as WellbeingInput;

  if (wellbeingData.sleepHours < 0 || wellbeingData.sleepHours > 14) throw new ApiError(400, "sleepHours must be between 0 and 14.");
  if (wellbeingData.sleepQuality < 1 || wellbeingData.sleepQuality > 10) throw new ApiError(400, "sleepQuality must be between 1 and 10.");
  if (wellbeingData.restingHeartRate < 35 || wellbeingData.restingHeartRate > 160) throw new ApiError(400, "restingHeartRate must be between 35 and 160.");
  if (wellbeingData.waterIntake < 0 || wellbeingData.waterIntake > 8) throw new ApiError(400, "waterIntake must be between 0 and 8.");
  if (wellbeingData.energyLevel < 1 || wellbeingData.energyLevel > 10) throw new ApiError(400, "energyLevel must be between 1 and 10.");
  if (wellbeingData.stressLevel < 1 || wellbeingData.stressLevel > 10) throw new ApiError(400, "stressLevel must be between 1 and 10.");
  if (wellbeingData.focusLevel < 1 || wellbeingData.focusLevel > 10) throw new ApiError(400, "focusLevel must be between 1 and 10.");
  if (wellbeingData.emotionalBalance < 1 || wellbeingData.emotionalBalance > 10) throw new ApiError(400, "emotionalBalance must be between 1 and 10.");

  const cleanedSymptoms = wellbeingData.symptoms.includes("none") ? ["none" as const] : wellbeingData.symptoms;

  return { ...wellbeingData, symptoms: cleanedSymptoms, notes: wellbeingData.notes?.trim() ?? "" };
}

export function validateHealthProfile(input: unknown): HealthProfile | undefined {
  if (input === undefined || input === null) return undefined;
  if (typeof input !== "object" || Array.isArray(input)) {
    throw new ApiError(400, "profile must be an object when provided.");
  }

  const data = input as Partial<HealthProfile>;

  if (typeof data.patientId !== "string") throw new ApiError(400, "profile.patientId must be a string.");
  if (typeof data.fullName !== "string") throw new ApiError(400, "profile.fullName must be a string.");
  if (typeof data.age !== "number" || data.age < 0 || data.age > 120) throw new ApiError(400, "profile.age must be between 0 and 120.");
  if (!ageRanges.includes(data.ageRange as AgeRange)) throw new ApiError(400, "profile.ageRange is not supported.");
  if (!biologicalSexOptions.includes((data.biologicalSex ?? "") as BiologicalSex)) throw new ApiError(400, "profile.biologicalSex is not supported.");
  if (typeof data.height !== "number" || data.height < 80 || data.height > 240) throw new ApiError(400, "profile.height must be between 80 and 240 cm.");
  if (typeof data.weight !== "number" || data.weight < 25 || data.weight > 250) throw new ApiError(400, "profile.weight must be between 25 and 250 kg.");
  if (typeof data.lsoaCode !== "string") throw new ApiError(400, "profile.lsoaCode must be a string.");
  if (typeof data.bmi !== "number" || data.bmi < 10 || data.bmi > 80) throw new ApiError(400, "profile.bmi must be between 10 and 80.");
  if (typeof data.postcode !== "string") throw new ApiError(400, "profile.postcode must be a string.");
  if (!smokingStatuses.includes(data.smokingStatus as SmokingStatus)) throw new ApiError(400, "profile.smokingStatus is not supported.");
  if (!alcoholFrequencies.includes(data.alcoholFrequency as AlcoholFrequency)) throw new ApiError(400, "profile.alcoholFrequency is not supported.");
  if (typeof data.weeklyExerciseMinutes !== "number" || data.weeklyExerciseMinutes < 0 || data.weeklyExerciseMinutes > 2000) throw new ApiError(400, "profile.weeklyExerciseMinutes must be between 0 and 2000.");
  if (typeof data.alcoholUnitsPerWeek !== "number" || data.alcoholUnitsPerWeek < 0 || data.alcoholUnitsPerWeek > 200) throw new ApiError(400, "profile.alcoholUnitsPerWeek must be between 0 and 200.");
  if (!activityLevels.includes(data.activityLevel as ActivityLevel)) throw new ApiError(400, "profile.activityLevel must be Low, Moderate, or High.");
  if (typeof data.hasAsthma !== "boolean") throw new ApiError(400, "profile.hasAsthma must be a boolean.");
  if (typeof data.hasDiabetes !== "boolean") throw new ApiError(400, "profile.hasDiabetes must be a boolean.");
  if (typeof data.hasHypertension !== "boolean") throw new ApiError(400, "profile.hasHypertension must be a boolean.");
  if (typeof data.systolicBp !== "number" || data.systolicBp < 70 || data.systolicBp > 250) throw new ApiError(400, "profile.systolicBp must be between 70 and 250.");
  if (typeof data.diastolicBp !== "number" || data.diastolicBp < 40 || data.diastolicBp > 150) throw new ApiError(400, "profile.diastolicBp must be between 40 and 150.");
  if (typeof data.restingHeartRate !== "number" || data.restingHeartRate < 35 || data.restingHeartRate > 160) throw new ApiError(400, "profile.restingHeartRate must be between 35 and 160.");
  if (typeof data.glucoseMmolL !== "number" || data.glucoseMmolL < 2 || data.glucoseMmolL > 40) throw new ApiError(400, "profile.glucoseMmolL must be between 2 and 40.");
  if (data.existingConditions !== undefined && typeof data.existingConditions !== "string") throw new ApiError(400, "profile.existingConditions must be a string.");
  if (data.dietaryPreference !== undefined && typeof data.dietaryPreference !== "string") throw new ApiError(400, "profile.dietaryPreference must be a string.");
  if (!Array.isArray(data.wellnessGoals) || !data.wellnessGoals.every((goal) => wellnessGoals.includes(goal))) {
    throw new ApiError(400, "profile.wellnessGoals must include supported goals.");
  }

  return {
    patientId: data.patientId.trim() || "P001",
    fullName: data.fullName.trim() || "Alex",
    age: data.age,
    ageRange: data.ageRange as AgeRange,
    biologicalSex: (data.biologicalSex ?? "") as BiologicalSex,
    height: data.height,
    weight: data.weight,
    lsoaCode: data.lsoaCode.trim().toUpperCase(),
    bmi: data.bmi,
    postcode: data.postcode.trim().toUpperCase(),
    smokingStatus: data.smokingStatus as SmokingStatus,
    alcoholFrequency: data.alcoholFrequency as AlcoholFrequency,
    weeklyExerciseMinutes: data.weeklyExerciseMinutes,
    alcoholUnitsPerWeek: data.alcoholUnitsPerWeek,
    activityLevel: data.activityLevel as ActivityLevel,
    hasAsthma: data.hasAsthma,
    hasDiabetes: data.hasDiabetes,
    hasHypertension: data.hasHypertension,
    systolicBp: data.systolicBp,
    diastolicBp: data.diastolicBp,
    restingHeartRate: data.restingHeartRate,
    glucoseMmolL: data.glucoseMmolL,
    existingConditions: data.existingConditions?.trim() ?? "",
    dietaryPreference: data.dietaryPreference?.trim() ?? "",
    wellnessGoals: data.wellnessGoals,
  };
}

export function validateEnvironmentalContext(input: unknown): EnvironmentalContext | undefined {
  if (input === undefined || input === null) return undefined;
  if (typeof input !== "object" || Array.isArray(input)) {
    throw new ApiError(400, "environmentalContext must be an object when provided.");
  }

  const data = input as Partial<EnvironmentalContext>;

  if (typeof data.postcode !== "string") throw new ApiError(400, "environmentalContext.postcode must be a string.");
  if (!airQualityOptions.includes(data.airQuality as EnvironmentalContext["airQuality"])) throw new ApiError(400, "environmentalContext.airQuality is not supported.");
  if (!greenSpaceOptions.includes(data.greenSpaceAccess as EnvironmentalContext["greenSpaceAccess"])) throw new ApiError(400, "environmentalContext.greenSpaceAccess is not supported.");
  if (!walkabilityOptions.includes(data.walkability as EnvironmentalContext["walkability"])) throw new ApiError(400, "environmentalContext.walkability is not supported.");
  if (!noiseOptions.includes(data.noisePollution as EnvironmentalContext["noisePollution"])) throw new ApiError(400, "environmentalContext.noisePollution is not supported.");
  if (!wellnessAccessOptions.includes(data.nearbyWellnessAccess as EnvironmentalContext["nearbyWellnessAccess"])) throw new ApiError(400, "environmentalContext.nearbyWellnessAccess is not supported.");
  if (!Array.isArray(data.nearbyServices) || !data.nearbyServices.every((service) => typeof service === "string")) {
    throw new ApiError(400, "environmentalContext.nearbyServices must be a list of strings.");
  }
  if (typeof data.wellnessSummary !== "string") throw new ApiError(400, "environmentalContext.wellnessSummary must be a string.");

  return {
    postcode: data.postcode.trim().toUpperCase() || "LOCAL AREA",
    airQuality: data.airQuality as EnvironmentalContext["airQuality"],
    greenSpaceAccess: data.greenSpaceAccess as EnvironmentalContext["greenSpaceAccess"],
    walkability: data.walkability as EnvironmentalContext["walkability"],
    noisePollution: data.noisePollution as EnvironmentalContext["noisePollution"],
    nearbyWellnessAccess: data.nearbyWellnessAccess as EnvironmentalContext["nearbyWellnessAccess"],
    nearbyServices: data.nearbyServices.slice(0, 8).map((service) => service.trim()).filter(Boolean),
    wellnessSummary: data.wellnessSummary.trim(),
  };
}
