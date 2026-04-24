"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function TrtLoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/trt/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErrorMsg(null);

    const supabase = createClient();

    if (mode === "password") {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) { setState("error"); setErrorMsg(error.message); return; }
      window.location.href = next;
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) { setState("error"); setErrorMsg(error.message); return; }
    setState("sent");
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px", background: "#0a1930" }}>
      <div style={{ maxWidth: "420px", width: "100%", padding: "40px 36px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,97,0.15)", borderRadius: "12px" }}>
        <div style={{ fontFamily: "var(--cinzel)", fontSize: "28px", fontWeight: 500, letterSpacing: "4px", marginBottom: "6px", color: "#f5eadd" }}>ELEVATE</div>
        <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase" as const, color: "#c9a961", marginBottom: "32px" }}>TRT · Men&apos;s Optimisation</div>

        {state === "sent" ? (
          <div style={{ padding: "16px", background: "rgba(201,169,97,0.1)", border: "1px solid rgba(201,169,97,0.3)", borderRadius: "6px", color: "#c9a961", fontSize: "13px", lineHeight: 1.6 }}>
            <strong>Check your email.</strong><br />
            A sign-in link has been sent to <code>{email}</code>.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="field-label" htmlFor="email">Email address</label>
              <input id="email" className="field-input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={state === "sending"} placeholder="you@example.com" />
            </div>
            {mode === "password" && (
              <div className="field">
                <label className="field-label" htmlFor="password">Password</label>
                <input id="password" className="field-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={state === "sending"} placeholder="••••••••" />
              </div>
            )}
            {state === "error" && errorMsg && <div className="field-error" style={{ marginBottom: "16px" }}>{errorMsg}</div>}
            <button type="submit" disabled={state === "sending" || !email} style={{ width: "100%", padding: "14px", background: "#c9a961", color: "#0a1930", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" as const, cursor: "pointer" }}>
              {state === "sending" ? "Signing in…" : mode === "password" ? "Sign in" : "Send sign-in link"}
            </button>
            <button type="button" onClick={() => { setMode(mode === "magic" ? "password" : "magic"); setErrorMsg(null); setState("idle"); }} style={{ width: "100%", marginTop: "12px", padding: "10px", background: "transparent", border: "1px solid rgba(201,169,97,0.3)", borderRadius: "6px", color: "#c9a961", fontSize: "12px", cursor: "pointer" }}>
              {mode === "magic" ? "Use password instead" : "Use magic link instead"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function TrtLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrtLoginForm />
    </Suspense>
  );
}
