import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, BadgeCheck, Cigarette, ClipboardPlus, Droplets, Dumbbell, Gauge, HeartPulse, MapPin, Scale, ShieldCheck, UserRound, Wine } from "lucide-react";
import { Disclaimer } from "@/components/nura/Disclaimer";
import { useProfile } from "@/lib/nura/profile";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Synthetic Health Profile - Nura" },
      { name: "description", content: "Synthetic NHS-style demo data for prototype preventative wellness insights." },
    ],
  }),
  component: HealthProfilePage,
});

function HealthProfilePage() {
  const { profile } = useProfile();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">Synthetic NHS-style demo data</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Synthetic Health Profile</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Simulated patient profile for prototype demonstration, showing how structured health and lifestyle data could support preventative wellness insights.
          </p>
        </div>
        <Link to="/checkin" className="inline-flex rounded-full gradient-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-soft">
          Use profile in check-in
        </Link>
      </div>

      <div className="mt-6 rounded-3xl border border-brand/25 bg-brand-soft/45 p-5 text-sm leading-relaxed text-foreground shadow-card">
        <span className="font-semibold">Prototype note:</span>{" "}
        This prototype uses synthetic NHS-style data to demonstrate how preventative wellness insights could be generated from structured health and lifestyle information. This is not real NHS patient data, not a live NHS integration, and not a diagnostic record.
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-border gradient-card p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl gradient-brand text-brand-foreground">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Patient Identity</h2>
              <p className="text-sm text-muted-foreground">Read-only simulated profile for demo workflows.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            <ProfileRow icon={BadgeCheck} label="Patient ID" value={profile.patientId} />
            <ProfileRow icon={UserRound} label="Name" value={profile.fullName} />
            <ProfileRow icon={Activity} label="Age and sex" value={`${profile.age} · ${profile.biologicalSex}`} />
            <ProfileRow icon={MapPin} label="Postcode and LSOA" value={`${profile.postcode} · ${profile.lsoaCode}`} />
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-soft text-brand">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Preventative Context</h2>
              <p className="text-sm text-muted-foreground">Structured signals Nura can use carefully in a real deployment.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ProfileMetric icon={Scale} label="BMI" value={profile.bmi.toFixed(1)} detail="Weight-related lifestyle context" />
            <ProfileMetric icon={Cigarette} label="Smoking status" value={profile.smokingStatus} detail="Lifestyle risk signal" />
            <ProfileMetric icon={Dumbbell} label="Weekly exercise" value={`${profile.weeklyExerciseMinutes} min`} detail="Activity consistency context" />
            <ProfileMetric icon={Wine} label="Alcohol units/week" value={`${profile.alcoholUnitsPerWeek}`} detail="Recovery and sleep context" />
            <ProfileMetric icon={HeartPulse} label="Blood pressure" value={`${profile.systolicBp}/${profile.diastolicBp}`} detail="Prototype reading only" />
            <ProfileMetric icon={Gauge} label="Resting heart rate" value={`${profile.restingHeartRate} bpm`} detail="Cardio wellness context" />
            <ProfileMetric icon={Droplets} label="Glucose" value={`${profile.glucoseMmolL} mmol/L`} detail="Structured health field" />
            <ProfileMetric icon={ClipboardPlus} label="Existing conditions" value={formatConditions(profile)} detail="Used only as context" />
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-3xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-lg font-semibold">How Nura Uses This</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <UseCard title="Wellness score" text="Applies light preventative context from lifestyle and cardiovascular signals without making a diagnosis." />
          <UseCard title="AI insights" text="References patterns such as BMI, smoking status, activity, alcohol and blood pressure using careful language." />
          <UseCard title="Recommendations" text="Suggests earlier lifestyle conversations and achievable habit changes, not treatment plans." />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Nura is not a diagnostic tool and does not replace professional medical advice.
        </p>
      </section>

      <div className="mt-8">
        <Disclaimer compact />
      </div>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
      <Icon className="mt-0.5 h-4 w-4 text-brand" />
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function ProfileMetric({ icon: Icon, label, value, detail }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/25 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-lg font-semibold">{value}</p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-background text-brand">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function UseCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/25 p-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

function formatConditions(profile: { hasAsthma: boolean; hasDiabetes: boolean; hasHypertension: boolean }) {
  const conditions = [
    profile.hasAsthma ? "Asthma" : null,
    profile.hasDiabetes ? "Diabetes" : null,
    profile.hasHypertension ? "Hypertension" : null,
  ].filter(Boolean);

  return conditions.length ? conditions.join(", ") : "None recorded";
}
