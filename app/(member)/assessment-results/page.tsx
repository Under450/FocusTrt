"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import s from "../dashboard/dashboard.module.css";
import MemberSidebar from "../_components/MemberSidebar";
import { ADAM_QUESTIONS, PHQ9_QUESTIONS, PHQ9_OPTIONS } from "../../assessment/quiz-data";

type Finding = { headline: string; detail: string; locked?: boolean };
type TestRec = { name: string; measures: string; homePrice: string; clinicPrice: string; locked?: boolean };

type Assessment = {
  answers: Record<string, unknown>;
  findings: Finding[];
  tests: TestRec[];
  completedAt: string;
  firstName: string;
  theme: "trt" | "hrt";
};

function phq9Severity(score: number): string {
  if (score >= 20) return "SEVERE";
  if (score >= 15) return "MODERATELY SEVERE";
  if (score >= 10) return "MODERATE";
  if (score >= 5) return "MILD";
  return "MINIMAL";
}

export default function AssessmentResultsPage() {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem("focus_assessment");
    if (raw) {
      try { setAssessment(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  if (!mounted) return null;

  if (!assessment) {
    return (
      <div className={s.app}>
        <MemberSidebar active="assessment" />
        <main className={s.main}>
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 600, color: "var(--cream)", marginBottom: 12 }}>
              No assessment found
            </div>
            <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24 }}>
              Complete the assessment to see your results here.
            </div>
            <Link href="/assessment" className={s.btnCopper}>TAKE ASSESSMENT</Link>
          </div>
        </main>
      </div>
    );
  }

  const { answers, findings, tests, completedAt, theme } = assessment;
  const themeLabel = theme === "hrt" ? "HORMONE BALANCING" : "TESTOSTERONE OPTIMISATION";
  const date = new Date(completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const symptoms = (answers.symptoms as string[]) || [];
  const goals = (answers.goals as string[]) || [];
  const isTrt = theme === "trt";

  // ADAM
  const adamResponses = answers.adam_responses as number[] | undefined;
  const adamScore = adamResponses?.reduce((a, b) => a + b, 0) ?? 0;
  const adamPositive = adamScore >= 3 && (adamResponses?.[0] === 1 || adamResponses?.[6] === 1);

  // PHQ-9
  const phq9Responses = answers.phq9_responses as number[] | undefined;
  const phq9Score = phq9Responses?.reduce((a, b) => a + b, 0) ?? 0;

  return (
    <div className={s.app}>
      <MemberSidebar active="assessment" />

      <main className={s.main}>
        <Link href="/dashboard" className={s.resultsBack}>&larr; BACK TO DASHBOARD</Link>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 9, letterSpacing: "2.5px", textTransform: "uppercase" as const, color: "var(--copper)", marginBottom: 8 }}>
            {themeLabel}
          </div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 600, color: "var(--cream)", marginBottom: 6 }}>
            Your Assessment Results
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Completed {date}</div>
        </div>
        <div className={s.divider} />

        {/* Clinical Findings */}
        <div className={s.secHdr}><div className={s.secTitle}>CLINICAL FINDINGS</div><div className={s.secLine} /></div>
        {findings.filter((f) => !f.locked).map((f, i) => (
          <div key={i} className={s.findingCard}>
            <div className={s.findingHead}>{f.headline}</div>
            <div className={s.findingBody}>{f.detail}</div>
          </div>
        ))}
        <div style={{ marginBottom: 28 }} />

        {/* Symptoms + Goals */}
        <div className={s.row2eq}>
          <div>
            <div className={s.secHdr}><div className={s.secTitle}>SYMPTOMS REPORTED</div><div className={s.secLine} /></div>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 24 }}>
              {symptoms.map((sym) => (
                <span key={sym} className={s.synopsisPill}>{sym}</span>
              ))}
            </div>
          </div>
          <div>
            <div className={s.secHdr}><div className={s.secTitle}>GOALS</div><div className={s.secLine} /></div>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 24 }}>
              {goals.map((g) => (
                <span key={g} className={s.synopsisPill}>{g}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Biometrics */}
        <div className={s.secHdr}><div className={s.secTitle}>BIOMETRICS</div><div className={s.secLine} /></div>
        <div className={s.bioGrid}>
          {[
            { label: "AGE", val: String(answers.age ?? "\u2014") },
            { label: "WEIGHT", val: answers.weight ? `${answers.weight} kg` : "\u2014" },
            { label: "HEIGHT", val: answers.height ? `${answers.height} cm` : "\u2014" },
            { label: "ACTIVITY", val: String(answers.activity || "\u2014") },
            { label: "SLEEP", val: String(answers.sleep || "\u2014") },
            { label: "STRESS", val: String(answers.stress || "\u2014") },
          ].map((b) => (
            <div key={b.label} className={s.bioCell}>
              <div className={s.bioLabel}>{b.label}</div>
              <div className={s.bioVal}>{b.val}</div>
            </div>
          ))}
        </div>

        {/* ADAM (TRT only) */}
        {isTrt && adamResponses && adamResponses.length === 10 && (
          <>
            <div className={s.secHdr}><div className={s.secTitle}>ADAM QUESTIONNAIRE</div><div className={s.secLine} /></div>
            <div className={s.qCard}>
              {ADAM_QUESTIONS.map((q, i) => (
                <div key={i} className={s.qRow}>
                  <span className={s.qText}>{i + 1}. {q}</span>
                  <span className={s.qAnswer}>{adamResponses[i] === 1 ? "Yes" : "No"}</span>
                </div>
              ))}
              <div className={s.qTotal}>
                <span className={s.qTotalLabel}>Total score</span>
                <div>
                  <span className={s.qTotalVal}>{adamScore}/10</span>
                  <span className={s.qSeverity}>{adamPositive ? "POSITIVE SCREEN" : "NEGATIVE"}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* PHQ-9 */}
        {phq9Responses && phq9Responses.length === 9 && (
          <>
            <div className={s.secHdr}><div className={s.secTitle}>PHQ-9 DEPRESSION SCREENING</div><div className={s.secLine} /></div>
            <div className={s.qCard}>
              {PHQ9_QUESTIONS.map((q, i) => (
                <div key={i} className={s.qRow}>
                  <span className={s.qText}>{i + 1}. {q}</span>
                  <span className={s.qAnswer}>{PHQ9_OPTIONS[phq9Responses[i]] || "\u2014"}</span>
                </div>
              ))}
              <div className={s.qTotal}>
                <span className={s.qTotalLabel}>Total score</span>
                <div>
                  <span className={s.qTotalVal}>{phq9Score}/27</span>
                  <span className={s.qSeverity}>{phq9Severity(phq9Score)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Recommended Tests */}
        <div className={s.secHdr}><div className={s.secTitle}>RECOMMENDED TESTS</div><div className={s.secLine} /></div>
        <div className={s.testGrid}>
          {tests.map((test, i) => (
            <div key={i} className={s.testCard}>
              <div className={s.testName}>{test.name}</div>
              <div className={s.testMeasures}>{test.measures}</div>
              <div className={s.testPrices}>
                <div>
                  <div className={s.testPriceLabel}>AT HOME</div>
                  <div className={s.testPriceVal}>{test.homePrice}</div>
                </div>
                <div>
                  <div className={s.testPriceLabel}>IN CLINIC</div>
                  <div className={s.testPriceVal}>{test.clinicPrice}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Package CTA */}
        <div className={s.banner}>
          <div>
            <div className={s.bannerOver}>NEXT STEP</div>
            <div className={s.bannerTitle}>Choose your Vitality package</div>
            <div className={s.bannerSub}>Unlock your personalised protocol and clinician assignment</div>
          </div>
          <Link href="/elevate" className={s.btnCopper}>VIEW PACKAGES &rarr;</Link>
        </div>
      </main>
    </div>
  );
}
