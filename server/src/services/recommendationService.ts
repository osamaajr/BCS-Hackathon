import type { HealthProfile, Recommendation, RiskAssessment } from "../types/wellbeing";

const recommendationMap: Record<string, Recommendation> = {
  sleep: {
    id: "sleep-consistency",
    title: "Keep sleep consistent",
    description: "Protect a repeatable wind-down window and keep the next wake-up time steady.",
    category: "sleep",
  },
  stress: {
    id: "stress-load-reset",
    title: "Reduce stress carryover",
    description: "Use a short decompression block after the highest-demand part of the day.",
    category: "stress",
  },
  balance: {
    id: "balance-ritual",
    title: "Create a balance ritual",
    description: "Add one predictable reset point, such as a walk, screen break, or quiet meal, to improve emotional and cognitive balance.",
    category: "balance",
  },
  activity: {
    id: "activity-consistency",
    title: "Keep activity realistic",
    description: "Choose a movement target you can actually repeat rather than a high-effort session.",
    category: "activity",
  },
  hydration: {
    id: "hydration-optimization",
    title: "Raise your hydration baseline",
    description: "Spread hydration across the day and pair water with routine anchors like meals, work blocks, or training.",
    category: "hydration",
  },
  energy: {
    id: "energy-support",
    title: "Support energy basics",
    description: "Prioritize sleep consistency, hydration and a lighter evening routine.",
    category: "energy",
  },
  breaks: {
    id: "meaningful-breaks",
    title: "Schedule meaningful breaks",
    description: "Place one or two short breaks before your energy drops, not only after fatigue appears.",
    category: "breaks",
  },
  signals: {
    id: "signal-tracking",
    title: "Track recurring signals",
    description: "Watch whether the same physical or lifestyle signals repeat across the next few check-ins.",
    category: "signals",
  },
  "heart-rate": {
    id: "heart-rate-calm",
    title: "Notice strain signals",
    description: "If your resting heart rate stays higher than usual, consider caffeine, sleep, stress, hydration, and recent exertion.",
    category: "heart-rate",
  },
  lifestyle: {
    id: "lower-intake-day",
    title: "Support tomorrow's basics",
    description: "A lower-intake day tomorrow may help sleep quality, hydration, and energy feel steadier.",
    category: "lifestyle",
  },
  bmi: {
    id: "profile-bmi-activity",
    title: "Build a sustainable activity base",
    description: "Use short, repeatable movement blocks to support weight, energy and cardiovascular wellbeing over time.",
    category: "activity",
  },
  smoking: {
    id: "profile-smoking-conversation",
    title: "Plan a smoking support conversation",
    description: "Consider discussing smoking reduction or cessation support with a qualified professional when ready.",
    category: "lifestyle",
  },
  "activity-profile": {
    id: "profile-weekly-activity",
    title: "Raise weekly movement gradually",
    description: "Add small walking or mobility sessions across the week before increasing intensity.",
    category: "activity",
  },
  "blood-pressure": {
    id: "profile-blood-pressure-review",
    title: "Keep blood pressure in view",
    description: "Track how sleep, stress, activity, alcohol and smoking patterns line up with blood pressure readings over time.",
    category: "heart-rate",
  },
  "alcohol-units": {
    id: "profile-alcohol-units",
    title: "Review alcohol and recovery",
    description: "Notice whether lower-alcohol weeks align with steadier sleep, energy and blood pressure readings.",
    category: "lifestyle",
  },
};

const generalRecommendations: Recommendation[] = [
  {
    id: "steady-rhythm",
    title: "Keep your wellness rhythm steady",
    description: "Consistency across sleep, hydration, movement and breaks is often more useful than making big changes.",
    category: "general",
  },
  {
    id: "screen-boundary",
    title: "Create a screen boundary",
    description: "A short screen-free block before bed can support calmer sleep and lower cognitive load.",
    category: "general",
  },
  {
    id: "trend-review",
    title: "Review the trend, not just today",
    description: "Look for repeated changes across several check-ins; Nura is most useful when patterns become visible over time.",
    category: "general",
  },
];

export function generateRecommendations(assessment: RiskAssessment, profile?: HealthProfile): Recommendation[] {
  const recommendations = assessment.factors
    .map((factor) => recommendationMap[factor.key])
    .filter(Boolean)
    .slice(0, 4);

  if (profile?.wellnessGoals.includes("Improve sleep") && !recommendations.some((item) => item.category === "sleep")) {
    recommendations.unshift({
      id: "profile-goal-sleep",
      title: "Prioritize your sleep goal",
      description: "Because improving sleep is one of your goals, keep bedtime and wake time steady before changing anything more complex.",
      category: "sleep",
    });
  }

  if (profile?.wellnessGoals.includes("Increase activity consistency") && profile.activityLevel !== "High") {
    recommendations.push({
      id: "profile-goal-activity",
      title: "Build activity consistency",
      description: profile.activityLevel === "Low"
        ? "Start with a short repeatable walk or mobility block rather than a demanding session."
        : "Keep moderate movement regular and avoid turning every active day into a high-effort day.",
      category: "activity",
    });
  }

  if (profile?.wellnessGoals.includes("Reduce stress") && !recommendations.some((item) => item.category === "stress")) {
    recommendations.push({
      id: "profile-goal-stress",
      title: "Lower stress carryover",
      description: "Add a short transition between work blocks and personal time so stress does not spill into sleep and energy.",
      category: "stress",
    });
  }

  if (profile?.alcoholFrequency === "Most days") {
    recommendations.push({
      id: "profile-alcohol-sleep",
      title: "Notice sleep and alcohol patterns",
      description: "Track whether lower-intake evenings line up with steadier sleep quality and morning energy.",
      category: "lifestyle",
    });
  }

  if (profile?.smokingStatus === "Current smoker" && !recommendations.some((item) => item.id === "profile-smoking-conversation")) {
    recommendations.push(recommendationMap.smoking);
  }

  if (profile?.hasHypertension && !recommendations.some((item) => item.id === "profile-blood-pressure-review")) {
    recommendations.push(recommendationMap["blood-pressure"]);
  }

  for (const recommendation of generalRecommendations) {
    if (recommendations.length >= 5) break;
    if (!recommendations.some((item) => item.id === recommendation.id)) {
      recommendations.push(recommendation);
    }
  }

  const unique = recommendations.filter((recommendation, index, list) => (
    list.findIndex((item) => item.id === recommendation.id) === index
  ));

  return unique.slice(0, Math.max(3, Math.min(5, unique.length)));
}
