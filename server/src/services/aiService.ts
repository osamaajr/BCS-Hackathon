import OpenAI from "openai";
import { buildWellbeingInsightPrompt } from "../prompts/wellbeingInsightPrompt";
import type { RiskAssessment, WellbeingInput } from "../types/wellbeing";

const fallbackSummaries = {
  Low: "Your wellbeing pattern looks relatively steady today. The signals you shared suggest a supportive baseline, so the focus is on keeping your rhythm consistent rather than making big changes. Nura is not diagnosing anything; it is helping you notice patterns early.",
  Moderate: "Your current wellbeing score appears moderately elevated, mainly due to a few recovery or strain signals. This does not indicate a medical condition, but it may suggest your body could benefit from steadier rest, hydration, light movement, and stress recovery over the next day.",
  High: "Your current wellbeing score appears elevated, with several strain signals stacking together. This does not mean something is medically wrong, but it may be a useful prompt to slow down, reduce demands where possible, and seek support if this pattern continues or feels concerning.",
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
  ): Promise<string> {
    if (!this.client) {
      return fallbackSummaries[assessment.level];
    }

    try {
      const response = await this.client.responses.create({
        model: this.model,
        input: buildWellbeingInsightPrompt(wellbeingData, assessment),
        temperature: 0.4,
        max_output_tokens: 220,
      });

      return response.output_text?.trim() || fallbackSummaries[assessment.level];
    } catch (error) {
      console.error("OpenAI summary generation failed. Returning fallback summary.", error);
      return fallbackSummaries[assessment.level];
    }
  }
}
