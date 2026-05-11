import { createContext, useContext, useState, type ReactNode } from "react";
import type { ScoredCheckIn } from "./types";

type NuraState = {
  latest: ScoredCheckIn | null;
  setLatest: (s: ScoredCheckIn) => void;
};

const NuraCtx = createContext<NuraState | null>(null);

export function NuraProvider({ children }: { children: ReactNode }) {
  const [latest, setLatest] = useState<ScoredCheckIn | null>(null);
  return <NuraCtx.Provider value={{ latest, setLatest }}>{children}</NuraCtx.Provider>;
}

export function useNura() {
  const ctx = useContext(NuraCtx);
  if (!ctx) throw new Error("useNura must be used inside NuraProvider");
  return ctx;
}
