import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/nura/Navbar";
import { NuraProvider } from "@/lib/nura/store";
import { ProfileProvider } from "@/lib/nura/profile";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full gradient-brand px-5 py-2 text-sm font-semibold text-brand-foreground">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-full gradient-brand px-5 py-2 text-sm font-semibold text-brand-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nura — AI Preventative Wellness" },
      { name: "description", content: "Nura transforms daily health and lifestyle data into personalized preventative wellness intelligence." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileProvider>
        <NuraProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Outlet />
            </main>
            <footer className="border-t border-border/50 bg-card/35 backdrop-blur">
              <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 text-center">
                <div className="wordmark text-6xl leading-none">Nura</div>
                <div className="mt-5 rounded-full border border-border/70 bg-brand-soft/45 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  BCS Merseyside Hackathon 2026
                </div>
              </div>
            </footer>
          </div>
        </NuraProvider>
      </ProfileProvider>
    </QueryClientProvider>
  );
}
