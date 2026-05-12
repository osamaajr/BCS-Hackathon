import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useNura } from "@/lib/nura/store";
import { getRecommendedResources, type RecommendedResource } from "@/lib/nura/api";
import { useProfile } from "@/lib/nura/profile";
import { Disclaimer } from "@/components/nura/Disclaimer";
import { Activity, ArrowRight, Cigarette, ClipboardPlus, Dumbbell, HeartPulse, HelpCircle, MapPin, Scale, ShieldCheck, Stethoscope, Wine } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Personalised Wellbeing Resources - Nura" },
      { name: "description", content: "Profile-based preventative wellbeing resources for the Nura prototype." },
    ],
  }),
  component: SupportPage,
});

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Smoking support": Cigarette,
  "Blood pressure": HeartPulse,
  "Healthy weight": Scale,
  Activity: Dumbbell,
  Alcohol: Wine,
  "Respiratory health": Stethoscope,
  "General guidance": HelpCircle,
  "Urgent guidance": ShieldCheck,
  "Example local context": MapPin,
};

function SupportPage() {
  const { latest } = useNura();
  const { profile } = useProfile();
  const [resources, setResources] = useState<RecommendedResource[]>([]);
  const [safetyNote, setSafetyNote] = useState("Nura does not diagnose conditions or replace professional medical advice. These resources are shown for preventative guidance only.");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRecommendedResources(profile, latest ?? undefined)
      .then((response) => {
        setResources(response.resources);
        setSafetyNote(response.safetyNote);
        setError(null);
      })
      .catch(() => {
        setResources([]);
        setError("Nura couldn't load personalised resources from the local prototype API. Check that the backend is running and refresh this page.");
      });
  }, [latest, profile]);

  const profileSignals = useMemo(() => [
    `Current smoker`,
    `BP ${profile.systolicBp}/${profile.diastolicBp}`,
    `BMI ${profile.bmi.toFixed(1)}`,
    `${profile.weeklyExerciseMinutes} exercise minutes/week`,
    `${profile.alcoholUnitsPerWeek} alcohol units/week`,
    profile.hasAsthma ? "Asthma history" : "No asthma recorded",
    profile.postcode,
  ], [profile]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-medium text-brand">Wellbeing resources</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Personalised wellbeing resources</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Resources suggested from Sam’s synthetic health profile and latest wellbeing patterns.
      </p>

      <div className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
            <ClipboardPlus className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Synthetic profile basis</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Simulated patient profile for prototype demonstration · Patient {profile.patientId} · {profile.fullName} · Age {profile.age} · {profile.postcode}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {profileSignals.map((signal) => (
                <span key={signal} className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs font-semibold text-foreground">
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && <div className="mt-6 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm">{error}</div>}

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>

      <section className="mt-8 rounded-3xl border border-border bg-muted/30 p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-background text-brand">
            <Activity className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold">Why these resources?</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              Nura uses structured synthetic health profile data such as smoking status, blood pressure, BMI, activity level, alcohol intake, asthma history, and postcode context to suggest preventative resources. Latest check-in patterns can also shape which support routes are prioritised.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-card">
        <p className="text-sm font-semibold">Safety note</p>
        <p className="mt-1 text-sm text-muted-foreground">{safetyNote}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/dashboard" className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-muted">Back to dashboard</Link>
        <Link to="/checkin" className="rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground">New check-in</Link>
      </div>

      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}

function ResourceCard({ resource }: { resource: RecommendedResource }) {
  const Icon = categoryIcons[resource.category] ?? HelpCircle;

  return (
    <article className="flex min-h-[20rem] flex-col rounded-3xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
          <Icon className="h-5 w-5" />
        </span>
        <span className="rounded-full border border-border bg-muted/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {resource.trustedSource}
        </span>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand">{resource.category}</p>
      <h2 className="mt-1 text-base font-semibold">{resource.title}</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Why relevant</p>
          <p className="mt-1 leading-relaxed text-foreground/85">{resource.whyRelevant}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recommended next step</p>
          <p className="mt-1 leading-relaxed text-foreground/85">{resource.nextStep}</p>
        </div>
      </div>
      <a
        href={resource.url}
        target="_blank"
        rel="noreferrer"
        className="mt-auto inline-flex items-center gap-1.5 self-start rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
      >
        {resource.urlLabel || "Learn more"} <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </article>
  );
}
