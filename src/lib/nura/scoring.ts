import type { CheckIn, RiskLevel, ScoredCheckIn } from "./types";

export function scoreCheckIn(c: CheckIn): ScoredCheckIn {
  const factors: ScoredCheckIn["factors"] = [];
  let score = 10; // baseline

  if (c.sleep < 6) {
    const w = (6 - c.sleep) * 8;
    score += w;
    factors.push({ key: "sleep", label: "Reduced sleep", weight: w, reason: `Only ${c.sleep}h sleep — recovery is limited below 6h.` });
  }
  if (c.stress > 7) {
    const w = (c.stress - 7) * 7;
    score += w;
    factors.push({ key: "stress", label: "Elevated stress", weight: w, reason: `Stress at ${c.stress}/10 puts strain on recovery.` });
  }
  if (c.mood < 5) {
    const w = (5 - c.mood) * 6;
    score += w;
    factors.push({ key: "mood", label: "Lower mood", weight: w, reason: `Mood at ${c.mood}/10 may signal emotional fatigue.` });
  }
  if (c.activity < 20) {
    const w = (20 - c.activity) * 0.6;
    score += w;
    factors.push({ key: "activity", label: "Low activity", weight: w, reason: `Only ${c.activity} min of movement today.` });
  }
  if (c.restingHr > 90) {
    const w = (c.restingHr - 90) * 1.2;
    score += w;
    factors.push({ key: "hr", label: "Elevated resting heart rate", weight: w, reason: `Resting HR ${c.restingHr} bpm is above the typical range.` });
  }
  if (c.water < 1.5) {
    const w = (1.5 - c.water) * 10;
    score += w;
    factors.push({ key: "water", label: "Low hydration", weight: w, reason: `${c.water}L of water — hydration is below 1.5L.` });
  }
  if (c.fatigue > 7) {
    const w = (c.fatigue - 7) * 6;
    score += w;
    factors.push({ key: "fatigue", label: "High fatigue", weight: w, reason: `Fatigue at ${c.fatigue}/10 — recovery may be incomplete.` });
  }
  if (c.social < 4) {
    const w = (4 - c.social) * 4;
    score += w;
    factors.push({ key: "social", label: "Low social interaction", weight: w, reason: `Social connection at ${c.social}/10 — isolation can increase risk.` });
  }
  if (c.smokingAlcohol) {
    score += 8;
    factors.push({ key: "lifestyle", label: "Smoking / alcohol today", weight: 8, reason: `Smoking or alcohol contributes to cumulative wellbeing risk.` });
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const level: RiskLevel = score < 35 ? "Low" : score < 65 ? "Moderate" : "High";

  factors.sort((a, b) => b.weight - a.weight);

  return { ...c, score, level, factors };
}

export function generateInsight(s: ScoredCheckIn): string {
  if (s.factors.length === 0) {
    return "Your current inputs look balanced. Sleep, stress, hydration and activity are all in healthy ranges. Keep this rhythm — consistency is what builds long-term resilience.";
  }
  const top = s.factors.slice(0, 3).map((f) => f.label.toLowerCase());
  const list =
    top.length === 1 ? top[0] : top.length === 2 ? `${top[0]} and ${top[1]}` : `${top[0]}, ${top[1]} and ${top[2]}`;
  const tone =
    s.level === "High"
      ? "This pattern suggests your body may not be recovering well right now."
      : s.level === "Moderate"
      ? "This pattern suggests some early signs your body could use more recovery."
      : "Your overall pattern is gentle — these are minor signals to watch.";
  return `Your current score is mainly influenced by ${list}. ${tone} This does not mean you have a medical condition. Consider prioritising rest, hydration, light movement and reaching out for support if this pattern continues.`;
}

export function recommendations(s: ScoredCheckIn): string[] {
  const recs: string[] = [];
  const keys = new Set(s.factors.map((f) => f.key));
  if (keys.has("sleep")) recs.push("Aim for a consistent 7–9h sleep window this week.");
  if (keys.has("stress")) recs.push("Try a 10-minute wind-down — breathing, a walk, or screen-free time.");
  if (keys.has("mood")) recs.push("Schedule one small thing that usually lifts your mood today.");
  if (keys.has("activity")) recs.push("Add a 20-minute light walk to break up sitting time.");
  if (keys.has("hr")) recs.push("Notice caffeine and late workouts — both can keep resting HR up.");
  if (keys.has("water")) recs.push("Keep a water bottle visible and aim for 2L across the day.");
  if (keys.has("fatigue")) recs.push("Protect a recovery evening — earlier dinner, dim lights, no late screens.");
  if (keys.has("social")) recs.push("Reach out to one person you trust — even a short message counts.");
  if (keys.has("lifestyle")) recs.push("Consider a lower-intake day tomorrow to give your system a break.");
  if (recs.length === 0) recs.push("Keep your current rhythm — consistency is the strongest prevention signal.");
  return recs;
}

export function mockTrend(currentScore: number): { day: string; score: number }[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const base = [42, 38, 51, 47, 55, 49, currentScore];
  return days.map((d, i) => ({ day: d, score: base[i] }));
}
