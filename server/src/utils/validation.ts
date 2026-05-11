import { ApiError } from "./apiError";
import type { WellbeingInput } from "../types/wellbeing";

const numericFields: Array<keyof Omit<WellbeingInput, "smokingAlcohol" | "notes">> = [
  "sleepHours",
  "moodScore",
  "stressScore",
  "activityMinutes",
  "restingHeartRate",
  "waterIntake",
  "fatigueLevel",
  "socialInteraction",
];

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

  if (typeof data.smokingAlcohol !== "boolean") {
    throw new ApiError(400, "smokingAlcohol must be true or false.");
  }

  if (data.notes !== undefined && typeof data.notes !== "string") {
    throw new ApiError(400, "notes must be a string when provided.");
  }

  const wellbeingData = data as WellbeingInput;

  if (wellbeingData.sleepHours < 0 || wellbeingData.sleepHours > 14) throw new ApiError(400, "sleepHours must be between 0 and 14.");
  if (wellbeingData.moodScore < 1 || wellbeingData.moodScore > 10) throw new ApiError(400, "moodScore must be between 1 and 10.");
  if (wellbeingData.stressScore < 1 || wellbeingData.stressScore > 10) throw new ApiError(400, "stressScore must be between 1 and 10.");
  if (wellbeingData.activityMinutes < 0 || wellbeingData.activityMinutes > 300) throw new ApiError(400, "activityMinutes must be between 0 and 300.");
  if (wellbeingData.restingHeartRate < 35 || wellbeingData.restingHeartRate > 160) throw new ApiError(400, "restingHeartRate must be between 35 and 160.");
  if (wellbeingData.waterIntake < 0 || wellbeingData.waterIntake > 8) throw new ApiError(400, "waterIntake must be between 0 and 8.");
  if (wellbeingData.fatigueLevel < 1 || wellbeingData.fatigueLevel > 10) throw new ApiError(400, "fatigueLevel must be between 1 and 10.");
  if (wellbeingData.socialInteraction < 1 || wellbeingData.socialInteraction > 10) throw new ApiError(400, "socialInteraction must be between 1 and 10.");

  return { ...wellbeingData, notes: wellbeingData.notes?.trim() ?? "" };
}
