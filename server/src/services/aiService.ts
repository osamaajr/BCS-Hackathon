import OpenAI from "openai";
import { buildWellbeingInsightPrompt } from "../prompts/wellbeingInsightPrompt";
import type { EnvironmentalContext, HealthProfile, RiskAssessment, WellbeingInput } from "../types/wellbeing";

const fallbackSummaries = {
  low: "Your check-in looks broadly balanced today. The most useful next step is to keep tracking sleep, stress, activity, hydration, energy and emotional balance so Nura can spot meaningful trends over time.",
  moderate: "Your recent inputs suggest a few areas to watch, especially how stress, sleep and energy interact. This does not indicate a medical condition, but it can support earlier lifestyle adjustments.",
  elevated: "Your check-in suggests stress or lifestyle strain may be affecting sleep, energy or balance. Nura recommends focusing on simple habits like sleep consistency, hydration, movement and breaks while tracking whether the pattern repeats.",
};

export class AiService {
  private client: OpenAI | null;
  private model: string;

  constructor() {
    this.client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
    this.model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  }

  async generateWellbeingSummary(
    wellbeingData: WellbeingInput,
    assessment: RiskAssessment,
    profile?: HealthProfile,
    environmentalContext?: EnvironmentalContext,
  ): Promise<string> {
    if (!this.client) {
      return fallbackForScore(assessment.wellnessScore, profile, environmentalContext);
    }

    try {
      const response = await this.client.responses.create({
        model: this.model,
        input: buildWellbeingInsightPrompt(wellbeingData, assessment, profile, environmentalContext),
        temperature: 0.4,
        max_output_tokens: 220,
      });

      return ensureSafetyWording(response.output_text?.trim() || fallbackForScore(assessment.wellnessScore, profile, environmentalContext));
    } catch (error) {
      console.error("OpenAI summary generation failed. Returning fallback summary.", error);
      return fallbackForScore(assessment.wellnessScore, profile, environmentalContext);
    }
  }
}

function ensureSafetyWording(summary: string): string {
  const safety = "Nura is not a diagnostic tool and does not replace professional medical advice.";
  return summary.includes(safety) ? summary : `${summary.replace(/\s+$/u, "")} ${safety}`;
}

function fallbackForScore(wellnessScore: number, profile?: HealthProfile, environmentalContext?: EnvironmentalContext): string {
  const name = profile?.fullName?.split(" ")[0];
  const goal = profile?.wellnessGoals?.[0]?.toLowerCase();
  const prefix = name ? `${name}, ` : "";
  const suffix = goal ? ` Since your current goal is to ${goal}, keep using check-ins to spot which habits move that trend.` : "";
  const context = environmentalContext ? ` Your local context suggests ${environmentalContext.walkability.toLowerCase()} walkability, ${environmentalContext.greenSpaceAccess.toLowerCase()} green space access and ${environmentalContext.nearbyWellnessAccess.toLowerCase()} nearby wellness resources; this can help Nura frame habits in a more practical way without treating the data as clinical evidence.` : "";
  const profileContext = profile ? ` ${name || "The synthetic profile"}'s synthetic NHS-style profile suggests several preventative lifestyle and cardiovascular risk factors, including BMI ${profile.bmi}, ${profile.smokingStatus.toLowerCase()} status, ${profile.weeklyExerciseMinutes} weekly exercise minutes, ${profile.alcoholUnitsPerWeek} alcohol units per week, and blood pressure readings of ${profile.systolicBp}/${profile.diastolicBp}. Nura highlights these patterns to support earlier preventative conversations and healthier lifestyle decisions, not to diagnose a condition.` : "";
  const safety = " Nura is not a diagnostic tool and does not replace professional medical advice.";
  if (wellnessScore >= 75) return `${prefix}${fallbackSummaries.low}${profileContext}${context}${suffix}${safety}`;
  if (wellnessScore >= 58) return `${prefix}${fallbackSummaries.moderate}${profileContext}${context}${suffix}${safety}`;
  return `${prefix}${fallbackSummaries.elevated}${profileContext}${context}${suffix}${safety}`;
}
