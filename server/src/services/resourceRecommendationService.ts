import type { HealthProfile, RecommendedResource, WellbeingInput } from "../types/wellbeing";

const NHS_111_URL = "https://111.nhs.uk/";
const RESOURCE_SEARCH_URL = "https://www.nhs.uk/service-search/";

export function getRecommendedResources(profile: HealthProfile, latestCheckIn?: WellbeingInput): RecommendedResource[] {
  const resources: RecommendedResource[] = [];

  resources.push({
    id: "nhs-111",
    title: "NHS 111",
    category: "General guidance",
    whyRelevant: "For non-emergency medical advice if Sam feels a symptom pattern is concerning or cannot contact his GP.",
    nextStep: "Use NHS 111 online or call 111 when advice is needed now but it is not an emergency.",
    trustedSource: "NHS",
    urlLabel: "View guidance",
    url: NHS_111_URL,
    priority: "General",
  });

  if (profile.smokingStatus === "Current smoker") {
    resources.push({
      id: "nhs-better-health-quit-smoking",
      title: "NHS Better Health Quit Smoking",
      category: "Smoking support",
      whyRelevant: "Sam’s synthetic profile records current smoking status. Smoking support may help reduce long-term cardiovascular and respiratory risk.",
      nextStep: "Explore NHS quit smoking guidance and consider a supported quit plan when ready.",
      trustedSource: "NHS Better Health",
      urlLabel: "View guidance",
      url: "https://www.nhs.uk/better-health/quit-smoking/",
      priority: "Core",
    });

    resources.push({
      id: "local-stop-smoking-support",
      title: "Local stop smoking support",
      category: "Smoking support",
      whyRelevant: "Local stop smoking services can offer structured support; this is relevant because Sam is recorded as a current smoker.",
      nextStep: "Search for a local stop smoking service and check suitability directly with the service.",
      trustedSource: "NHS Better Health",
      urlLabel: "Find support",
      url: "https://www.nhs.uk/better-health/quit-smoking/find-your-local-stop-smoking-service/",
      priority: "Helpful",
    });
  }

  if (profile.hasHypertension || profile.systolicBp >= 140 || profile.diastolicBp >= 90) {
    resources.push({
      id: "gp-blood-pressure-review",
      title: "GP blood pressure review",
      category: "Blood pressure",
      whyRelevant: `Sam’s synthetic profile includes blood pressure readings of ${profile.systolicBp}/${profile.diastolicBp} and hypertension history.`,
      nextStep: "Arrange a routine review with a GP practice or appropriate clinician if repeated readings remain high.",
      trustedSource: "Professional healthcare review",
      urlLabel: "Learn more",
      url: "https://www.nhs.uk/conditions/high-blood-pressure/",
      priority: "Core",
    });

    resources.push({
      id: "nhs-high-blood-pressure",
      title: "NHS high blood pressure information",
      category: "Blood pressure",
      whyRelevant: "Repeated high readings should be reviewed by a healthcare professional; NHS guidance explains what readings can mean.",
      nextStep: "Read NHS guidance and keep blood pressure context in view during future check-ins.",
      trustedSource: "NHS",
      urlLabel: "View guidance",
      url: "https://www.nhs.uk/conditions/high-blood-pressure/",
      priority: "Helpful",
    });

    resources.push({
      id: "pharmacy-blood-pressure-check",
      title: "Pharmacy blood pressure check",
      category: "Blood pressure",
      whyRelevant: "Some pharmacies can support blood pressure checks where appropriate; availability should be checked locally.",
      nextStep: "Use NHS service search or ask a local pharmacy whether blood pressure checks are available.",
      trustedSource: "NHS service search",
      urlLabel: "Search services",
      url: RESOURCE_SEARCH_URL,
      priority: "Helpful",
    });
  }

  if (profile.bmi >= 30) {
    resources.push({
      id: "nhs-weight-management",
      title: "NHS Better Health weight management",
      category: "Healthy weight",
      whyRelevant: `Sam’s synthetic profile records BMI ${profile.bmi.toFixed(1)}. Nura uses this neutrally as lifestyle context, not as a judgement.`,
      nextStep: "Review NHS healthy weight guidance and consider small, sustainable changes to eating and activity habits.",
      trustedSource: "NHS Better Health",
      urlLabel: "View guidance",
      url: "https://www.nhs.uk/better-health/lose-weight/",
      priority: "Core",
    });
  }

  if (profile.weeklyExerciseMinutes < 150 || latestCheckIn?.activityLevel === "Low") {
    resources.push({
      id: "nhs-physical-activity",
      title: "NHS physical activity guidance",
      category: "Activity",
      whyRelevant: `Sam’s synthetic profile records ${profile.weeklyExerciseMinutes} minutes of weekly exercise, so gentle activity consistency is a useful preventative focus.`,
      nextStep: "Review NHS activity guidance and choose a realistic movement target for the week.",
      trustedSource: "NHS",
      urlLabel: "View guidance",
      url: "https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-for-adults-aged-19-to-64/",
      priority: "Core",
    });

    resources.push({
      id: "nhs-couch-to-5k",
      title: "NHS Couch to 5K",
      category: "Activity",
      whyRelevant: "A beginner-friendly programme may help Sam build movement gradually if running or walk-run sessions feel appropriate.",
      nextStep: "Look at the plan and speak to a GP first if worried about health before getting started.",
      trustedSource: "NHS Better Health",
      urlLabel: "Learn more",
      url: "https://www.nhs.uk/better-health/get-active/get-running-with-couch-to-5k/couch-to-5k-running-plan/",
      priority: "Helpful",
    });

    resources.push({
      id: "l8-local-activity-context",
      title: "Local walking and community activity options near L8",
      category: "Example local context",
      whyRelevant: "Sam’s postcode context suggests local activity options may be useful for building routine without relying on intense exercise.",
      nextStep: "Use this as example local context only; verify services, routes and suitability before attending.",
      trustedSource: "Example local resource, not verified",
      urlLabel: "Search services",
      url: RESOURCE_SEARCH_URL,
      priority: "Helpful",
    });
  }

  if (profile.alcoholUnitsPerWeek > 14) {
    resources.push({
      id: "nhs-alcohol-advice",
      title: "NHS alcohol support guidance",
      category: "Alcohol",
      whyRelevant: `Sam’s synthetic profile records ${profile.alcoholUnitsPerWeek} alcohol units per week. UK low-risk guidance advises not regularly drinking more than 14 units per week.`,
      nextStep: "Review NHS alcohol advice and consider small reductions or drink-free days if that feels achievable.",
      trustedSource: "NHS",
      urlLabel: "View guidance",
      url: "https://www.nhs.uk/live-well/alcohol-advice/",
      priority: "Core",
    });

    resources.push({
      id: "drinkaware",
      title: "Drinkaware alcohol reduction support",
      category: "Alcohol",
      whyRelevant: "Drinkaware provides practical tools and information for understanding and reducing alcohol intake.",
      nextStep: "Use it as supportive information alongside NHS guidance, especially for tracking units.",
      trustedSource: "Drinkaware",
      urlLabel: "Learn more",
      url: "https://www.drinkaware.co.uk/",
      priority: "Helpful",
    });
  }

  if (profile.hasAsthma) {
    resources.push({
      id: "asthma-review-guidance",
      title: "Asthma review guidance",
      category: "Respiratory health",
      whyRelevant: "Sam’s synthetic profile records asthma history. Regular asthma reviews can help check control, inhaler technique and action plans.",
      nextStep: "Consider a routine GP or asthma nurse review if symptoms, inhaler use, or confidence with the action plan change.",
      trustedSource: "NHS",
      urlLabel: "View guidance",
      url: "https://www.nhs.uk/conditions/asthma/",
      priority: "Core",
    });
  }

  resources.push({
    id: "emergency-guidance",
    title: "999 or A&E for emergencies",
    category: "Urgent guidance",
    whyRelevant: "Included as a safety route only for serious or life-threatening symptoms.",
    nextStep: "Call 999 or go to A&E only in an emergency.",
    trustedSource: "NHS",
    urlLabel: "Learn more",
    url: "https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/",
    priority: "General",
  });

  return resources.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
}

function priorityRank(priority: RecommendedResource["priority"]): number {
  if (priority === "Core") return 0;
  if (priority === "Helpful") return 1;
  return 2;
}
