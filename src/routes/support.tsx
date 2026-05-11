import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNura } from "@/lib/nura/store";
import { getSupportServices, type SupportService } from "@/lib/nura/api";
import { Disclaimer } from "@/components/nura/Disclaimer";
import { Phone, Stethoscope, GraduationCap, Brain, Users, AlertTriangle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Local Support — Nura" },
      { name: "description", content: "Trusted local wellbeing support in Liverpool & Merseyside." },
    ],
  }),
  component: SupportPage,
});

type Urgency = "Routine" | "Soon" | "Urgent";

const resources: { icon: React.ComponentType<{ className?: string }>; name: string; why: string; urgency: Urgency; contact: string; hours: string }[] = [
  { icon: Phone, name: "NHS 111", why: "Free 24/7 advice when you're not sure what kind of help you need.", urgency: "Urgent", contact: "Call 111", hours: "24/7" },
  { icon: Stethoscope, name: "Your GP / local clinic", why: "First point of contact for ongoing physical or mental health concerns.", urgency: "Soon", contact: "Book through your GP practice", hours: "Mon–Fri, 8am–6pm" },
  { icon: GraduationCap, name: "University Wellbeing Service", why: "Free counselling and support for students at Liverpool universities.", urgency: "Routine", contact: "wellbeing@university.ac.uk", hours: "Term-time, weekdays" },
  { icon: Brain, name: "Mersey Care Mental Health", why: "NHS mental health support across Liverpool & Merseyside.", urgency: "Soon", contact: "0151 296 7200", hours: "Mon–Sun, 8am–8pm" },
  { icon: Users, name: "Community Wellbeing Hub", why: "Local groups, peer support and lifestyle workshops.", urgency: "Routine", contact: "Find a hub near you", hours: "Varies" },
  { icon: AlertTriangle, name: "Crisis support — Samaritans", why: "Free, confidential support if you're in crisis or struggling to cope.", urgency: "Urgent", contact: "Call 116 123", hours: "24/7" },
];

const urgencyClass: Record<Urgency, string> = {
  Routine: "bg-success/15 text-success border-success/30",
  Soon: "bg-warning/15 text-warning-foreground border-warning/40",
  Urgent: "bg-danger/15 text-danger border-danger/40",
};

const apiUrgencyClass: Record<SupportService["urgency"], string> = {
  Low: "bg-success/15 text-success border-success/30",
  Medium: "bg-warning/15 text-warning-foreground border-warning/40",
  High: "bg-danger/15 text-danger border-danger/40",
  Urgent: "bg-danger/15 text-danger border-danger/40",
};

const serviceIcons = [Phone, Stethoscope, GraduationCap, Brain, Users, AlertTriangle];

function SupportPage() {
  const { latest } = useNura();
  const showAll = !latest || latest.level !== "Low";
  const [services, setServices] = useState<SupportService[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSupportServices(latest?.level ?? "Moderate")
      .then((response) => {
        setServices(response.services);
        setError(null);
      })
      .catch(() => setError("Nura couldn't load backend support services, so demo resources are shown."));
  }, [latest?.level]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-medium text-brand">Local support</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">You don't have to figure this out alone</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Trusted resources in Liverpool & Merseyside. Nura helps guide you toward support — it does not provide emergency or diagnostic advice.
      </p>

      {!showAll && (
        <div className="mt-6 rounded-2xl border border-success/30 bg-success/10 p-4 text-sm">
          Your latest check-in was <span className="font-semibold">Low risk</span>. These resources are here whenever you need them.
        </div>
      )}

      {error && <div className="mt-6 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm">{error}</div>}

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services ? services.map((service, index) => {
          const Icon = serviceIcons[index % serviceIcons.length];
          return (
          <div key={service.id} className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${apiUrgencyClass[service.urgency]}`}>
                {service.urgency}
              </span>
            </div>
            <h2 className="mt-4 text-base font-semibold">{service.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
            <div className="mt-4 space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium text-foreground">Contact:</span> {service.contact}</p>
              <p><span className="font-medium text-foreground">Hours:</span> {service.openingHours}</p>
            </div>
            <button className="mt-5 inline-flex items-center gap-1.5 self-start rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted">
              View details <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        );}) : resources.map((r) => (
          <div key={r.name} className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
                <r.icon className="h-5 w-5" />
              </span>
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${urgencyClass[r.urgency]}`}>
                {r.urgency}
              </span>
            </div>
            <h2 className="mt-4 text-base font-semibold">{r.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{r.why}</p>
            <div className="mt-4 space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium text-foreground">Contact:</span> {r.contact}</p>
              <p><span className="font-medium text-foreground">Hours:</span> {r.hours}</p>
            </div>
            <button className="mt-5 inline-flex items-center gap-1.5 self-start rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted">
              View details <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-danger/30 bg-danger/5 p-5">
        <p className="text-sm font-semibold text-danger">If you are in immediate danger</p>
        <p className="mt-1 text-sm text-foreground/80">
          Call <span className="font-semibold">999</span> or go to your nearest A&E. Nura cannot help in an emergency.
        </p>
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
