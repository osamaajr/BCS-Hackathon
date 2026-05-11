import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Brain, HeartPulse, MapPin, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Disclaimer } from "@/components/nura/Disclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nura — Spot early wellbeing risks before they become serious" },
      { name: "description", content: "Nura turns daily health and lifestyle data into personalised prevention insights." },
      { property: "og:title", content: "Nura — Preventative wellbeing, powered by AI" },
      { property: "og:description", content: "Daily check-ins, AI insights, early risk awareness, and local support." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: HeartPulse, title: "Daily wellbeing check-ins", desc: "A 60-second log of sleep, stress, mood and movement." },
  { icon: Brain, title: "AI-powered prevention insights", desc: "Plain-English explanations of what's shaping your wellbeing." },
  { icon: Sparkles, title: "Early risk awareness", desc: "Catch patterns days before they become bigger problems." },
  { icon: MapPin, title: "Local support recommendations", desc: "Trusted NHS, university and community resources near you." },
];

function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-80" aria-hidden />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-accent/40 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              Prevention, not diagnosis
            </span>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
              Spot early wellbeing risks <span className="bg-gradient-to-r from-brand to-accent-foreground bg-clip-text text-transparent">before they become serious</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
              Nura turns your daily health and lifestyle data into personalised prevention insights —
              calm, clear, and built around your real life.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/checkin"
                className="group inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-soft transition-transform hover:scale-[1.03]"
              >
                Start Check-In
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                View Demo Dashboard
              </Link>
            </div>
          </div>

          {/* Floating glimpse card */}
          <div className="mx-auto mt-14 max-w-3xl rounded-3xl border border-border bg-card/70 p-6 shadow-soft backdrop-blur md:p-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Stat label="Wellbeing score" value="42" tone="Moderate" />
              <Stat label="Sleep last night" value="6.4h" tone="On track" />
              <Stat label="Stress trend" value="↘ Improving" tone="Good" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">A gentler way to stay ahead of your health</h2>
          <p className="mt-3 text-muted-foreground">Built for daily life, not the doctor's office.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="group rounded-3xl border border-border gradient-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prevention not diagnosis */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="overflow-hidden rounded-3xl border border-border gradient-hero p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <Activity className="h-3.5 w-3.5 text-brand" />
                Designed for prevention
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Prevention, not diagnosis</h2>
              <p className="mt-4 text-muted-foreground">
                Nura doesn't tell you what's wrong. It helps you notice small shifts — sleep slipping, stress climbing,
                energy dropping — early enough that small changes still make a big difference.
              </p>
              <p className="mt-3 text-muted-foreground">
                If a pattern feels concerning, Nura points you toward trusted local support — NHS 111, your GP,
                university wellbeing services, and community resources.
              </p>
            </div>
            <div className="grid gap-4">
              <MiniCard title="What Nura does" items={["Tracks daily lifestyle inputs", "Explains your risk in plain English", "Suggests preventative steps", "Points to local support"]} tone="brand" />
              <MiniCard title="What Nura doesn't do" items={["Diagnose medical conditions", "Replace your GP or clinician", "Handle emergencies", "Make health claims"]} tone="muted" />
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
    <div className="rounded-2xl bg-card p-4 shadow-card">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      <p className="mt-0.5 text-xs text-brand">{tone}</p>
    </div>
  );
}

function MiniCard({ title, items, tone }: { title: string; items: string[]; tone: "brand" | "muted" }) {
  return (
    <div className={`rounded-2xl border border-border p-5 ${tone === "brand" ? "bg-card" : "bg-muted/40"}`}>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
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
