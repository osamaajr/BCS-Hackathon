import type { EnvironmentalContext } from "./types";

const contexts: Record<string, EnvironmentalContext> = {
  L1: {
    postcode: "L1",
    airQuality: "Moderate",
    greenSpaceAccess: "High",
    walkability: "Excellent",
    noisePollution: "Moderate",
    nearbyWellnessAccess: "Strong",
    nearbyServices: ["NHS Walk-In Centre", "Community Gym", "St John's Gardens", "City Wellbeing Hub"],
    wellnessSummary: "Central access, strong walkability and nearby green space may support consistent movement and wellbeing routines.",
  },
  L2: {
    postcode: "L2",
    airQuality: "Good",
    greenSpaceAccess: "Moderate",
    walkability: "Excellent",
    noisePollution: "Moderate",
    nearbyWellnessAccess: "Strong",
    nearbyServices: ["Local Pharmacy", "Waterfront Walking Route", "Wellbeing Hub", "Fitness Studio"],
    wellnessSummary: "A walkable local setting with useful wellness services nearby may make small preventative habits easier to repeat.",
  },
  L3: {
    postcode: "L3",
    airQuality: "Moderate",
    greenSpaceAccess: "Moderate",
    walkability: "Good",
    noisePollution: "Elevated",
    nearbyWellnessAccess: "Moderate",
    nearbyServices: ["Community Pharmacy", "University Gym", "Dockside Walking Area"],
    wellnessSummary: "Good walkability and service access may help activity consistency, while elevated noise could make recovery routines worth protecting.",
  },
  L8: {
    postcode: "L8",
    airQuality: "Good",
    greenSpaceAccess: "High",
    walkability: "Good",
    noisePollution: "Low",
    nearbyWellnessAccess: "Strong",
    nearbyServices: ["Sefton Park", "Community Health Centre", "Local Pharmacy", "Walking Group"],
    wellnessSummary: "Several nearby green spaces and community services may support outdoor movement, decompression and routine building.",
  },
};

const fallbackContexts: EnvironmentalContext[] = [
  {
    postcode: "Local area",
    airQuality: "Good",
    greenSpaceAccess: "Moderate",
    walkability: "Good",
    noisePollution: "Low",
    nearbyWellnessAccess: "Moderate",
    nearbyServices: ["Local Pharmacy", "Community Gym", "Nearby Park", "Walking Route"],
    wellnessSummary: "Your area appears to offer a balanced mix of movement-friendly routes and everyday wellness resources.",
  },
  {
    postcode: "Local area",
    airQuality: "Moderate",
    greenSpaceAccess: "High",
    walkability: "Good",
    noisePollution: "Moderate",
    nearbyWellnessAccess: "Strong",
    nearbyServices: ["NHS Service", "Wellbeing Hub", "Public Park", "Fitness Centre"],
    wellnessSummary: "Good access to green space and local resources may support simple preventative habits across the week.",
  },
  {
    postcode: "Local area",
    airQuality: "Moderate",
    greenSpaceAccess: "Moderate",
    walkability: "Limited",
    noisePollution: "Moderate",
    nearbyWellnessAccess: "Moderate",
    nearbyServices: ["Local Pharmacy", "Community Centre", "Quiet Walking Area"],
    wellnessSummary: "Local wellness resources are available, though planning movement or recovery time may make routines easier to sustain.",
  },
];

export function getEnvironmentalContext(postcode: string): EnvironmentalContext {
  const normalized = normalizePostcodeArea(postcode);
  const direct = contexts[normalized];
  if (direct) return direct;

  const seed = normalized.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return { ...fallbackContexts[seed % fallbackContexts.length], postcode: normalized || "Local area" };
}

function normalizePostcodeArea(postcode: string): string {
  return postcode.trim().toUpperCase().match(/^[A-Z]{1,2}\d{1,2}/)?.[0] ?? "";
}
