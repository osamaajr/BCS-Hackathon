import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";

const links = [
  { to: "/checkin", label: "Check-In" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/weekly", label: "Weekly Report" },
  { to: "/support", label: "Support" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-brand-foreground shadow-soft">
            <Activity className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Nura</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "rounded-full px-4 py-2 text-sm font-medium bg-brand-soft text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/checkin"
          className="rounded-full gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-soft transition-transform hover:scale-[1.02]"
        >
          Start Check-In
        </Link>
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto px-4 pb-3 md:hidden">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
            activeProps={{ className: "rounded-full px-3 py-1.5 text-xs font-medium bg-brand-soft text-foreground" }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
