import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Disclaimer } from "@/components/nura/Disclaimer";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Sparkles, TrendingDown, Award, AlertCircle } from "lucide-react";
import { ClientOnly } from "@/components/nura/ClientOnly";
import { getWeeklyReport, type WeeklyReport } from "@/lib/nura/api";

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
  { day: "Mon", score: 76, sleep: 7, stress: 5, mood: 7 },
  { day: "Tue", score: 71, sleep: 6, stress: 7, mood: 6 },
  { day: "Wed", score: 64, sleep: 5, stress: 8, mood: 6 },
  { day: "Thu", score: 69, sleep: 6, stress: 7, mood: 6 },
  { day: "Fri", score: 74, sleep: 7, stress: 6, mood: 7 },
  { day: "Sat", score: 82, sleep: 8, stress: 4, mood: 8 },
  { day: "Sun", score: 83, sleep: 8, stress: 4, mood: 8 },
];

function toChartData(report: WeeklyReport | null) {
  if (!report) return weekData;
  return report.chartData.map((point) => ({
    day: point.day,
    score: point.wellnessScore,
    sleep: point.sleepQuality,
    stress: point.stressLevel,
    mood: point.emotionalBalance,
  }));
}

function WeeklyPage() {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const data = toChartData(report);
  const avg = report?.averageScore ?? Math.round(data.reduce((a, b) => a + b.score, 0) / data.length);
  const best = data.reduce((a, b) => (b.score < a.score ? b : a));

  useEffect(() => {
    getWeeklyReport()
      .then((weeklyReport) => {
        setReport(weeklyReport);
        setError(null);
      })
      .catch(() => setError("Nura couldn't load the backend weekly report, so demo data is shown."));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-medium text-brand">Health timeline</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Your wellness week at a glance</h1>
      <p className="mt-2 text-muted-foreground">Longitudinal patterns across wellness score, stress load, sleep quality, hydration and emotional balance.</p>
      {error && <div className="mt-6 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm">{error}</div>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Avg. wellness score" value={String(avg)} sub="This week" />
        <Stat label="Best day" value={best.day} sub={`Score ${best.score}`} icon={Award} />
        <Stat label="Most concerning" value="Stress" sub={report?.stressTrend ?? "Climbed mid-week"} icon={AlertCircle} tone="warning" />
        <Stat label="Sleep trend" value={report?.weeklyTrend ?? "Stable"} sub={report?.sleepTrend ?? "Slight drop vs last week"} icon={TrendingDown} tone="warning" />
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl gradient-brand text-brand-foreground"><Sparkles className="h-4 w-4" /></span>
          <p className="text-sm font-semibold">AI-generated timeline summary</p>
        </div>
        <p className="mt-4 leading-relaxed text-foreground/90">
          {report?.weeklySummary ??
            "This week, your stress load rose as sleep quality dipped, while hydration and activity helped keep your wellness score steadier."}
        </p>
        <div className="mt-5 rounded-2xl border border-brand/30 bg-brand-soft/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Suggested focus for next week</p>
          <p className="mt-1 text-sm text-foreground/90">
            Improve sleep consistency, hydration and sustainable activity anchors.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <p className="text-sm font-semibold">Daily wellness score</p>
          <div className="mt-4 h-56 w-full">
            <ClientOnly fallback={<div className="h-full w-full animate-pulse rounded-2xl bg-muted/40" />}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
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
          <p className="text-sm font-semibold">Sleep quality · Stress load · Emotional balance</p>
          <div className="mt-4 h-56 w-full">
            <ClientOnly fallback={<div className="h-full w-full animate-pulse rounded-2xl bg-muted/40" />}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
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
            <Legend color="oklch(0.7 0.14 160)" label="Balance" />
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
