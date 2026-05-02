"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MemberSidebar from "../_components/MemberSidebar";
import styles from "../dashboard/dashboard.module.css";

interface AssessmentData {
  answers: Record<string, unknown>;
  findings: { headline: string; detail: string }[];
  tests: { name: string; measures: string; homePrice: string; clinicPrice: string }[];
  completedAt: string;
  firstName: string;
  theme: "trt" | "hrt";
}

const ADAM_QUESTIONS = [
  "Decrease in libido (sex drive)",
  "Lack of energy",
  "Decrease in strength and/or endurance",
  "Lost height",
  "Decreased enjoyment of life",
  "Feeling sad and/or grumpy",
  "Erections less strong",
  "Recent deterioration in ability to play sports",
  "Falling asleep after dinner",
  "Recent deterioration in work performance",
];

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed or hopeless",
  "Trouble falling/staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself or failure",
  "Trouble concentrating",
  "Moving or speaking unusually slowly or restlessly",
  "Thoughts of being better off dead or hurting yourself",
];

const PHQ9_OPTIONS = ["Not at all", "Several days", "More than half the days", "Nearly every day"];

export default function AssessmentResultsPage() {
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("focus_assessment");
    if (raw) {
      try { setAssessment(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  if (!assessment) {
    return (
      <div className={styles.app}>
        <MemberSidebar active="dashboard" />
        <main className={styles.main}>
          <div className={styles.card} style={{ textAlign: "center", padding: 48 }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: "2px", color: "#b87333", marginBottom: 16 }}>NO ASSESSMENT FOUND</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 18, color: "#fbf3da", marginBottom: 24 }}>Complete the assessment to see your results here.</div>
            <Link href="/assessment" className={styles.btnCopper} style={{ textDecoration: "none" }}>TAKE ASSESSMENT →</Link>
          </div>
        </main>
      </div>
    );
  }

  const { answers, findings, tests, completedAt, theme } = assessment;
  const isTrt = theme === "trt";
  const accentColor = "#b87333";
  const dateStr = new Date(completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const symptoms = (answers.symptoms as string[]) || [];
  const goals = (answers.goals as string[]) || [];
  const adamResponses = (answers.adam_responses as number[]) || [];
  const adamScore = (answers.adam_score as number) || adamResponses.filter(Boolean).length;
  const phq9Responses = (answers.phq9_responses as number[]) || [];
  const phq9Score = (answers.phq9_score as number) || phq9Responses.reduce((a, b) => a + b, 0);

  function phq9Severity(score: number) {
    if (score <= 4) return "Minimal";
    if (score <= 9) return "Mild";
    if (score <= 14) return "Moderate";
    if (score <= 19) return "Moderately severe";
    return "Severe";
  }

  const sectionStyle: React.CSSProperties = {
    marginBottom: 20,
  };

  const tagStyle: React.CSSProperties = {
    display: "inline-block",
    fontFamily: "var(--sans)",
    fontSize: 10,
    letterSpacing: "1.5px",
    color: accentColor,
    background: "rgba(184,115,51,0.1)",
    border: "1px solid rgba(184,115,51,0.2)",
    padding: "3px 10px",
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  };

  return (
    <div className={styles.app}>
      <MemberSidebar active="dashboard" />

      <main className={styles.main}>
        {/* Header */}
        <div className={styles.hdr}>
          <div>
            <div className={styles.hdrGreeting}>Your Assessment Report</div>
            <div className={styles.hdrSub}>{isTrt ? "TESTOSTERONE OPTIMISATION" : "HORMONE BALANCING"} · ELEVATE · {dateStr}</div>
          </div>
          <Link href="/dashboard" className={styles.btnCopper} style={{ textDecoration: "none" }}>← DASHBOARD</Link>
        </div>
        <div className={styles.divider} />

        {/* ─── FINDINGS ─── */}
        <div style={sectionStyle}>
          <div className={styles.secHdr}>
            <div className={styles.secTitle}>Clinical Findings</div>
          </div>
          {findings.map((f, i) => (
            <div key={i} className={styles.card} style={{ marginBottom: 12, borderLeft: `3px solid ${accentColor}` }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "2px", color: accentColor, marginBottom: 6 }}>FINDING {String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 18, color: "#fbf3da", marginBottom: 8, lineHeight: 1.4 }}>{f.headline}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: "#bd9468", lineHeight: 1.7 }}>{f.detail}</div>
            </div>
          ))}
        </div>

        {/* ─── SYMPTOMS & GOALS ─── */}
        <div className={styles.row2eq} style={{ marginBottom: 20 }}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Reported Symptoms</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {symptoms.length > 0 ? symptoms.map((s) => (
                <span key={s} style={tagStyle}>{s}</span>
              )) : <span style={{ color: "#bd9468", fontSize: 13 }}>None reported</span>}
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Goals</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {goals.length > 0 ? goals.map((g) => (
                <span key={g} style={tagStyle}>{g}</span>
              )) : <span style={{ color: "#bd9468", fontSize: 13 }}>None selected</span>}
            </div>
          </div>
        </div>

        {/* ─── BIOMETRICS ─── */}
        <div className={styles.card} style={{ marginBottom: 20 }}>
          <div className={styles.cardTitle}>Biometrics</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[
              { label: "AGE", value: answers.age ? `${answers.age} years` : "—" },
              { label: "WEIGHT", value: answers.weight ? `${answers.weight} kg` : "—" },
              { label: "HEIGHT", value: answers.height ? `${answers.height} cm` : "—" },
              { label: "ACTIVITY", value: (answers.activity as string) || "—" },
              { label: "SLEEP", value: (answers.sleep as string) || "—" },
              { label: "STRESS", value: (answers.stress as string) || "—" },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 9, letterSpacing: "1.5px", color: "#b87333", marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "#fbf3da" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── ADAM SCORE (TRT) ─── */}
        {isTrt && adamResponses.length > 0 && (
          <div className={styles.card} style={{ marginBottom: 20 }}>
            <div className={styles.cardTitle}>
              ADAM Questionnaire
              <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: accentColor, marginLeft: 12 }}>
                Score: {adamScore}/10 · {adamScore >= 3 ? "Positive screen" : "Negative screen"}
              </span>
            </div>
            <div style={{ marginTop: 8 }}>
              {ADAM_QUESTIONS.map((q, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(189,148,104,0.1)" }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#bd9468", flex: 1, paddingRight: 16 }}>{q}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: adamResponses[i] === 1 ? accentColor : "#6b7280", fontWeight: 600, flexShrink: 0 }}>
                    {adamResponses[i] === 1 ? "YES" : adamResponses[i] === 0 ? "NO" : "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── PHQ-9 ─── */}
        {phq9Responses.length > 0 && (
          <div className={styles.card} style={{ marginBottom: 20 }}>
            <div className={styles.cardTitle}>
              PHQ-9 Mental Wellbeing
              <span style={{ fontFamily: "var(--sans)", fontSize: 11, color: accentColor, marginLeft: 12 }}>
                Score: {phq9Score} · {phq9Severity(phq9Score)}
              </span>
            </div>
            <div style={{ marginTop: 8 }}>
              {PHQ9_QUESTIONS.map((q, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(189,148,104,0.1)" }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#bd9468", flex: 1, paddingRight: 16 }}>{q}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#fbf3da", flexShrink: 0 }}>
                    {phq9Responses[i] >= 0 ? PHQ9_OPTIONS[phq9Responses[i]] : "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── RECOMMENDED TESTS ─── */}
        <div style={sectionStyle}>
          <div className={styles.secHdr}>
            <div className={styles.secTitle}>Recommended Tests</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 24 }}>
            {tests.map((test, i) => (
              <div key={i} className={styles.card} style={{ borderColor: test.locked ? "rgba(189,148,104,0.1)" : "rgba(184,115,51,0.4)", opacity: test.locked ? 0.6 : 1 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "2px", color: accentColor, marginBottom: 6 }}>TEST {String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 17, color: "#fbf3da", marginBottom: 6 }}>{test.name}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#bd9468", marginBottom: 14, lineHeight: 1.5 }}>{test.measures}</div>
                <div style={{ display: "flex", gap: 20 }}>
                  <div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 9, letterSpacing: "1.5px", color: "#b87333" }}>AT HOME</div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "#fbf3da" }}>{test.homePrice}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 9, letterSpacing: "1.5px", color: "#b87333" }}>IN CLINIC</div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "#fbf3da" }}>{test.clinicPrice}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── PACKAGES CTA ─── */}
        <div className={styles.card} style={{ borderColor: "#b87333", background: "rgba(184,115,51,0.06)", textAlign: "center", padding: "32px 24px", marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "2.5px", color: accentColor, marginBottom: 12 }}>NEXT STEP</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 24, color: "#fbf3da", marginBottom: 8 }}>Choose your Vitality package</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: "#bd9468", marginBottom: 24, maxWidth: 480, margin: "0 auto 24px" }}>
            Your assessment is complete. Select a package to unlock your clinical protocol, order your blood panel and begin optimising.
          </div>
          <Link href="/elevate" className={styles.btnCopper} style={{ textDecoration: "none" }}>VIEW PACKAGES →</Link>
        </div>

      </main>
    </div>
  );
}
