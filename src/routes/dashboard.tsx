import { createFileRoute, Link } from "@tanstack/react-router";
import { useNura } from "@/lib/nura/store";
import { generateInsight, mockTrend, recommendations, scoreCheckIn } from "@/lib/nura/scoring";
import type { ScoredCheckIn } from "@/lib/nura/types";
import { Disclaimer } from "@/components/nura/Disclaimer";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, Brain, Droplets, HeartPulse, Moon, Smile, Sparkles, ArrowRight, RefreshCcw } from "lucide-react";
import { ClientOnly } from "@/components/nura/ClientOnly";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Wellbeing Dashboard — Nura" },
      { name: "description", content: "Your wellbeing risk score, AI insight, trends and personalised prevention steps." },
    ],
  }),
  component: Dashboard,
});

// Demo data for first-time visitors
const demo: ScoredCheckIn = scoreCheckIn({
  date: new Date().toISOString(),
  sleep: 5.5,
  mood: 5,
  stress: 8,
  activity: 12,
  restingHr: 88,
  water: 1.2,
  fatigue: 8,
  social: 3,
  notes: "Demo data — complete a check-in to personalise.",
  smokingAlcohol: false,
});

function Dashboard() {
  const { latest } = useNura();
  const data = latest ?? demo;
  const isDemo = !latest;

  const insight = generateInsight(data);
  const recs = recommendations(data);
  const trend = mockTrend(data.score);

  const levelColor =
    data.level === "Low" ? "bg-success/15 text-success border-success/30"
    : data.level === "Moderate" ? "bg-warning/15 text-warning-foreground border-warning/40"
    : "bg-danger/15 text-danger border-danger/40";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {isDemo && (
        <div className="mb-6 rounded-2xl border border-dashed border-brand/40 bg-brand-soft/40 p-4 text-sm">
          <span className="font-semibold">Demo view.</span>{" "}
          <Link to="/checkin" className="underline">Complete a check-in</Link> to see your personalised dashboard.
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand">Your wellbeing</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Today's risk pattern</h1>
        </div>
        <Link to="/checkin" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-muted">
          <RefreshCcw className="h-4 w-4" /> Redo check-in
        </Link>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {/* Score */}
        <div className="rounded-3xl border border-border gradient-card p-6 shadow-soft lg:col-span-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Wellbeing risk score</p>
          <div className="mt-4 flex items-center gap-6">
            <ScoreRing score={data.score} level={data.level} />
            <div>
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${levelColor}`}>
                {data.level} risk
              </span>
              <p className="mt-2 text-sm text-muted-foreground">
                {data.level === "Low" && "Your pattern looks gentle today."}
                {data.level === "Moderate" && "A few early signals to watch."}
                {data.level === "High" && "Several signals are stacking up — please be kind to yourself."}
              </p>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl gradient-brand text-brand-foreground"><Sparkles className="h-4 w-4" /></span>
            <p className="text-sm font-semibold">AI insight</p>
          </div>
          <p className="mt-4 text-base leading-relaxed text-foreground/90">{insight}</p>
          <p className="mt-3 text-xs text-muted-foreground">Generated from today's inputs · Not medical advice.</p>
        </div>
      </div>

      {/* Metric cards */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Metric icon={Moon} label="Sleep" value={`${data.sleep}h`} hint={data.sleep < 6 ? "Below recovery zone" : "Healthy range"} good={data.sleep >= 6} />
        <Metric icon={Brain} label="Stress" value={`${data.stress}/10`} hint={data.stress > 7 ? "Elevated" : "Manageable"} good={data.stress <= 7} />
        <Metric icon={Smile} label="Mood" value={`${data.mood}/10`} hint={data.mood < 5 ? "Lower than usual" : "Positive"} good={data.mood >= 5} />
        <Metric icon={Activity} label="Activity" value={`${data.activity} min`} hint={data.activity < 20 ? "Low movement" : "Active"} good={data.activity >= 20} />
        <Metric icon={HeartPulse} label="Resting HR" value={`${data.restingHr} bpm`} hint={data.restingHr > 90 ? "Elevated" : "Typical"} good={data.restingHr <= 90} />
        <Metric icon={Droplets} label="Hydration" value={`${data.water}L`} hint={data.water < 1.5 ? "Low" : "Well hydrated"} good={data.water >= 1.5} />
      </div>

      {/* Trend chart */}
      <div className="mt-5 rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">7-day risk trend</p>
          <p className="text-xs text-muted-foreground">Mock data · for demo</p>
        </div>
        <div className="mt-4 h-60 w-full">
          <ClientOnly fallback={<div className="h-full w-full animate-pulse rounded-2xl bg-muted/40" />}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.65 0.13 195)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.65 0.13 195)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="oklch(0.5 0.03 240)" tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} stroke="oklch(0.5 0.03 240)" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 220)" }} />
              <Area type="monotone" dataKey="score" stroke="oklch(0.6 0.13 195)" strokeWidth={2.5} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
          </ClientOnly>
        </div>
      </div>

      {/* What changed + recommendations */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <p className="text-sm font-semibold">What changed?</p>
          <p className="mt-1 text-xs text-muted-foreground">The biggest contributors to your score today.</p>
          <ul className="mt-4 space-y-3">
            {data.factors.length === 0 && <li className="text-sm text-muted-foreground">Nothing notable — keep your current rhythm.</li>}
            {data.factors.slice(0, 5).map((f) => (
              <li key={f.key} className="rounded-2xl border border-border bg-muted/30 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{f.label}</span>
                  <span className="text-xs font-medium text-brand">+{Math.round(f.weight)} pts</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{f.reason}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-border gradient-card p-6 shadow-card">
          <p className="text-sm font-semibold">Preventative recommendations</p>
          <p className="mt-1 text-xs text-muted-foreground">Small, evidence-led steps for the next 24 hours.</p>
          <ul className="mt-4 space-y-2.5">
            {recs.map((r) => (
              <li key={r} className="flex items-start gap-3 text-sm">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />
                <span>{r}</span>
              </li>
            ))}
          </ul>

          {data.level !== "Low" && (
            <Link to="/support" className="mt-5 inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground">
              See local support <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}

function ScoreRing({ score, level }: { score: number; level: string }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const stroke = level === "Low" ? "oklch(0.7 0.14 160)" : level === "Moderate" ? "oklch(0.78 0.13 75)" : "oklch(0.65 0.2 25)";
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
        <circle cx="55" cy="55" r={r} stroke="oklch(0.92 0.01 220)" strokeWidth="10" fill="none" />
        <circle cx="55" cy="55" r={r} stroke={stroke} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 0.8s ease" }} />
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

function Metric({ icon: Icon, label, value, hint, good }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; hint: string; good: boolean }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className={`mt-1 text-xs font-medium ${good ? "text-success" : "text-warning-foreground"}`}>{hint}</p>
    </div>
  );
}
