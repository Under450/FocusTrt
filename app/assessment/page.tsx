"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  CARDS, type Answers,
  ADAM_QUESTIONS, IIEF5_QUESTIONS,
  PHQ9_QUESTIONS, PHQ9_OPTIONS,
  GREENE_QUESTIONS, GREENE_OPTIONS,
  MEDICATION_OPTIONS_COMMON, MEDICATION_OPTIONS_WOMEN,
} from "./quiz-data";
import { generateFindings, recommendTests, type Finding, type TestRec } from "./quiz-logic";
import s from "./assessment.module.css";

type Phase = "quiz" | "transition" | "findings" | "tests" | "decision";
type Theme = "trt" | "hrt";

function cls(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const SEGS = {
  activity: { label: "ACTIVITY LEVEL", opts: ["Sedentary", "Light", "Active", "Very active"] },
  sleep: { label: "SLEEP HOURS", opts: ["<5", "5-6", "7-8", "8+"] },
  stress: { label: "STRESS LEVEL", opts: ["Low", "Moderate", "High", "Severe"] },
  alcohol: { label: "ALCOHOL", opts: ["None", "Light", "Moderate", "Heavy"] },
} as const;

export default function AssessmentPage() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardIdx, setCardIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [phase, setPhase] = useState<Phase>("quiz");
  const [, setSessionId] = useState("");
  const [findings, setFindings] = useState<Finding[]>([]);
  const [tests, setTests] = useState<TestRec[]>([]);
  const [phq9Notice, setPhq9Notice] = useState(false);

  const sex = answers.sex as string | undefined;
  const theme: Theme = sex === "I'm a woman" ? "hrt" : "trt";
  const t = theme === "trt";

  const activeCards = CARDS.filter((c) => !c.conditional || c.conditional(answers));
  const card = phase === "quiz" ? activeCards[cardIdx] : null;
  const totalCards = activeCards.length;
  const progress = phase === "quiz" ? ((cardIdx + 1) / totalCards) * 100 : 100;

  // Scroll to top of card on every slide/phase change
  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [cardIdx, phase]);

  useEffect(() => {
    const stored = localStorage.getItem("elevate_session_id");
    if (stored) {
      setSessionId(stored);
      const saved = localStorage.getItem("elevate_answers");
      if (saved) setAnswers(JSON.parse(saved));
    } else {
      const id = crypto.randomUUID();
      setSessionId(id);
      localStorage.setItem("elevate_session_id", id);
    }
  }, []);

  const save = useCallback((updated: Answers) => {
    localStorage.setItem("elevate_answers", JSON.stringify(updated));
  }, []);

  function setAnswer(key: string, val: unknown) {
    const updated = { ...answers, [key]: val };
    setAnswers(updated);
    save(updated);
  }

  function toggleMulti(key: string, val: string) {
    const current = (answers[key] as string[]) || [];
    const isNone = val.startsWith("None");
    let next: string[];
    if (isNone) {
      next = current.includes(val) ? [] : [val];
    } else {
      next = current.filter((v) => !v.startsWith("None"));
      next = next.includes(val) ? next.filter((v) => v !== val) : [...next, val];
    }
    setAnswer(key, next);
  }

  function getOptions(): string[] {
    if (!card?.options) return [];
    if (Array.isArray(card.options)) return card.options;
    return card.options[theme] ?? [];
  }

  const medOptions = sex === "I'm a woman"
    ? MEDICATION_OPTIONS_WOMEN
    : MEDICATION_OPTIONS_COMMON;

  function isValid(): boolean {
    if (!card) return false;
    if (card.type === "welcome") return true;
    if (card.type === "loading") return false;
    if (card.type === "single") return !!answers[card.id];
    if (card.type === "multi") return ((answers[card.id] as string[]) || []).length > 0;
    if (card.type === "medications") return true;
    if (card.type === "combined") return true;
    if (card.type === "segmented") return true;
    if (card.type === "adam") return ((answers.adam_responses as number[]) || []).every((v) => v !== -1);
    if (card.type === "iief5") return ((answers.iief5_responses as number[]) || []).every((v) => v !== -1);
    if (card.type === "phq9") return ((answers.phq9_responses as number[]) || []).every((v) => v !== -1);
    if (card.type === "greene") return ((answers.greene_responses as number[]) || []).every((v) => v !== -1);
    return true;
  }

  function computeScores() {
    const adamR = (answers.adam_responses as number[]) || [];
    if (adamR.length) {
      const score = adamR.filter(Boolean).length;
      setAnswer("adam_score", score);
    }
    const iief5R = (answers.iief5_responses as number[]) || [];
    if (iief5R.length) {
      setAnswer("iief5_score", iief5R.reduce((a, b) => a + b, 0));
    }
    const phq9R = (answers.phq9_responses as number[]) || [];
    if (phq9R.length) {
      setAnswer("phq9_score", phq9R.reduce((a, b) => a + b, 0));
    }
    const gR = (answers.greene_responses as number[]) || [];
    if (gR.length) {
      setAnswer("greene_score", {
        psychological: gR.slice(0, 6).reduce((a, b) => a + b, 0),
        somatic: gR.slice(6, 11).reduce((a, b) => a + b, 0),
        vasomotor: gR.slice(11, 13).reduce((a, b) => a + b, 0),
        sexual: gR.slice(13, 14).reduce((a, b) => a + b, 0),
        total: gR.reduce((a, b) => a + b, 0),
      });
    }
  }

  function next() {
    if (!card) return;
    if (card.type === "loading") return;
    if (["adam", "iief5", "phq9", "greene"].includes(card.type)) computeScores();
    if (cardIdx < totalCards - 1) setCardIdx(cardIdx + 1);
  }

  function back() {
    if (phase === "decision") { setPhase("tests"); return; }
    if (phase === "tests") { setPhase("findings"); return; }
    if (phase === "findings") { setPhase("transition"); return; }
    if (phase === "transition") { setPhase("quiz"); setCardIdx(Math.max(0, totalCards - 2)); return; }
    if (cardIdx > 0) setCardIdx(cardIdx - 1);
  }

  function nextPhase() {
    if (phase === "transition") setPhase("findings");
    else if (phase === "findings") setPhase("tests");
    else if (phase === "tests") setPhase("decision");
  }

  // Save completed assessment and go to dashboard
  function completeAssessment() {
    const completedAt = new Date().toISOString();
    const firstName = (answers.name as string || "").split(" ")[0] || "there";
    const assessmentData = {
      answers,
      findings,
      tests,
      completedAt,
      firstName,
      theme,
    };
    localStorage.setItem("focus_assessment", JSON.stringify(assessmentData));
    localStorage.setItem("focus_patient_name", answers.name as string || "");
    router.push("/dashboard");
  }

  // Auto-advance on loading card
  useEffect(() => {
    if (card?.type === "loading" && phase === "quiz") {
      let cancelled = false;
      const start = Date.now();
      const fetchReport = async () => {
        let data: { findings: Finding[]; tests: TestRec[] } | null = null;
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 15000);
          const res = await fetch("/api/generate-report", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(answers), signal: controller.signal,
          });
          clearTimeout(timeout);
          if (res.ok) data = await res.json();
        } catch { /* fallback */ }
        if (!data?.findings?.length || !data?.tests?.length) {
          data = { findings: generateFindings(answers), tests: recommendTests(answers) };
        }
        const remaining = Math.max(0, 3000 - (Date.now() - start));
        setTimeout(() => { if (!cancelled) { setFindings(data!.findings); setTests(data!.tests); setPhase("transition"); } }, remaining);
      };
      fetchReport();
      return () => { cancelled = true; };
    }
  }, [card, phase, answers]);

  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  function setArrayAnswer(key: string, idx: number, val: number, len: number) {
    const arr = [...((answers[key] as number[]) || new Array(len).fill(-1))];
    arr[idx] = val;
    setAnswer(key, arr);
  }

  const tickSvg = (selected: boolean) => (
    selected ? (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: "auto", flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity="0.3" />
        <path d="M4.5 8l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: "auto", flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity="0.2" />
      </svg>
    )
  );

  return (
    <div className={cls(s.shell, t ? s.shellTrt : s.shellHrt)}>
      <div className={cls(s.card, t ? s.cardTrt : s.cardHrt)} ref={cardRef}>
        <div className={cls(s.stripe, t ? s.stripeTrt : s.stripeHrt)} />
        <div className={s.cardInner}>

          {/* Progress bar */}
          <div className={s.progressWrap}>
            <div className={cls(s.progressBar, t ? s.progressBarTrt : s.progressBarHrt)}>
              <div className={cls(s.progressFill, t ? s.progressFillTrt : s.progressFillHrt)} style={{ width: `${progress}%` }} />
            </div>
            <span className={cls(s.stepCount, t ? s.stepCountTrt : s.stepCountHrt)}>
              {phase === "quiz" ? `${cardIdx + 1} / ${totalCards}` : phase.toUpperCase()}
            </span>
          </div>

          {/* ─── QUIZ ─── */}
          {phase === "quiz" && card && (
            <>
              <p className={cls(s.eyebrow, t ? s.eyebrowTrt : s.eyebrowHrt)}>{card.eyebrow}</p>
              <h1 className={cls(s.title, t ? s.titleTrt : s.titleHrt)}>{card.title}</h1>
              {card.body && <p className={cls(s.body, t ? s.bodyTrt : s.bodyHrt)}>{card.body}</p>}

              {/* Name input for welcome */}
              {card.type === "welcome" && (
                <div style={{ marginBottom: 24 }}>
                  <div className={cls(s.inputLabel, t ? s.inputLabelTrt : s.inputLabelHrt)}>YOUR NAME</div>
                  <input
                    className={cls(s.inputField, t ? s.inputFieldTrt : s.inputFieldHrt)}
                    type="text"
                    placeholder="First name"
                    value={(answers.name as string) || ""}
                    onChange={(e) => setAnswer("name", e.target.value)}
                  />
                </div>
              )}

              {/* Single select */}
              {card.type === "single" && (
                <div className={s.options}>
                  {getOptions().map((opt) => {
                    const selected = answers[card.id] === opt;
                    return (
                      <button key={opt} className={cls(s.option, t ? s.optionTrt : s.optionHrt, selected && (t ? s.optionTrtSelected : s.optionHrtSelected))} onClick={() => setAnswer(card.id, opt)}>
                        <span>{opt}</span>{tickSvg(selected)}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Multi select */}
              {card.type === "multi" && (
                <div className={s.options}>
                  {getOptions().map((opt) => {
                    const selected = ((answers[card.id] as string[]) || []).includes(opt);
                    return (
                      <button key={opt} className={cls(s.option, t ? s.optionTrt : s.optionHrt, selected && (t ? s.optionTrtSelected : s.optionHrtSelected))} onClick={() => toggleMulti(card.id, opt)}>
                        <span>{opt}</span>{tickSvg(selected)}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Medications */}
              {card.type === "medications" && (
                <>
                  <div className={s.options}>
                    {medOptions.map((opt) => {
                      const selected = ((answers.medications as string[]) || []).includes(opt);
                      return (
                        <button key={opt} className={cls(s.option, t ? s.optionTrt : s.optionHrt, selected && (t ? s.optionTrtSelected : s.optionHrtSelected))} onClick={() => toggleMulti("medications", opt)}>
                          <span>{opt}</span>{tickSvg(selected)}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <div className={cls(s.inputLabel, t ? s.inputLabelTrt : s.inputLabelHrt)}>ANY OTHER MEDICATIONS, SUPPLEMENTS, OR SUBSTANCES? (OPTIONAL)</div>
                    <input className={cls(s.inputField, t ? s.inputFieldTrt : s.inputFieldHrt)} type="text" placeholder="e.g. vitamin D, creatine, CBD..." value={(answers.other_medications as string) || ""} onChange={(e) => setAnswer("other_medications", e.target.value)} />
                  </div>
                </>
              )}

              {/* Combined inputs (biometrics) */}
              {card.type === "combined" && card.id === "biometrics" && (
                <div className={s.inputGroup}>
                  <div>
                    <div className={cls(s.inputLabel, t ? s.inputLabelTrt : s.inputLabelHrt)}>AGE</div>
                    <input type="number" min={18} max={90} placeholder="e.g. 38" className={cls(s.inputField, t ? s.inputFieldTrt : s.inputFieldHrt)} value={answers.age as number || ""} onChange={(e) => setAnswer("age", e.target.value ? Number(e.target.value) : null)} />
                  </div>
                  <div>
                    <div className={cls(s.inputLabel, t ? s.inputLabelTrt : s.inputLabelHrt)}>WEIGHT (KG)</div>
                    <input type="number" min={30} max={250} placeholder="e.g. 85" className={cls(s.inputField, t ? s.inputFieldTrt : s.inputFieldHrt)} value={answers.weight as number || ""} onChange={(e) => setAnswer("weight", e.target.value ? Number(e.target.value) : null)} />
                  </div>
                  <div>
                    <div className={cls(s.inputLabel, t ? s.inputLabelTrt : s.inputLabelHrt)}>HEIGHT (CM)</div>
                    <input type="number" min={120} max={230} placeholder="e.g. 178" className={cls(s.inputField, t ? s.inputFieldTrt : s.inputFieldHrt)} value={answers.height as number || ""} onChange={(e) => setAnswer("height", e.target.value ? Number(e.target.value) : null)} />
                  </div>
                </div>
              )}

              {/* Segmented controls (lifestyle) */}
              {card.type === "segmented" && (
                <div style={{ marginBottom: 24 }}>
                  {Object.entries(SEGS).map(([key, seg]) => (
                    <div key={key} className={s.segGroup}>
                      <div className={cls(s.segLabel, t ? s.segLabelTrt : s.segLabelHrt)}>{seg.label}</div>
                      <div className={cls(s.segRow, t ? s.segRowTrt : s.segRowHrt)}>
                        {seg.opts.map((opt) => (
                          <button key={opt} className={cls(s.segBtn, t ? s.segBtnTrt : s.segBtnHrt, answers[key] === opt && (t ? s.segBtnTrtActive : s.segBtnHrtActive))} onClick={() => setAnswer(key, opt)}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ADAM Questionnaire */}
              {card.type === "adam" && (
                <div className={s.options}>
                  {ADAM_QUESTIONS.map((q, i) => {
                    const responses = (answers.adam_responses as number[]) || new Array(10).fill(-1);
                    return (
                      <div key={i} style={{ marginBottom: 12 }}>
                        <div className={cls(s.body, t ? s.bodyTrt : s.bodyHrt)} style={{ marginBottom: 6, fontSize: 13 }}>{i + 1}. {q}</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          {[{ label: "Yes", val: 1 }, { label: "No", val: 0 }].map((opt) => (
                            <button key={opt.label} className={cls(s.option, t ? s.optionTrt : s.optionHrt, responses[i] === opt.val && (t ? s.optionTrtSelected : s.optionHrtSelected))} style={{ flex: 1 }} onClick={() => setArrayAnswer("adam_responses", i, opt.val, 10)}>
                              <span>{opt.label}</span>{tickSvg(responses[i] === opt.val)}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* IIEF-5 */}
              {card.type === "iief5" && (
                <div style={{ marginBottom: 24 }}>
                  {IIEF5_QUESTIONS.map((item, i) => {
                    const responses = (answers.iief5_responses as number[]) || new Array(5).fill(-1);
                    return (
                      <div key={i} className={s.segGroup}>
                        <div className={cls(s.body, t ? s.bodyTrt : s.bodyHrt)} style={{ marginBottom: 6, fontSize: 13 }}>{i + 1}. {item.q}</div>
                        <div className={cls(s.segRow, t ? s.segRowTrt : s.segRowHrt)}>
                          {item.labels.map((label, v) => (
                            <button key={v} className={cls(s.segBtn, t ? s.segBtnTrt : s.segBtnHrt, responses[i] === v + 1 && (t ? s.segBtnTrtActive : s.segBtnHrtActive))} onClick={() => setArrayAnswer("iief5_responses", i, v + 1, 5)} title={label}>
                              {v + 1}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginTop: 2 }}>
                          <span className={cls(t ? s.bodyTrt : s.bodyHrt)} style={{ opacity: 0.5 }}>{item.labels[0]}</span>
                          <span className={cls(t ? s.bodyTrt : s.bodyHrt)} style={{ opacity: 0.5 }}>{item.labels[4]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PHQ-9 */}
              {card.type === "phq9" && (
                <div style={{ marginBottom: 24 }}>
                  <div className={cls(s.inputLabel, t ? s.inputLabelTrt : s.inputLabelHrt)} style={{ marginBottom: 16 }}>OVER THE LAST 2 WEEKS, HOW OFTEN HAVE YOU BEEN BOTHERED BY:</div>
                  {PHQ9_QUESTIONS.map((q, i) => {
                    const responses = (answers.phq9_responses as number[]) || new Array(9).fill(-1);
                    return (
                      <div key={i} className={s.segGroup}>
                        <div className={cls(s.body, t ? s.bodyTrt : s.bodyHrt)} style={{ marginBottom: 6, fontSize: 13 }}>{i + 1}. {q}</div>
                        <div className={cls(s.segRow, t ? s.segRowTrt : s.segRowHrt)}>
                          {PHQ9_OPTIONS.map((label, v) => (
                            <button key={v} className={cls(s.segBtn, t ? s.segBtnTrt : s.segBtnHrt, responses[i] === v && (t ? s.segBtnTrtActive : s.segBtnHrtActive))} onClick={() => {
                              setArrayAnswer("phq9_responses", i, v, 9);
                              if (i === 8 && v > 0) setPhq9Notice(true);
                            }}>
                              {v}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, marginTop: 2 }}>
                          <span className={cls(t ? s.bodyTrt : s.bodyHrt)} style={{ opacity: 0.4 }}>Not at all</span>
                          <span className={cls(t ? s.bodyTrt : s.bodyHrt)} style={{ opacity: 0.4 }}>Nearly every day</span>
                        </div>
                      </div>
                    );
                  })}
                  {phq9Notice && (
                    <div style={{ padding: 16, borderRadius: 8, marginTop: 12, border: `1px solid ${t ? "#c9a961" : "#1c2c47"}`, background: t ? "rgba(244,237,226,0.08)" : "rgba(28,44,71,0.08)" }}>
                      <p className={cls(s.body, t ? s.bodyTrt : s.bodyHrt)} style={{ marginBottom: 0, fontSize: 13, lineHeight: 1.6, opacity: 1 }}>
                        If you&apos;re having thoughts of harming yourself, please reach out for support right now. <strong>Samaritans (UK): 116 123</strong> — free, 24/7. <strong>NHS 111</strong> if you need urgent medical advice. We&apos;ll continue your assessment, and your responses will be flagged for our clinical team to follow up sensitively.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Greene Climacteric Scale */}
              {card.type === "greene" && (
                <div style={{ marginBottom: 24 }}>
                  <div className={cls(s.inputLabel, t ? s.inputLabelTrt : s.inputLabelHrt)} style={{ marginBottom: 16 }}>HOW SEVERELY HAVE YOU EXPERIENCED EACH OVER THE LAST MONTH?</div>
                  {(() => {
                    let lastSection = "";
                    return GREENE_QUESTIONS.map((item, i) => {
                      const responses = (answers.greene_responses as number[]) || new Array(21).fill(-1);
                      const showHeader = item.section !== lastSection;
                      lastSection = item.section;
                      return (
                        <div key={i}>
                          {showHeader && <div className={cls(s.inputLabel, t ? s.inputLabelTrt : s.inputLabelHrt)} style={{ marginTop: i > 0 ? 20 : 0, marginBottom: 10 }}>{item.section.toUpperCase()}</div>}
                          <div className={s.segGroup}>
                            <div className={cls(s.body, t ? s.bodyTrt : s.bodyHrt)} style={{ marginBottom: 6, fontSize: 13 }}>{item.q}</div>
                            <div className={cls(s.segRow, t ? s.segRowTrt : s.segRowHrt)}>
                              {GREENE_OPTIONS.map((label, v) => (
                                <button key={v} className={cls(s.segBtn, t ? s.segBtnTrt : s.segBtnHrt, responses[i] === v && (t ? s.segBtnTrtActive : s.segBtnHrtActive))} onClick={() => setArrayAnswer("greene_responses", i, v, 21)}>
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}

              {/* Loading */}
              {card.type === "loading" && <div className={cls(s.spinner, !t && s.spinnerHrt)} />}

              {/* Buttons */}
              {card.type !== "loading" && (
                <div className={s.btnRow}>
                  {cardIdx > 0 ? <button className={cls(s.btnSecondary, t ? s.btnSecondaryTrt : s.btnSecondaryHrt)} onClick={back}>← BACK</button> : <span />}
                  <button className={cls(s.btnPrimary, t ? s.btnPrimaryTrt : s.btnPrimaryHrt)} onClick={next} disabled={card.type !== "welcome" && !isValid()}>
                    {card.type === "welcome" ? "BEGIN →" : "CONTINUE →"}
                  </button>
                </div>
              )}
            </>
          )}

          {/* ─── TRANSITION ─── */}
          {phase === "transition" && (
            <>
              <p className={cls(s.eyebrow, t ? s.eyebrowTrt : s.eyebrowHrt)}>YOUR REPORT IS READY</p>
              <h1 className={cls(s.title, t ? s.titleTrt : s.titleHrt)}>{"Thank you for sharing.\nHere's what happens next."}</h1>
              <p className={cls(s.body, t ? s.bodyTrt : s.bodyHrt)}>We&apos;ve analysed your responses against our clinical recommendation framework. Before you see your full report, here&apos;s the honest path forward.</p>
              {[
                { n: "01", title: "See your personalised findings", desc: "A preview of what your symptoms, history and goals tell us — specific to you." },
                { n: "02", title: "Review your recommended tests", desc: "Unlocks your complete clinical breakdown, recommended tests, and a downloadable PDF you can keep or share with your GP.", highlight: true },
                { n: "03", title: "Choose your path forward", desc: "Select a Vitality package, book a test, or speak to a consultation specialist. Your account, your pace." },
              ].map((st) => (
                <div key={st.n} className={cls(s.step, t ? s.stepTrt : s.stepHrt, st.highlight && (t ? s.stepHighlightTrt : s.stepHighlightHrt))}>
                  <span className={cls(s.stepNum, t ? s.stepNumTrt : s.stepNumHrt)}>{st.n}</span>
                  <div><div className={cls(s.stepTitle, t ? s.stepTitleTrt : s.stepTitleHrt)}>{st.title}</div><div className={cls(s.stepDesc, t ? s.stepDescTrt : s.stepDescHrt)}>{st.desc}</div></div>
                </div>
              ))}
              <div className={s.btnRow} style={{ marginTop: 20 }}>
                <button className={cls(s.btnSecondary, t ? s.btnSecondaryTrt : s.btnSecondaryHrt)} onClick={back}>← BACK</button>
                <button className={cls(s.btnPrimary, t ? s.btnPrimaryTrt : s.btnPrimaryHrt)} onClick={nextPhase}>VIEW MY FINDINGS →</button>
              </div>
            </>
          )}

          {/* ─── FINDINGS ─── */}
          {phase === "findings" && (
            <>
              <p className={cls(s.eyebrow, t ? s.eyebrowTrt : s.eyebrowHrt)}>WHAT YOUR ANSWERS SUGGEST</p>
              <h1 className={cls(s.title, t ? s.titleTrt : s.titleHrt)}>3 patterns we noticed.</h1>
              <p className={cls(s.body, t ? s.bodyTrt : s.bodyHrt)}>Based on your symptoms and history, here&apos;s what stands out clinically.</p>
              {findings.map((f, i) => (
                <div key={i} style={{ position: "relative", marginBottom: 12 }}>
                  <div className={cls(s.finding, t ? s.findingTrt : s.findingHrt, f.locked && s.locked)}>
                    <div className={cls(s.findingHead, t ? s.findingHeadTrt : s.findingHeadHrt)}>{f.headline}</div>
                    <div className={cls(s.findingBody, t ? s.findingBodyTrt : s.findingBodyHrt)}>{f.detail}</div>
                  </div>
                  {f.locked && <div className={s.lockOverlay}><span className={cls(s.lockPill, t ? s.lockPillTrt : s.lockPillHrt)}>UNLOCK · CREATE ACCOUNT</span></div>}
                </div>
              ))}
              <div className={s.btnRow} style={{ marginTop: 8 }}>
                <button className={cls(s.btnSecondary, t ? s.btnSecondaryTrt : s.btnSecondaryHrt)} onClick={back}>← BACK</button>
                <button className={cls(s.btnPrimary, t ? s.btnPrimaryTrt : s.btnPrimaryHrt)} onClick={nextPhase}>CONTINUE →</button>
              </div>
            </>
          )}

          {/* ─── TESTS ─── */}
          {phase === "tests" && (
            <>
              <p className={cls(s.eyebrow, t ? s.eyebrowTrt : s.eyebrowHrt)}>RECOMMENDED FOR YOU</p>
              <h1 className={cls(s.title, t ? s.titleTrt : s.titleHrt)}>{"Test your levels.\nConfirm what's going on."}</h1>
              <p className={cls(s.body, t ? s.bodyTrt : s.bodyHrt)}>Based on your symptoms, we&apos;ve identified the tests that will give you the clearest picture.</p>
              {tests.map((test, i) => (
                <div key={i} style={{ position: "relative", marginBottom: 12 }}>
                  <div className={cls(s.testCard, t ? s.testCardTrt : s.testCardHrt, test.locked && s.locked)}>
                    <div className={cls(s.testName, t ? s.testNameTrt : s.testNameHrt)}>{test.name}</div>
                    <div className={cls(s.testMeasures, t ? s.testMeasuresTrt : s.testMeasuresTrt)}>{test.measures}</div>
                    <div className={s.priceRow}>
                      <div className={s.priceCol}><div className={cls(s.priceLabel, t ? s.priceLabelTrt : s.priceLabelHrt)}>AT HOME</div><div className={cls(s.priceVal, t ? s.priceValTrt : s.priceValHrt)}>{test.homePrice}</div></div>
                      <div className={s.priceCol}><div className={cls(s.priceLabel, t ? s.priceLabelTrt : s.priceLabelHrt)}>IN CLINIC</div><div className={cls(s.priceVal, t ? s.priceValTrt : s.priceValHrt)}>{test.clinicPrice}</div></div>
                    </div>
                    {!test.locked && <button className={cls(s.btnPrimary, t ? s.btnPrimaryTrt : s.btnPrimaryHrt)} style={{ width: "100%" }} onClick={completeAssessment}>BOOK THIS TEST →</button>}
                  </div>
                  {test.locked && <div className={s.lockOverlay}><span className={cls(s.lockPill, t ? s.lockPillTrt : s.lockPillHrt)}>UNLOCK · CREATE ACCOUNT</span></div>}
                </div>
              ))}
              <div className={s.btnRow} style={{ marginTop: 8 }}>
                <button className={cls(s.btnSecondary, t ? s.btnSecondaryTrt : s.btnSecondaryHrt)} onClick={back}>← BACK</button>
                <button className={cls(s.btnPrimary, t ? s.btnPrimaryTrt : s.btnPrimaryHrt)} onClick={nextPhase}>CONTINUE →</button>
              </div>
            </>
          )}

          {/* ─── DECISION ─── */}
          {phase === "decision" && (
            <>
              <p className={cls(s.eyebrow, t ? s.eyebrowTrt : s.eyebrowHrt)}>CHOOSE WHERE TO BEGIN</p>
              <h1 className={cls(s.title, t ? s.titleTrt : s.titleHrt)}>Three ways forward.</h1>
              <p className={cls(s.body, t ? s.bodyTrt : s.bodyHrt)}>There&apos;s no pressure to do everything at once. Pick what feels right today.</p>
              <div className={s.ctaStack}>
                <button className={cls(s.ctaCard, s.ctaPrimary, t ? s.ctaTrt : s.ctaHrt)} onClick={completeAssessment}>
                  <div className={cls(s.ctaEyebrow, t ? s.ctaEyebrowTrt : s.ctaEyebrowHrt)}>RECOMMENDED · {tests[0]?.homePrice ?? "£49.99"}</div>
                  <div className={cls(s.ctaTitle, t ? s.ctaTitleTrt : s.ctaTitleHrt)}>Book your {t ? "testosterone" : "hormone"} test</div>
                  <div className={cls(s.ctaSub, t ? s.ctaSubTrt : s.ctaSubHrt)}>Get a definitive answer in 5 days</div>
                </button>
                <button className={cls(s.ctaCard, s.ctaOutlined, t ? s.ctaTrt : s.ctaHrt)} onClick={completeAssessment}>
                  <div className={cls(s.ctaEyebrow, t ? s.ctaEyebrowTrt : s.ctaEyebrowHrt)}>FREE</div>
                  <div className={cls(s.ctaTitle, t ? s.ctaTitleTrt : s.ctaTitleHrt)}>Speak to a consultation specialist</div>
                  <div className={cls(s.ctaSub, t ? s.ctaSubTrt : s.ctaSubHrt)}>15 mins, no commitment, no payment details</div>
                </button>
                <button className={cls(s.ctaCard, s.ctaOutlined, t ? s.ctaTrt : s.ctaHrt)} onClick={completeAssessment}>
                  <div className={cls(s.ctaEyebrow, t ? s.ctaEyebrowTrt : s.ctaEyebrowHrt)}>SAVE FOR LATER</div>
                  <div className={cls(s.ctaTitle, t ? s.ctaTitleTrt : s.ctaTitleHrt)}>Access your full report</div>
                  <div className={cls(s.ctaSub, t ? s.ctaSubTrt : s.ctaSubHrt)}>Dashboard · results · treatment options</div>
                </button>
              </div>
              <div className={s.btnRow}>
                <button className={cls(s.btnSecondary, t ? s.btnSecondaryTrt : s.btnSecondaryHrt)} onClick={back}>← BACK</button>
                <span className={cls(s.reportDate, t ? s.reportDateTrt : s.reportDateHrt)}>REPORT · ELEVATE / {today}</span>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
