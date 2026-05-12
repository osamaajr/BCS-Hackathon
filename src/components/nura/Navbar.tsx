import { Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";

const links = [
  { to: "/checkin", label: "Check-In" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/weekly", label: "Timeline" },
  { to: "/profile", label: "Profile" },
  { to: "/support", label: "Resources" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/72 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <span className="wordmark text-5xl leading-none">Nura</span>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/58 p-1 shadow-card backdrop-blur md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-muted/70 hover:text-foreground"
              activeProps={{ className: "rounded-full px-4 py-2 text-sm font-semibold bg-brand-soft text-foreground shadow-card" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/profile"
          className="premium-button inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:-translate-y-0.5 hover:shadow-soft"
        >
          <UserRound className="h-4 w-4" /> Profile
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
