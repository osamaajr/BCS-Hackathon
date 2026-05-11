import { ShieldAlert } from "lucide-react";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-border bg-muted/40 ${compact ? "p-3 text-xs" : "p-4 text-sm"} text-muted-foreground`}
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
      <p>
        Nura is a preventative wellbeing assistant. It is{" "}
        <span className="font-semibold text-foreground">not a medical device</span>, does not diagnose
        conditions, and should not replace professional medical advice.
      </p>
    </div>
  );
}
