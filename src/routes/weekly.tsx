import { createFileRoute, Link } from "@tanstack/react-router";
import { Disclaimer } from "@/components/nura/Disclaimer";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Sparkles, TrendingDown, Award, AlertCircle } from "lucide-react";
import { ClientOnly } from "@/components/nura/ClientOnly";

export const Route = createFileRoute("/weekly")({
  head: () => ({
    meta: [
      { title: "Weekly Report — Nura" },
      { name: "description", content: "Your wellbeing patterns over the past week, with an AI-generated summary." },
    ],
  }),
  component: WeeklyPage,
});

const weekData = [
  { day: "Mon", score: 42, sleep: 6.8, stress: 6, mood: 6 },
  { day: "Tue", score: 38, sleep: 7.1, stress: 5, mood: 7 },
  { day: "Wed", score: 51, sleep: 6.2, stress: 7, mood: 5 },
  { day: "Thu", score: 47, sleep: 6.5, stress: 7, mood: 6 },
  { day: "Fri", score: 55, sleep: 5.8, stress: 8, mood: 5 },
  { day: "Sat", score: 49, sleep: 6.1, stress: 7, mood: 6 },
  { day: "Sun", score: 44, sleep: 7.0, stress: 6, mood: 7 },
];

function WeeklyPage() {
  const avg = Math.round(weekData.reduce((a, b) => a + b.score, 0) / weekData.length);
  const best = weekData.reduce((a, b) => (b.score < a.score ? b : a));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-medium text-brand">Weekly report</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Your week at a glance</h1>
      <p className="mt-2 text-muted-foreground">Patterns from your last 7 daily check-ins.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Avg. wellbeing score" value={String(avg)} sub="Moderate range" />
        <Stat label="Best day" value={best.day} sub={`Score ${best.score}`} icon={Award} />
        <Stat label="Most concerning" value="Stress" sub="Climbed mid-week" icon={AlertCircle} tone="warning" />
        <Stat label="Sleep trend" value="↘ 6.6h avg" sub="Slight drop vs last week" icon={TrendingDown} tone="warning" />
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl gradient-brand text-brand-foreground"><Sparkles className="h-4 w-4" /></span>
          <p className="text-sm font-semibold">AI-generated weekly summary</p>
        </div>
        <p className="mt-4 leading-relaxed text-foreground/90">
          This week, your stress levels were consistently high while sleep dropped below your usual range.
          Mood held up well overall, but mid-week fatigue suggests your recovery isn't fully catching up.
        </p>
        <div className="mt-5 rounded-2xl border border-brand/30 bg-brand-soft/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Suggested focus for next week</p>
          <p className="mt-1 text-sm text-foreground/90">
            Improving recovery through sleep consistency, hydration, and light activity. Aim for a 10pm wind-down and a 20-minute walk on at least 4 days.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <p className="text-sm font-semibold">Daily risk score</p>
          <div className="mt-4 h-56 w-full">
            <ClientOnly fallback={<div className="h-full w-full animate-pulse rounded-2xl bg-muted/40" />}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 220)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="oklch(0.5 0.03 240)" />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} stroke="oklch(0.5 0.03 240)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 220)" }} />
                <Bar dataKey="score" fill="oklch(0.65 0.13 195)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            </ClientOnly>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <p className="text-sm font-semibold">Sleep · Stress · Mood</p>
          <div className="mt-4 h-56 w-full">
            <ClientOnly fallback={<div className="h-full w-full animate-pulse rounded-2xl bg-muted/40" />}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 220)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="oklch(0.5 0.03 240)" />
                <YAxis domain={[0, 10]} tickLine={false} axisLine={false} stroke="oklch(0.5 0.03 240)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 220)" }} />
                <Line type="monotone" dataKey="sleep" stroke="oklch(0.6 0.13 195)" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="stress" stroke="oklch(0.65 0.2 25)" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="mood" stroke="oklch(0.7 0.14 160)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            </ClientOnly>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <Legend color="oklch(0.6 0.13 195)" label="Sleep" />
            <Legend color="oklch(0.65 0.2 25)" label="Stress" />
            <Legend color="oklch(0.7 0.14 160)" label="Mood" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/checkin" className="rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground">Start today's check-in</Link>
        <Link to="/dashboard" className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-muted">Back to dashboard</Link>
      </div>

      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}

function Stat({ label, value, sub, icon: Icon, tone }: { label: string; value: string; sub: string; icon?: React.ComponentType<{ className?: string }>; tone?: "warning" }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon && <Icon className={`h-4 w-4 ${tone === "warning" ? "text-warning-foreground" : "text-brand"}`} />}
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
