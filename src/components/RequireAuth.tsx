import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../lib/session";

// Fast, optimistic gate: it only checks that a token is stored.
// The dashboard validates it with Open Cider when it loads.
export default function RequireAuth({ children }: { children: ReactNode }) {
  return getToken() ? <>{children}</> : <Navigate to="/login" replace />;
}
