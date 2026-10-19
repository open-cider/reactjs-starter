import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import { getClient } from "../lib/opencider";
import { clearToken, getToken } from "../lib/session";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  function signOut() {
    clearToken();
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    let cancelled = false;
    getClient(token)
      .then((client) => client.document.get())
      .then((doc) => {
        if (cancelled) return;
        setProfile(doc);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[opencider] could not resume session:", err);
        clearToken();
        navigate("/login?reason=expired", { replace: true });
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <main className="shell">
      <header className="bar">
        <strong>Open Cider Starter</strong>
        <button type="button" className="button ghost" onClick={signOut}>
          Sign out
        </button>
      </header>

      <h1>Dashboard</h1>
      {loading ? <p className="muted">Loading profile…</p> : <ProfileCard profile={profile} />}
      <br/>
      <p>Start here...</p>
    </main>
  );
}
