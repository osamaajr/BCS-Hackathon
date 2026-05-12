import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getCheckInHistory, type CheckInHistoryResponse } from "@/lib/nura/api";
import { getEnvironmentalContext } from "@/lib/nura/environment";
import { useNura } from "@/lib/nura/store";
import { useProfile } from "@/lib/nura/profile";
import { mockTrend, scoreCheckIn } from "@/lib/nura/scoring";
import type { CheckIn, ScoredCheckIn } from "@/lib/nura/types";
import { Disclaimer } from "@/components/nura/Disclaimer";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Battery, Brain, Building2, Cigarette, ClipboardPlus, Droplets, Dumbbell, Footprints, Gauge, HeartPulse, Leaf, MapPin, Moon, RefreshCcw, Scale, ShieldCheck, Sparkles, Trees, UserRound, Volume2, Waves, Wind, Wine } from "lucide-react";
import { ClientOnly } from "@/components/nura/ClientOnly";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Wellness Intelligence Dashboard — Nura" },
      { name: "description", content: "Personalized preventative wellness score, trend observations and AI insights." },
    ],
  }),
  component: Dashboard,
});

const demoInput: CheckIn = {
  date: new Date().toISOString(),
  sleepHours: 6.4,
  sleepQuality: 6,
  activityLevel: "Moderate",
  waterIntake: 1.6,
  restingHeartRate: 76,
  energyLevel: 6,
  stressLevel: 7,
  focusLevel: 6,
  emotionalBalance: 6,
  meaningfulBreaks: "Somewhat",
  symptoms: ["poor sleep"],
  notes: "Demo data - complete a check-in to personalize.",
};

function Dashboard() {
  const { latest } = useNura();
  const { profile } = useProfile();
  const [history, setHistory] = useState<CheckInHistoryResponse | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const data = latest ?? scoreCheckIn(demoInput, profile);
  const isDemo = !latest;
  const environmentalContext = useMemo(() => getEnvironmentalContext(profile.postcode), [profile.postcode]);

  useEffect(() => {
    getCheckInHistory()
      .then((response) => {
        setHistory(response);
        setHistoryError(null);
      })
      .catch(() => setHistoryError("Nura couldn't load recent wellness history."));
  }, [latest]);

  const trend = useMemo(() => {
    if (!history?.checkIns.length) return mockTrend(data.wellnessScore);

    return history.checkIns.map((entry, index) => ({
      day: new Date(entry.createdAt).toLocaleDateString(undefined, { weekday: "short" }) || `Day ${index + 1}`,
      score: entry.assessment.wellnessScore,
      stress: entry.wellbeingData.stressLevel * 10,
      hydration: Math.min(100, (entry.wellbeingData.waterIntake / 2.5) * 100),
      sleep: entry.wellbeingData.sleepQuality * 10,
      balance: entry.wellbeingData.emotionalBalance * 10,
      activity: entry.wellbeingData.activityLevel === "High" ? 90 : entry.wellbeingData.activityLevel === "Moderate" ? 70 : 45,
    }));
  }, [data.wellnessScore, history]);

  const scoreTone =
    data.wellnessScore >= 75
      ? "border-success/30 bg-success/15 text-success"
      : data.wellnessScore >= 58
        ? "border-warning/40 bg-warning/15 text-warning-foreground"
        : "border-danger/40 bg-danger/15 text-danger";

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-18">
      {isDemo && (
        <div className="mb-8 rounded-3xl border border-dashed border-brand/35 bg-brand-soft/45 p-5 text-sm shadow-card">
          <span className="font-semibold">Demo intelligence view.</span>{" "}
          <Link to="/checkin" className="underline">Complete a check-in</Link> to generate a personalized wellness profile.
        </div>
      )}

      <div className="relative overflow-hidden rounded-[2.25rem] border border-border/70 gradient-hero p-8 shadow-soft md:p-12">
        <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-brand">Health intelligence</p>
          <h1 className="text-editorial mt-4 max-w-3xl text-5xl md:text-7xl">
            Your preventative wellness
            <span className="hero-accent mt-1 block text-6xl md:text-7xl">profile.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">A grounded view of sleep, stress, activity, hydration, energy and emotional balance trends.</p>
        </div>
        <Link to="/checkin" className="premium-button inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/75 px-6 py-3 text-sm font-semibold shadow-card backdrop-blur hover:-translate-y-0.5 hover:bg-card">
          <RefreshCcw className="h-4 w-4" /> New check-in
        </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="premium-surface rounded-[2rem] p-7">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Wellness score</p>
          <div className="mt-5 flex items-center gap-6">
            <ScoreRing score={data.wellnessScore} />
            <div>
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${scoreTone}`}>
                {data.wellnessScore >= 75 ? "Balanced" : data.wellnessScore >= 58 ? "Watch" : "Needs attention"}
              </span>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">A simple summary of sleep, stress, activity, hydration, energy and emotional balance.</p>
            </div>
          </div>
        </div>

        <div className="premium-surface rounded-[2rem] p-7 lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl gradient-brand text-brand-foreground"><Sparkles className="h-4 w-4" /></span>
            <p className="text-sm font-semibold">AI preventative insight</p>
          </div>
          <p className="mt-5 text-base leading-8 text-foreground/90">
            {data.aiSummary ?? "Complete a check-in to generate a backend-powered AI wellness summary."}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">Pattern-aware wellness intelligence · Not medical advice.</p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-soft text-brand">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Synthetic Health Profile</p>
              <p className="text-sm text-muted-foreground">
                Synthetic NHS-style demo data · Patient {profile.patientId} · {profile.fullName} · Age {profile.age} · {profile.biologicalSex} · {profile.postcode}
              </p>
            </div>
          </div>
          <Link to="/profile" className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted">
            View profile
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ProfileSignal icon={Scale} label="BMI" value={profile.bmi.toFixed(1)} detail="Lifestyle and weight context" />
          <ProfileSignal icon={Cigarette} label="Smoking status" value={profile.smokingStatus} detail="Structured lifestyle field" />
          <ProfileSignal icon={Dumbbell} label="Weekly exercise" value={`${profile.weeklyExerciseMinutes} min`} detail="Below common activity targets" />
          <ProfileSignal icon={HeartPulse} label="Blood pressure" value={`${profile.systolicBp}/${profile.diastolicBp}`} detail="Prototype reading only" />
          <ProfileSignal icon={Gauge} label="Resting heart rate" value={`${profile.restingHeartRate} bpm`} detail="Used as wellness context" />
          <ProfileSignal icon={Wine} label="Alcohol units/week" value={`${profile.alcoholUnitsPerWeek}`} detail="Recovery and lifestyle context" />
          <ProfileSignal icon={ClipboardPlus} label="Existing conditions" value={formatConditions(profile)} detail="No diagnosis made by Nura" wide />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          This prototype uses synthetic NHS-style data to demonstrate how preventative wellness insights could be generated from structured health and lifestyle information. Nura is not a diagnostic tool and does not replace professional medical advice.
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Snapshot icon={Moon} label="Sleep Quality" value={`${data.sleepQuality}/10`} sub={`${data.sleepHours}h last night`} />
        <Snapshot icon={Brain} label="Stress Load" value={data.stressLoad} sub="Self-reported today" />
        <Snapshot icon={Battery} label="Energy Level" value={`${data.energyLevel}/10`} sub="Energy today" />
        <Snapshot icon={Droplets} label="Hydration" value={data.waterIntake >= 2 ? "On Track" : "Below Ideal"} sub={`${data.waterIntake}L today`} />
        <Snapshot icon={Activity} label="Activity" value={data.activityLevel} sub="Movement level" />
        <Snapshot icon={Waves} label="Balance" value={data.emotionalBalance >= 7 ? "Stable" : "Variable"} sub={`Emotional balance ${data.emotionalBalance}/10`} />
      </div>

      <section className="mt-5 rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-soft text-brand">
                <MapPin className="h-4 w-4" />
              </span>
              <p className="text-sm font-semibold">Environmental Context</p>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Lightweight local context for {environmentalContext.postcode}, used to enrich your personal wellness trends.
            </p>
          </div>
          <span className="rounded-full border border-brand/25 bg-brand-soft px-3 py-1 text-xs font-semibold text-foreground">
            Contextual enrichment
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <EnvironmentalCard
            icon={Wind}
            label="Air Quality"
            value={environmentalContext.airQuality}
            description={airQualityDescription(environmentalContext.airQuality)}
          />
          <EnvironmentalCard
            icon={Trees}
            label="Green Space Access"
            value={environmentalContext.greenSpaceAccess}
            description={greenSpaceDescription(environmentalContext.greenSpaceAccess)}
          />
          <EnvironmentalCard
            icon={Footprints}
            label="Walkability"
            value={environmentalContext.walkability}
            description={walkabilityDescription(environmentalContext.walkability)}
          />
          <EnvironmentalCard
            icon={Volume2}
            label="Noise Pollution"
            value={environmentalContext.noisePollution}
            description={noiseDescription(environmentalContext.noisePollution)}
          />
          <EnvironmentalCard
            icon={Building2}
            label="Nearby Wellness Access"
            value={environmentalContext.nearbyWellnessAccess}
            description={servicesDescription(environmentalContext.nearbyWellnessAccess)}
          />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-border bg-muted/25 p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-background text-brand">
                <Leaf className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Local wellness signal</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{environmentalContext.wellnessSummary}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/25 p-4">
            <p className="text-sm font-semibold">Local Wellness Resources</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {environmentalContext.nearbyServices.map((service) => (
                <span key={service} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground">
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Privacy note: postcode data is used only to personalize generalized local wellness context. Environmental context is mocked for this prototype and does not support clinical conclusions.
        </p>
      </section>

      <div className="mt-5 rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-soft text-brand">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <p className="text-sm font-semibold">Preventative insights</p>
          </div>
          <span className="text-xs text-muted-foreground">{history?.checkIns.length ?? 0}/7 recent check-ins</span>
        </div>
        {historyError && <p className="mt-3 text-sm text-warning-foreground">{historyError}</p>}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[...(data.preventativeInsights ?? []), ...(history?.trendInsights.map((item) => item.description) ?? [])].slice(0, 4).map((insight, index) => (
            <div key={`${insight}-${index}`} className="rounded-2xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-semibold">Insight {index + 1}</p>
              <p className="mt-1 text-sm text-muted-foreground">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Health timeline</p>
          <p className="text-xs text-muted-foreground">{history?.checkIns.length ? "Recent check-ins" : "Demo timeline"}</p>
        </div>
        <div className="mt-4 h-72 w-full">
          <ClientOnly fallback={<div className="h-full w-full animate-pulse rounded-2xl bg-muted/40" />}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="wellness" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.13 195)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="oklch(0.65 0.13 195)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 220)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="oklch(0.5 0.03 240)" />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} stroke="oklch(0.5 0.03 240)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 220)" }} />
                <Area type="monotone" dataKey="score" name="Wellness score" stroke="oklch(0.6 0.13 195)" strokeWidth={2.5} fill="url(#wellness)" />
                <Line type="monotone" dataKey="sleep" name="Sleep quality" stroke="oklch(0.7 0.14 160)" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="stress" name="Stress load" stroke="oklch(0.65 0.2 25)" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="hydration" name="Hydration" stroke="oklch(0.68 0.12 230)" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="balance" name="Emotional balance" stroke="oklch(0.72 0.12 145)" strokeWidth={2.5} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ClientOnly>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <p className="text-sm font-semibold">Optimization factors</p>
          <ul className="mt-4 space-y-3">
            {data.factors.length === 0 && <li className="text-sm text-muted-foreground">No major optimization gaps today. Maintain the rhythm.</li>}
            {data.factors.slice(0, 5).map((f) => (
              <li key={f.key} className="rounded-2xl border border-border bg-muted/30 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{f.label}</span>
                  <span className="text-xs font-medium text-brand">{Math.round(f.weight)} signal pts</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{f.reason}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-border gradient-card p-6 shadow-card">
          <p className="text-sm font-semibold">Personalized recommendations</p>
          <ul className="mt-4 space-y-2.5">
            {(data.recommendations ?? []).map((r) => (
              <li key={r.id} className="flex items-start gap-3 text-sm">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />
                <span><span className="font-medium">{r.title}:</span> {r.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
        <circle cx="55" cy="55" r={r} stroke="oklch(0.92 0.01 220)" strokeWidth="10" fill="none" />
        <circle cx="55" cy="55" r={r} stroke="oklch(0.6 0.13 195)" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-3xl font-semibold">{score}</div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">/ 100</div>
        </div>
      </div>
    </div>
  );
}

function Snapshot({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card lg:col-span-1">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-brand" />
      </div>
      <p className="mt-3 text-xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function ProfileSignal({ icon: Icon, label, value, detail, wide }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; detail: string; wide?: boolean }) {
  return (
    <div className={`rounded-2xl border border-border bg-muted/25 p-4 ${wide ? "lg:col-span-2" : ""}`}>
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

function formatConditions(profile: { hasAsthma: boolean; hasDiabetes: boolean; hasHypertension: boolean }) {
  const conditions = [
    profile.hasAsthma ? "Asthma" : null,
    profile.hasDiabetes ? "Diabetes" : null,
    profile.hasHypertension ? "Hypertension" : null,
  ].filter(Boolean);

  return conditions.length ? conditions.join(", ") : "None recorded";
}

function EnvironmentalCard({ icon: Icon, label, value, description }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; description: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-lg font-semibold">{value}</p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function airQualityDescription(value: string) {
  if (value === "Good") return "Outdoor routines are likely to feel comfortable for most everyday activity.";
  if (value === "Poor") return "A lighter recovery-focused routine may feel more supportive today.";
  return "Moderate conditions may be worth considering alongside sleep, stress and recovery.";
}

function greenSpaceDescription(value: string) {
  if (value === "High") return "Several nearby green spaces may support activity consistency and wellbeing.";
  if (value === "Limited") return "Planning quieter routes may help make outdoor movement more repeatable.";
  return "Some green space access may support short breaks, walks and decompression.";
}

function walkabilityDescription(value: string) {
  if (value === "Excellent") return "Daily movement can be woven into errands, commutes and short resets.";
  if (value === "Limited") return "Intentional movement blocks may be more useful than relying on incidental steps.";
  return "Local routes appear supportive for steady low-friction activity.";
}

function noiseDescription(value: string) {
  if (value === "Low") return "A quieter local setting may support rest and focused recovery routines.";
  if (value === "Elevated") return "Protecting wind-down time may help offset a busier local sound environment.";
  return "A normal urban sound level makes recovery routines worth keeping consistent.";
}

function servicesDescription(value: string) {
  if (value === "Strong") return "Helpful community, fitness and wellbeing resources appear nearby.";
  if (value === "Limited") return "A small set of local resources is available; planning ahead may help.";
  return "Local services offer useful support for everyday preventative wellbeing.";
}
