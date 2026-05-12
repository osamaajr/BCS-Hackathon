import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { HealthProfile } from "./types";

export const defaultHealthProfile: HealthProfile = {
  patientId: "P001",
  fullName: "Sam Williams",
  age: 54,
  ageRange: "45-54",
  biologicalSex: "Male",
  height: 178,
  weight: 99,
  postcode: "L8 0XX",
  lsoaCode: "E01006787",
  bmi: 31.2,
  smokingStatus: "Current smoker",
  alcoholFrequency: "Weekly",
  weeklyExerciseMinutes: 45,
  alcoholUnitsPerWeek: 18,
  activityLevel: "Low",
  hasAsthma: true,
  hasDiabetes: false,
  hasHypertension: true,
  systolicBp: 148,
  diastolicBp: 92,
  restingHeartRate: 86,
  glucoseMmolL: 6.8,
  existingConditions: "Asthma; hypertension",
  dietaryPreference: "",
  wellnessGoals: ["Improve fitness", "Reduce stress", "Increase activity consistency"],
};

type ProfileState = {
  profile: HealthProfile;
  updateProfile: (updates: Partial<HealthProfile>) => void;
  setProfile: (profile: HealthProfile) => void;
  resetProfile: () => void;
};

const ProfileContext = createContext<ProfileState | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<HealthProfile>(defaultHealthProfile);

  const value = useMemo<ProfileState>(() => ({
    profile,
    updateProfile: (updates) => setProfileState((current) => ({ ...current, ...updates })),
    setProfile: setProfileState,
    resetProfile: () => setProfileState(defaultHealthProfile),
  }), [profile]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used inside ProfileProvider");
  return context;
}
