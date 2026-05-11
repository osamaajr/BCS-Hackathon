import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useNura } from "@/lib/nura/store";
import { createInsight } from "@/lib/nura/api";
import type { CheckIn } from "@/lib/nura/types";
import { Disclaimer } from "@/components/nura/Disclaimer";
import { Moon, Smile, Brain, Activity, HeartPulse, Droplets, BatteryLow, Users, Cigarette } from "lucide-react";

export const Route = createFileRoute("/checkin")({
  head: () => ({
    meta: [
      { title: "Daily Check-In — Nura" },
      { name: "description", content: "Log today's wellbeing in 60 seconds. Sleep, stress, mood, activity and more." },
    ],
  }),
  component: CheckInPage,
});

const defaults: CheckIn = {
  date: new Date().toISOString(),
  sleep: 7,
  mood: 7,
  stress: 4,
  activity: 30,
  restingHr: 70,
  water: 2,
  fatigue: 4,
  social: 6,
  notes: "",
  smokingAlcohol: false,
};

function CheckInPage() {
  const navigate = useNavigate();
  const { setLatest } = useNura();
  const [form, setForm] = useState<CheckIn>(defaults);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof CheckIn>(k: K, v: CheckIn[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const checkIn = { ...form, date: new Date().toISOString() };
      const scored = await createInsight(checkIn);
      setLatest(scored);
      navigate({ to: "/dashboard" });
    } catch {
      setError("Nura couldn't reach the backend just now. Check that the server is running and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-brand">Daily check-in</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">How are you today?</h1>
        <p className="mt-2 text-muted-foreground">A 60-second log — Nura will explain what your numbers mean.</p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <NumberField icon={Moon} label="Sleep last night" suffix="hours" min={0} max={14} step={0.5} value={form.sleep} onChange={(v) => update("sleep", v)} />
        <SliderField icon={Smile} label="Mood" min={1} max={10} value={form.mood} onChange={(v) => update("mood", v)} hint={`${form.mood}/10`} />
        <SliderField icon={Brain} label="Stress level" min={1} max={10} value={form.stress} onChange={(v) => update("stress", v)} hint={`${form.stress}/10`} />
        <NumberField icon={Activity} label="Activity today" suffix="minutes" min={0} max={300} step={5} value={form.activity} onChange={(v) => update("activity", v)} />
        <NumberField icon={HeartPulse} label="Resting heart rate" suffix="bpm" min={40} max={140} step={1} value={form.restingHr} onChange={(v) => update("restingHr", v)} />
        <NumberField icon={Droplets} label="Water intake" suffix="litres" min={0} max={6} step={0.1} value={form.water} onChange={(v) => update("water", v)} />
        <SliderField icon={BatteryLow} label="Fatigue level" min={1} max={10} value={form.fatigue} onChange={(v) => update("fatigue", v)} hint={`${form.fatigue}/10`} />
        <SliderField icon={Users} label="Social interaction" min={1} max={10} value={form.social} onChange={(v) => update("social", v)} hint={`${form.social}/10`} />

        <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
          <label className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
                <Cigarette className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold">Smoking or alcohol today?</span>
                <span className="block text-xs text-muted-foreground">Counts toward cumulative wellbeing risk.</span>
              </span>
            </span>
            <button
              type="button"
              onClick={() => update("smokingAlcohol", !form.smokingAlcohol)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${form.smokingAlcohol ? "bg-brand" : "bg-muted"}`}
              aria-pressed={form.smokingAlcohol}
            >
              <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-card shadow transition-transform ${form.smokingAlcohol ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </label>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
          <label className="block text-sm font-semibold">How are you feeling today?</label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            placeholder="Optional — anything on your mind."
            className="mt-2 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full gradient-brand py-4 text-sm font-semibold text-brand-foreground shadow-soft transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Creating your insight..." : "See my wellbeing insight"}
        </button>

        {error && (
          <div className="rounded-2xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
            {error}
          </div>
        )}

        <Disclaimer compact />
      </form>
    </div>
  );
}

type IconType = React.ComponentType<{ className?: string }>;

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
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[var(--brand)]"
      />
      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
        <span>{min}</span><span>{max}</span>
      </div>
    </FieldShell>
  );
}

function SliderField(props: { icon: IconType; label: string; min: number; max: number; value: number; onChange: (v: number) => void; hint: string }) {
  return <NumberField {...props} suffix="" step={1} />;
}
