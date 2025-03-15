"use client";

import { defaultSession, SessionData } from "@/models/auth";
import { createContext, useContext } from "react";

const SessionContext = createContext<SessionData>(defaultSession);

export function SessionProvider({ children, session }: { children: React.ReactNode; session: SessionData }) {
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}
