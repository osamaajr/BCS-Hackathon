import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Brain, HeartPulse, LineChart, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Disclaimer } from "@/components/nura/Disclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nura — AI-powered preventative wellness companion" },
      { name: "description", content: "Nura transforms daily health and lifestyle data into personalized preventative wellness insights." },
      { property: "og:title", content: "Nura — Personalized preventative wellness intelligence" },
      { property: "og:description", content: "Daily health signals, AI observations and long-term wellness trends." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: HeartPulse, title: "Unified wellness check-ins", desc: "Track sleep, stress load, hydration, activity, energy and balance." },
  { icon: Brain, title: "AI preventative insights", desc: "Personalized summaries that explain patterns without clinical certainty." },
  { icon: Sparkles, title: "Grounded observations", desc: "Understand how sleep quality, hydration and stress shape your day." },
  { icon: LineChart, title: "Longitudinal trends", desc: "Spot subtle changes across wellness score, stress load, sleep and hydration." },
];

function Landing() {
  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 gradient-hero" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/70 to-transparent" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-36">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/62 px-4 py-2 text-xs font-semibold text-muted-foreground shadow-card backdrop-blur-xl">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              Personalized prevention, not diagnosis
            </span>
            <h1 className="text-editorial mx-auto mt-7 max-w-4xl text-balance text-5xl text-foreground md:text-7xl">
              Wellness intelligence
              <span className="hero-accent mt-0 block text-[3.65rem] md:text-[5.35rem]">for proactive health.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-8 text-muted-foreground md:text-xl">
              Nura is a smart AI-powered health companion that transforms daily health and lifestyle data into personalized preventative wellness insights.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/checkin"
                className="premium-button group inline-flex items-center gap-2 rounded-full gradient-brand px-7 py-3.5 text-sm font-semibold text-brand-foreground hover:-translate-y-0.5 hover:shadow-soft"
              >
                Start Check-In
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/dashboard"
                className="premium-button inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/70 px-7 py-3.5 text-sm font-semibold text-foreground shadow-card backdrop-blur hover:-translate-y-0.5 hover:bg-card"
              >
                View Demo Dashboard
              </Link>
            </div>
          </div>

          <div className="premium-surface mx-auto mt-16 max-w-3xl rounded-[2rem] p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Stat label="Wellness score" value="82" tone="Stable" />
              <Stat label="Sleep quality" value="8/10" tone="Improving" />
              <Stat label="Stress load" value="Balanced" tone="Tracking" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-editorial text-4xl md:text-6xl">A premium companion for sustainable wellness</h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground">Built for everyday prevention, pattern recognition and lifestyle optimization.</p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="premium-surface group rounded-[2rem] p-7 transition-all hover:-translate-y-1 hover:shadow-soft">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prevention not diagnosis */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="overflow-hidden rounded-[2.25rem] border border-border/70 gradient-hero p-8 shadow-soft md:p-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-card/70 px-4 py-2 text-xs font-semibold text-muted-foreground backdrop-blur">
                <Activity className="h-3.5 w-3.5 text-brand" />
                Designed for proactive care
              </span>
              <h2 className="text-editorial mt-6 text-4xl md:text-6xl">Understand habits, trends and long-term wellbeing</h2>
              <p className="mt-6 leading-7 text-muted-foreground">
                Nura does not diagnose. It helps you understand how daily habits, lifestyle behaviours and repeated patterns may influence your overall wellness trajectory.
              </p>
              <p className="mt-4 leading-7 text-muted-foreground">
                Over time, Nura can highlight correlations between stress load, hydration, sleep quality, energy and emotional balance so you can act earlier.
              </p>
            </div>
            <div className="grid gap-4">
              <MiniCard title="What Nura does" items={["Tracks daily lifestyle inputs", "Generates one simple wellness score", "Explains longitudinal trends", "Suggests sustainable habit steps"]} tone="brand" />
              <MiniCard title="What Nura doesn't do" items={["Diagnose medical conditions", "Replace your GP or clinician", "Provide emergency advice", "Claim clinical certainty"]} tone="muted" />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Disclaimer />
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/72 p-5 shadow-card backdrop-blur">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display mt-2 text-4xl leading-none">{value}</p>
      <p className="mt-0.5 text-xs text-brand">{tone}</p>
    </div>
  );
}

function MiniCard({ title, items, tone }: { title: string; items: string[]; tone: "brand" | "muted" }) {
  return (
    <div className={`rounded-3xl border border-border/70 p-6 shadow-card ${tone === "brand" ? "bg-card/78" : "bg-muted/35"}`}>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${tone === "brand" ? "bg-brand" : "bg-muted-foreground/50"}`} />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
