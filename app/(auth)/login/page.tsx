"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
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
      if (error) {
        setState("error");
        setErrorMsg(error.message);
        return;
      }
      window.location.href = next;
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setState("error");
      setErrorMsg(error.message);
      return;
    }
    setState("sent");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: "420px",
          width: "100%",
          padding: "40px 36px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--serif)",
            fontSize: "32px",
            fontWeight: 700,
            letterSpacing: "3px",
            marginBottom: "6px",
          }}
        >
          FOCUSTRT
        </div>
        <div className="eyebrow" style={{ marginBottom: "32px" }}>
          Admin Sign In
        </div>

        {state === "sent" ? (
          <div
            style={{
              padding: "16px",
              background: "rgba(127, 167, 107, 0.1)",
              border: "1px solid rgba(127, 167, 107, 0.3)",
              borderRadius: "6px",
              color: "var(--success)",
              fontSize: "13px",
              lineHeight: 1.6,
            }}
          >
            <strong>Check your email.</strong>
            <br />
            A sign-in link has been sent to <code>{email}</code>. Click the
            link to access the admin area. The link expires in 1 hour.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="field-label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                className="field-input"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={state === "sending"}
                placeholder="you@focustrt.com"
              />
              <div className="field-hint">
                {mode === "magic"
                  ? "We'll email you a one-time sign-in link. Only whitelisted admin accounts can sign in."
                  : "Enter your password to sign in."}
              </div>
            </div>

            {mode === "password" && (
              <div className="field">
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  className="field-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={state === "sending"}
                  placeholder="••••••••"
                />
              </div>
            )}

            {state === "error" && errorMsg && (
              <div className="field-error" style={{ marginBottom: "16px" }}>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="btn-copper"
              disabled={state === "sending" || !email}
              style={{ width: "100%", padding: "14px" }}
            >
              {state === "sending"
                ? "Signing in…"
                : mode === "password"
                ? "Sign in"
                : "Send sign-in link"}
            </button>

            <button
              type="button"
              onClick={() => { setMode(mode === "magic" ? "password" : "magic"); setErrorMsg(null); setState("idle"); }}
              style={{
                width: "100%",
                marginTop: "12px",
                padding: "10px",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                color: "var(--cream)",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              {mode === "magic" ? "Use password instead" : "Use magic link instead"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
