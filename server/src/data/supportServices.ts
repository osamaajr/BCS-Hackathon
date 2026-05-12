import { MEDICAL_DISCLAIMER } from "../constants/disclaimers";
import type { RiskLevel, SupportService } from "../types/wellbeing";

export const supportServicesByRiskLevel: Record<RiskLevel, SupportService[]> = {
  Low: [
    {
      id: "liverpool-community-hubs",
      name: "Liverpool Community Wellbeing Hubs",
      description: "Local spaces for movement, connection, routine-building and sustainable lifestyle support.",
      urgency: "Low",
      openingHours: "Varies by hub",
      contact: "Search Liverpool City Council wellbeing hubs",
      disclaimer: MEDICAL_DISCLAIMER,
    },
    {
      id: "university-wellbeing",
      name: "University Wellbeing Support",
      description: "Routine wellbeing guidance for students balancing workload, sleep, stress and lifestyle consistency.",
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
      description: "Trusted non-emergency guidance if a physical or wellbeing pattern feels concerning or persists.",
      urgency: "Medium",
      openingHours: "24/7",
      contact: "Call 111 or visit 111.nhs.uk",
      disclaimer: MEDICAL_DISCLAIMER,
    },
    {
      id: "gp-support",
      name: "GP Support",
      description: "Professional review for repeated changes in energy, sleep, stress or physical wellness signals.",
      urgency: "Medium",
      openingHours: "Practice hours vary",
      contact: "Contact your registered GP practice",
      disclaimer: MEDICAL_DISCLAIMER,
    },
    {
      id: "merseyside-wellbeing-services",
      name: "Merseyside Wellbeing Services",
      description: "Local lifestyle, stress-management and wellbeing resources across Liverpool and Merseyside.",
      urgency: "Medium",
      openingHours: "Service hours vary",
      contact: "Search local NHS wellbeing services",
      disclaimer: MEDICAL_DISCLAIMER,
    },
  ],
  High: [
    {
      id: "nhs-111-high",
      name: "NHS 111",
      description: "Use NHS 111 for non-emergency professional guidance if repeated wellness signals feel unusual for you.",
      urgency: "High",
      openingHours: "24/7",
      contact: "Call 111 or visit 111.nhs.uk",
      disclaimer: MEDICAL_DISCLAIMER,
    },
    {
      id: "lifestyle-review",
      name: "Lifestyle Review Support",
      description: "A structured conversation with a wellbeing adviser, coach, or clinician can help translate repeated patterns into sustainable changes.",
      urgency: "Medium",
      openingHours: "Service hours vary",
      contact: "Search Liverpool wellbeing and lifestyle support",
      disclaimer: MEDICAL_DISCLAIMER,
    },
    {
      id: "gp-review",
      name: "GP Review",
      description: "If physical signals persist over time, a GP can help review context and decide whether further support is useful.",
      urgency: "Medium",
      openingHours: "Practice hours vary",
      contact: "Contact your registered GP practice",
      disclaimer: MEDICAL_DISCLAIMER,
    },
  ],
};
