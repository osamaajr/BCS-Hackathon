import type { Recommendation, RiskAssessment } from "../types/wellbeing";

const recommendationMap: Record<string, Recommendation> = {
  sleep: {
    id: "sleep-consistency",
    title: "Protect a steady sleep window",
    description: "Aim for a consistent wind-down and wake-up time tonight, with screens lowered in the final hour.",
    category: "sleep",
  },
  stress: {
    id: "stress-reset",
    title: "Add a short stress reset",
    description: "Try ten minutes of breathing, stretching, journaling, or a quiet walk to help your system settle.",
    category: "stress",
  },
  mood: {
    id: "mood-lift",
    title: "Plan one mood-supporting action",
    description: "Choose one small thing that usually helps you feel steadier, such as music, fresh air, or a check-in with someone you trust.",
    category: "mood",
  },
  activity: {
    id: "light-movement",
    title: "Use gentle movement",
    description: "A light 15-20 minute walk can support energy, mood, and stress without turning today into a performance target.",
    category: "activity",
  },
  hydration: {
    id: "hydration-baseline",
    title: "Make hydration visible",
    description: "Keep water nearby and aim to spread intake across the day instead of catching up all at once.",
    category: "hydration",
  },
  fatigue: {
    id: "fatigue-recovery",
    title: "Reduce recovery load tonight",
    description: "Consider an easier evening: earlier food, dimmer lights, fewer late tasks, and permission to do less.",
    category: "fatigue",
  },
  social: {
    id: "social-connection",
    title: "Create a small moment of connection",
    description: "Send a short message, make a quick call, or spend time somewhere you feel less isolated.",
    category: "social",
  },
  "heart-rate": {
    id: "heart-rate-calm",
    title: "Notice strain signals",
    description: "If your resting heart rate stays higher than usual, consider caffeine, sleep, stress, hydration, and recent exertion.",
    category: "heart-rate",
  },
  lifestyle: {
    id: "lower-intake-day",
    title: "Support tomorrow's recovery",
    description: "A lower-intake day tomorrow may help sleep quality, hydration, and overall recovery feel steadier.",
    category: "lifestyle",
  },
};

const generalRecommendations: Recommendation[] = [
  {
    id: "steady-rhythm",
    title: "Keep your rhythm steady",
    description: "Consistency across sleep, meals, movement, and breaks is one of the strongest preventative wellbeing signals.",
    category: "general",
  },
  {
    id: "screen-boundary",
    title: "Create a screen boundary",
    description: "A short screen-free block before bed can support calmer sleep and lower cognitive load.",
    category: "general",
  },
  {
    id: "burnout-check",
    title: "Watch for repeated strain",
    description: "If elevated stress or fatigue continues for several days, consider talking with someone supportive early.",
    category: "general",
  },
];

export function generateRecommendations(assessment: RiskAssessment): Recommendation[] {
  const recommendations = assessment.factors
    .map((factor) => recommendationMap[factor.key])
    .filter(Boolean)
    .slice(0, 4);

  for (const recommendation of generalRecommendations) {
    if (recommendations.length >= 5) break;
    if (!recommendations.some((item) => item.id === recommendation.id)) {
      recommendations.push(recommendation);
    }
  }

  return recommendations.slice(0, Math.max(3, Math.min(5, recommendations.length)));
}
