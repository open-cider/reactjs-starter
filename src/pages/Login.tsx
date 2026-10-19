import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { signInWithOpenCider } from "../lib/opencider";
import { getToken, setToken } from "../lib/session";

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (getToken()) return <Navigate to="/dashboard" replace />;

  const message =
    error ?? (params.get("reason") === "expired" ? "Your session ended. Sign in again to continue." : null);

  async function handleClick() {
    setPending(true);
    setError(null);
    try {
      const token = await signInWithOpenCider();
      setToken(token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("[opencider] sign-in failed:", err);
      setError("Sign-in didn't complete. Close any open sign-in window and try again.");
      setPending(false);
    }
  }

  return (
    <main className="center">
      <section className="panel">
        <h1>Sign in</h1>
        <p className="muted">Passwordless single sign-on, powered by Open Cider.</p>

        {message && (
          <p role="alert" className="notice">
            {message}
          </p>
        )}

        <button type="button" className="button" onClick={handleClick} disabled={pending}>
          {pending ? "Waiting for Open Cider…" : "Continue with Open Cider"}
        </button>
      </section>
    </main>
  );
}
