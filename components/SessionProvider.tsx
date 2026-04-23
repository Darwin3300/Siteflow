import { SessionProvider } from "next-auth/react";
"use client";
export default function Provider({ children }: { children: React.ReactNode }) {
      return <SessionProvider>{children}</SessionProvider>;
}