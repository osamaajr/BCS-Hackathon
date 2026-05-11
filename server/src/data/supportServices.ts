import { MEDICAL_DISCLAIMER, EMERGENCY_DISCLAIMER } from "../constants/disclaimers";
import type { RiskLevel, SupportService } from "../types/wellbeing";

export const supportServicesByRiskLevel: Record<RiskLevel, SupportService[]> = {
  Low: [
    {
      id: "liverpool-community-hubs",
      name: "Liverpool Community Wellbeing Hubs",
      description: "Local community spaces for social connection, gentle activity, and everyday wellbeing support.",
      urgency: "Low",
      openingHours: "Varies by hub",
      contact: "Search Liverpool City Council wellbeing hubs",
      disclaimer: MEDICAL_DISCLAIMER,
    },
    {
      id: "university-wellbeing",
      name: "University Wellbeing Support",
      description: "Student wellbeing teams can help with stress, routines, academic pressure, and early support planning.",
      urgency: "Low",
      openingHours: "Weekdays, term-time hours vary",
      contact: "Contact your university student services or wellbeing team",
      disclaimer: MEDICAL_DISCLAIMER,
    },
  ],
  Moderate: [
    {
      id: "nhs-111",
      name: "NHS 111",
      description: "Non-emergency NHS advice if symptoms or wellbeing patterns feel concerning or are not improving.",
      urgency: "Medium",
      openingHours: "24/7",
      contact: "Call 111 or visit 111.nhs.uk",
      disclaimer: `${MEDICAL_DISCLAIMER} ${EMERGENCY_DISCLAIMER}`,
    },
    {
      id: "gp-support",
      name: "GP Support",
      description: "Your GP can help review ongoing changes in sleep, stress, fatigue, mood, or physical wellbeing.",
      urgency: "Medium",
      openingHours: "Practice hours vary",
      contact: "Contact your registered GP practice",
      disclaimer: MEDICAL_DISCLAIMER,
    },
    {
      id: "mersey-care-talking-therapies",
      name: "Merseyside Talking Therapies",
      description: "Local mental health support for stress, anxiety, low mood, and coping strategies.",
      urgency: "Medium",
      openingHours: "Service hours vary",
      contact: "Search NHS talking therapies in Liverpool or Merseyside",
      disclaimer: MEDICAL_DISCLAIMER,
    },
  ],
  High: [
    {
      id: "nhs-111-high",
      name: "NHS 111",
      description: "Use NHS 111 if you need urgent but non-emergency guidance or are unsure what support is appropriate.",
      urgency: "High",
      openingHours: "24/7",
      contact: "Call 111 or visit 111.nhs.uk",
      disclaimer: `${MEDICAL_DISCLAIMER} ${EMERGENCY_DISCLAIMER}`,
    },
    {
      id: "crisis-line-merseyside",
      name: "Local Mental Health Crisis Support",
      description: "If distress feels difficult to manage, seek urgent mental health support through local NHS crisis routes.",
      urgency: "High",
      openingHours: "24/7 services may be available",
      contact: "Search Mersey Care urgent mental health support or call NHS 111",
      disclaimer: `${MEDICAL_DISCLAIMER} ${EMERGENCY_DISCLAIMER}`,
    },
    {
      id: "gp-same-day",
      name: "Same-Day GP Advice",
      description: "For repeated high strain patterns, ask your GP practice about same-day advice or an urgent appointment.",
      urgency: "High",
      openingHours: "Practice hours vary",
      contact: "Contact your registered GP practice",
      disclaimer: MEDICAL_DISCLAIMER,
    },
  ],
};
