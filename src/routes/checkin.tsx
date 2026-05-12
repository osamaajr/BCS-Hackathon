import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { createInsight } from "@/lib/nura/api";
import { getEnvironmentalContext } from "@/lib/nura/environment";
import { useNura } from "@/lib/nura/store";
import { useProfile } from "@/lib/nura/profile";
import type { ActivityLevel, BreakQuality, CheckIn, PreventativeSymptom } from "@/lib/nura/types";
import { Disclaimer } from "@/components/nura/Disclaimer";
import { Activity, Battery, Brain, Droplets, HeartPulse, Moon, NotebookPen, Sparkles, Waves } from "lucide-react";

export const Route = createFileRoute("/checkin")({
  head: () => ({
    meta: [
      { title: "Daily Wellness Check-In — Nura" },
      { name: "description", content: "Track sleep, stress, activity, hydration, energy and preventative wellness signals." },
    ],
  }),
  component: CheckInPage,
});

const symptoms: PreventativeSymptom[] = [
  "persistent fatigue",
  "headaches",
  "poor sleep",
  "mental exhaustion",
  "low motivation",
  "appetite changes",
  "anxiety",
  "none",
];

const defaults: CheckIn = {
  date: new Date().toISOString(),
  sleepHours: 7,
  sleepQuality: 7,
  activityLevel: "Moderate",
  waterIntake: 2,
  restingHeartRate: 70,
  energyLevel: 7,
  stressLevel: 4,
  focusLevel: 7,
  emotionalBalance: 7,
  meaningfulBreaks: "Somewhat",
  symptoms: ["none"],
  notes: "",
};

function CheckInPage() {
  const navigate = useNavigate();
  const { setLatest } = useNura();
  const { profile } = useProfile();
  const [form, setForm] = useState<CheckIn>(defaults);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof CheckIn>(k: K, v: CheckIn[K]) => setForm((f) => ({ ...f, [k]: v }));

  const toggleSymptom = (symptom: PreventativeSymptom) => {
    setForm((current) => {
      if (symptom === "none") return { ...current, symptoms: ["none"] };
      const withoutNone = current.symptoms.filter((item) => item !== "none");
      const next = withoutNone.includes(symptom)
        ? withoutNone.filter((item) => item !== symptom)
        : [...withoutNone, symptom];
      return { ...current, symptoms: next.length ? next : ["none"] };
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const checkIn = { ...form, date: new Date().toISOString() };
      const scored = await createInsight(checkIn, profile, getEnvironmentalContext(profile.postcode));
      setLatest(scored);
      navigate({ to: "/dashboard" });
    } catch {
      setError("Nura couldn't reach the wellness engine just now. Check that the backend is running and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-brand">Daily wellness check-in</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Build today’s health profile</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Nura turns simple daily inputs into trend-aware wellness observations.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <Section title="Physical Wellness" desc="Sleep, movement, hydration and energy inputs.">
          <NumberField icon={Moon} label="Sleep duration" suffix="hours" min={0} max={14} step={0.5} value={form.sleepHours} onChange={(v) => update("sleepHours", v)} />
          <SliderField icon={Sparkles} label="Sleep quality" value={form.sleepQuality} onChange={(v) => update("sleepQuality", v)} />
          <SegmentedField<ActivityLevel> icon={Activity} label="Activity level" value={form.activityLevel} options={["Low", "Moderate", "High"]} onChange={(v) => update("activityLevel", v)} />
          <NumberField icon={Droplets} label="Water intake" suffix="litres" min={0} max={6} step={0.1} value={form.waterIntake} onChange={(v) => update("waterIntake", v)} />
          <NumberField icon={HeartPulse} label="Resting heart rate" suffix="bpm" min={40} max={140} step={1} value={form.restingHeartRate} onChange={(v) => update("restingHeartRate", v)} />
          <SliderField icon={Battery} label="Energy level" value={form.energyLevel} onChange={(v) => update("energyLevel", v)} />
        </Section>

        <Section title="Lifestyle & Recovery" desc="Stress, mental clarity, emotional balance and meaningful breaks.">
          <SliderField icon={Brain} label="Stress load" value={form.stressLevel} onChange={(v) => update("stressLevel", v)} />
          <SliderField icon={Sparkles} label="Mental clarity" value={form.focusLevel} onChange={(v) => update("focusLevel", v)} />
          <SliderField icon={Waves} label="Emotional balance" value={form.emotionalBalance} onChange={(v) => update("emotionalBalance", v)} />
          <SegmentedField<BreakQuality> icon={NotebookPen} label="Meaningful breaks" value={form.meaningfulBreaks} options={["Yes", "Somewhat", "No"]} onChange={(v) => update("meaningfulBreaks", v)} />
        </Section>

        <Section title="Preventative Health Signals" desc="Optional signals Nura can track longitudinally.">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card md:col-span-2">
            <p className="text-sm font-semibold">Signals to track</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {symptoms.map((symptom) => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold capitalize transition-colors ${
                    form.symptoms.includes(symptom) ? "border-brand bg-brand-soft text-foreground" : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
            <label className="block text-sm font-semibold">Context notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={4}
              placeholder="Optional: training, travel, late meals, unusual workload, or anything that affected today."
              className="mt-2 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
            />
          </div>
        </Section>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full gradient-brand py-4 text-sm font-semibold text-brand-foreground shadow-soft transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Generating wellness intelligence..." : "Generate my wellness insight"}
        </button>

        {error && <div className="rounded-2xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger">{error}</div>}

        <Disclaimer compact />
      </form>
    </div>
  );
}

type IconType = React.ComponentType<{ className?: string }>;

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function FieldShell({ icon: Icon, label, children, hint }: { icon: IconType; label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
            <Icon className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold">{label}</span>
        </div>
        {hint ? <span className="text-sm font-medium text-muted-foreground">{hint}</span> : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function NumberField({ icon, label, suffix, min, max, step, value, onChange }: { icon: IconType; label: string; suffix: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  return (
    <FieldShell icon={icon} label={label} hint={`${value} ${suffix}`}>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-[var(--brand)]" />
      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
        <span>{min}</span><span>{max}</span>
      </div>
    </FieldShell>
  );
}

function SliderField({ icon, label, value, onChange }: { icon: IconType; label: string; value: number; onChange: (v: number) => void }) {
  return <NumberField icon={icon} label={label} suffix="/ 10" min={1} max={10} step={1} value={value} onChange={onChange} />;
}

function SegmentedField<T extends string>({ icon, label, value, options, onChange }: { icon: IconType; label: string; value: T; options: T[]; onChange: (value: T) => void }) {
  return (
    <FieldShell icon={icon} label={label} hint={value}>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
              value === option ? "border-brand bg-brand-soft text-foreground" : "border-border bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </FieldShell>
  );
}
