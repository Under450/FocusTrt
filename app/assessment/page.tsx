"use client";

import { useState, useEffect, useCallback } from "react";
import { CARDS, type Answers } from "./quiz-data";
import { generateFindings, recommendTests, type Finding, type TestRec } from "./quiz-logic";
import s from "./assessment.module.css";

type Phase = "quiz" | "transition" | "findings" | "tests" | "decision";
type Theme = "trt" | "hrt";

function uuid() {
  return crypto.randomUUID();
}

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
  const [cardIdx, setCardIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [phase, setPhase] = useState<Phase>("quiz");
  const [sessionId, setSessionId] = useState("");
  const [findings, setFindings] = useState<Finding[]>([]);
  const [tests, setTests] = useState<TestRec[]>([]);

  const sex = answers.sex as string | undefined;
  const theme: Theme = sex === "I'm a woman" ? "hrt" : "trt";
  const t = theme === "trt";

  // Build active card list (skip conditional cards that don't apply)
  const activeCards = CARDS.filter(
    (c) => !c.conditional || c.conditional(answers)
  );
  const card = phase === "quiz" ? activeCards[cardIdx] : null;
  const totalCards = activeCards.length;
  const progress = phase === "quiz" ? ((cardIdx + 1) / totalCards) * 100 : 100;

  useEffect(() => {
    const stored = localStorage.getItem("elevate_session_id");
    if (stored) {
      setSessionId(stored);
      const savedAnswers = localStorage.getItem("elevate_answers");
      if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    } else {
      const id = uuid();
      setSessionId(id);
      localStorage.setItem("elevate_session_id", id);
    }
  }, []);

  const save = useCallback(
    (updated: Answers) => {
      localStorage.setItem("elevate_answers", JSON.stringify(updated));
    },
    []
  );

  function setAnswer(key: string, val: string | string[] | number | null) {
    const updated = { ...answers, [key]: val };
    setAnswers(updated);
    save(updated);
  }

  function toggleMulti(key: string, val: string) {
    const current = (answers[key] as string[]) || [];
    // "None" variants clear everything else; selecting anything else clears "None"
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
    if (!card) return [];
    if (!card.options) return [];
    if (Array.isArray(card.options)) return card.options;
    return t ? card.options.trt : card.options.hrt;
  }

  function isValid(): boolean {
    if (!card) return true;
    if (card.type === "welcome" || card.type === "loading") return true;
    if (card.type === "combined" && card.id === "biometrics") return true; // optional
    if (card.type === "segmented") return true; // optional
    if (card.type === "single") return !!answers[card.id];
    if (card.type === "multi") {
      const v = answers[card.id];
      return Array.isArray(v) && v.length > 0;
    }
    return true;
  }

  function next() {
    if (!card) return;

    // Loading card: generate report after delay
    if (card.type === "loading") {
      setTimeout(() => {
        setFindings(generateFindings(answers));
        setTests(recommendTests(answers));
        setPhase("transition");
      }, 3000);
      setCardIdx(cardIdx + 1); // won't render, phase changes
      return;
    }

    if (cardIdx < totalCards - 1) {
      setCardIdx(cardIdx + 1);
    }
  }

  function back() {
    if (phase === "decision") { setPhase("tests"); return; }
    if (phase === "tests") { setPhase("findings"); return; }
    if (phase === "findings") { setPhase("transition"); return; }
    if (phase === "transition") {
      // Go back to last quiz card before loading
      setPhase("quiz");
      setCardIdx(Math.max(0, totalCards - 2));
      return;
    }
    if (cardIdx > 0) setCardIdx(cardIdx - 1);
  }

  function nextPhase() {
    if (phase === "transition") setPhase("findings");
    else if (phase === "findings") setPhase("tests");
    else if (phase === "tests") setPhase("decision");
  }

  // Auto-advance on loading card
  useEffect(() => {
    if (card?.type === "loading" && phase === "quiz") {
      const timer = setTimeout(() => {
        setFindings(generateFindings(answers));
        setTests(recommendTests(answers));
        setPhase("transition");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [card, phase, answers]);

  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className={cls(s.shell, t ? s.shellTrt : s.shellHrt)}>
      <div className={cls(s.card, t ? s.cardTrt : s.cardHrt)}>
        <div className={cls(s.stripe, t ? s.stripeTrt : s.stripeHrt)} />
        <div className={s.cardInner}>

          {/* Progress */}
          {phase === "quiz" && card?.type !== "welcome" && (
            <div className={s.progressWrap}>
              <div className={cls(s.progressBar, t ? s.progressBarTrt : s.progressBarHrt)} role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
                <div className={cls(s.progressFill, t ? s.progressFillTrt : s.progressFillHrt)} style={{ width: `${progress}%` }} />
              </div>
              <span className={cls(s.stepCount, t ? s.stepCountTrt : s.stepCountHrt)}>
                {cardIdx + 1} / {totalCards}
              </span>
            </div>
          )}

          {phase !== "quiz" && (
            <div className={s.progressWrap}>
              <div className={cls(s.progressBar, t ? s.progressBarTrt : s.progressBarHrt)}>
                <div className={cls(s.progressFill, t ? s.progressFillTrt : s.progressFillHrt)} style={{ width: "100%" }} />
              </div>
              <span className={cls(s.pill, t ? s.pillTrt : s.pillHrt)}>QUIZ COMPLETE</span>
            </div>
          )}

          {/* ─── QUIZ PHASE ─── */}
          {phase === "quiz" && card && (
            <>
              <p className={cls(s.eyebrow, t ? s.eyebrowTrt : s.eyebrowHrt)}>{card.eyebrow}</p>
              <h1 className={cls(s.title, t ? s.titleTrt : s.titleHrt)}>{card.title}</h1>
              <p className={cls(s.body, t ? s.bodyTrt : s.bodyHrt)}>{card.body}</p>

              {/* Single select */}
              {card.type === "single" && (
                <div className={s.options}>
                  {getOptions().map((opt) => (
                    <button
                      key={opt}
                      className={cls(
                        s.option,
                        t ? s.optionTrt : s.optionHrt,
                        answers[card.id] === opt && (t ? s.optionTrtSelected : s.optionHrtSelected)
                      )}
                      onClick={() => setAnswer(card.id, opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Multi select */}
              {card.type === "multi" && (
                <div className={s.options}>
                  {getOptions().map((opt) => (
                    <button
                      key={opt}
                      className={cls(
                        s.option,
                        t ? s.optionTrt : s.optionHrt,
                        ((answers[card.id] as string[]) || []).includes(opt) && (t ? s.optionTrtSelected : s.optionHrtSelected)
                      )}
                      onClick={() => toggleMulti(card.id, opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Combined inputs (biometrics) */}
              {card.type === "combined" && card.id === "biometrics" && (
                <div className={s.inputGroup}>
                  <div>
                    <div className={cls(s.inputLabel, t ? s.inputLabelTrt : s.inputLabelHrt)}>AGE</div>
                    <input
                      type="number"
                      min={18}
                      max={90}
                      placeholder="e.g. 38"
                      className={cls(s.inputField, t ? s.inputFieldTrt : s.inputFieldHrt)}
                      value={answers.age as number || ""}
                      onChange={(e) => setAnswer("age", e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                  <div>
                    <div className={cls(s.inputLabel, t ? s.inputLabelTrt : s.inputLabelHrt)}>WEIGHT (KG)</div>
                    <input
                      type="number"
                      min={30}
                      max={250}
                      placeholder="e.g. 85"
                      className={cls(s.inputField, t ? s.inputFieldTrt : s.inputFieldHrt)}
                      value={answers.weight as number || ""}
                      onChange={(e) => setAnswer("weight", e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                  <div>
                    <div className={cls(s.inputLabel, t ? s.inputLabelTrt : s.inputLabelHrt)}>HEIGHT (CM)</div>
                    <input
                      type="number"
                      min={120}
                      max={230}
                      placeholder="e.g. 178"
                      className={cls(s.inputField, t ? s.inputFieldTrt : s.inputFieldHrt)}
                      value={answers.height as number || ""}
                      onChange={(e) => setAnswer("height", e.target.value ? Number(e.target.value) : null)}
                    />
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
                          <button
                            key={opt}
                            className={cls(
                              s.segBtn,
                              t ? s.segBtnTrt : s.segBtnHrt,
                              answers[key] === opt && (t ? s.segBtnTrtActive : s.segBtnHrtActive)
                            )}
                            onClick={() => setAnswer(key, opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Loading */}
              {card.type === "loading" && (
                <div className={cls(s.spinner, !t && s.spinnerHrt)} />
              )}

              {/* Buttons */}
              {card.type !== "loading" && (
                <div className={s.btnRow}>
                  {cardIdx > 0 ? (
                    <button className={cls(s.btnSecondary, t ? s.btnSecondaryTrt : s.btnSecondaryHrt)} onClick={back}>
                      ← BACK
                    </button>
                  ) : <span />}
                  <button
                    className={cls(s.btnPrimary, t ? s.btnPrimaryTrt : s.btnPrimaryHrt)}
                    onClick={next}
                    disabled={card.type !== "welcome" && !isValid()}
                  >
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
              <p className={cls(s.body, t ? s.bodyTrt : s.bodyHrt)}>
                We&apos;ve analysed your responses against our clinical recommendation framework. Before you see your full report, here&apos;s the honest path forward.
              </p>

              {[
                { n: "01", title: "See your personalised findings", desc: "A preview of what your symptoms, history and goals tell us — specific to you." },
                { n: "02", title: "Create your free account", desc: "Unlocks your complete clinical breakdown, recommended tests, and a downloadable PDF you can keep or share with your GP.", highlight: true },
                { n: "03", title: "Choose your path forward", desc: "Book a test, speak to a consultation specialist, or save your report for later. Your account, your pace." },
              ].map((st) => (
                <div key={st.n} className={cls(s.step, t ? s.stepTrt : s.stepHrt, st.highlight && (t ? s.stepHighlightTrt : s.stepHighlightHrt))}>
                  <span className={cls(s.stepNum, t ? s.stepNumTrt : s.stepNumHrt)}>{st.n}</span>
                  <div>
                    <div className={cls(s.stepTitle, t ? s.stepTitleTrt : s.stepTitleHrt)}>{st.title}</div>
                    <div className={cls(s.stepDesc, t ? s.stepDescTrt : s.stepDescHrt)}>{st.desc}</div>
                  </div>
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
              <p className={cls(s.body, t ? s.bodyTrt : s.bodyHrt)}>
                Based on your symptoms and history, here&apos;s what stands out clinically.
              </p>

              {findings.map((f, i) => (
                <div key={i} style={{ position: "relative", marginBottom: 12 }}>
                  <div className={cls(s.finding, t ? s.findingTrt : s.findingHrt, f.locked && s.locked)}>
                    <div className={cls(s.findingHead, t ? s.findingHeadTrt : s.findingHeadHrt)}>{f.headline}</div>
                    <div className={cls(s.findingBody, t ? s.findingBodyTrt : s.findingBodyHrt)}>{f.detail}</div>
                  </div>
                  {f.locked && (
                    <div className={s.lockOverlay}>
                      <span className={cls(s.lockPill, t ? s.lockPillTrt : s.lockPillHrt)}>UNLOCK · CREATE ACCOUNT</span>
                    </div>
                  )}
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
              <p className={cls(s.body, t ? s.bodyTrt : s.bodyHrt)}>
                Based on your symptoms, we&apos;ve identified the tests that will give you the clearest picture.
              </p>

              {tests.map((test, i) => (
                <div key={i} style={{ position: "relative", marginBottom: 12 }}>
                  <div className={cls(s.testCard, t ? s.testCardTrt : s.testCardHrt, test.locked && s.locked)}>
                    <div className={cls(s.testName, t ? s.testNameTrt : s.testNameHrt)}>{test.name}</div>
                    <div className={cls(s.testMeasures, t ? s.testMeasuresTrt : s.testMeasuresHrt)}>{test.measures}</div>
                    <div className={s.priceRow}>
                      <div className={s.priceCol}>
                        <div className={cls(s.priceLabel, t ? s.priceLabelTrt : s.priceLabelHrt)}>AT HOME</div>
                        <div className={cls(s.priceVal, t ? s.priceValTrt : s.priceValHrt)}>{test.homePrice}</div>
                      </div>
                      <div className={s.priceCol}>
                        <div className={cls(s.priceLabel, t ? s.priceLabelTrt : s.priceLabelHrt)}>IN CLINIC</div>
                        <div className={cls(s.priceVal, t ? s.priceValTrt : s.priceValHrt)}>{test.clinicPrice}</div>
                      </div>
                    </div>
                    {!test.locked && (
                      <button
                        className={cls(s.btnPrimary, t ? s.btnPrimaryTrt : s.btnPrimaryHrt)}
                        style={{ width: "100%" }}
                        onClick={() => alert("Account creation coming in next stage")}
                      >
                        BOOK THIS TEST →
                      </button>
                    )}
                  </div>
                  {test.locked && (
                    <div className={s.lockOverlay}>
                      <span className={cls(s.lockPill, t ? s.lockPillTrt : s.lockPillHrt)}>UNLOCK · CREATE ACCOUNT</span>
                    </div>
                  )}
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
              <p className={cls(s.body, t ? s.bodyTrt : s.bodyHrt)}>
                There&apos;s no pressure to do everything at once. Pick what feels right today.
              </p>

              <div className={s.ctaStack}>
                <button
                  className={cls(s.ctaCard, s.ctaPrimary, t ? s.ctaTrt : s.ctaHrt)}
                  onClick={() => alert("Account creation coming in next stage")}
                >
                  <div className={cls(s.ctaEyebrow, t ? s.ctaEyebrowTrt : s.ctaEyebrowHrt)}>
                    RECOMMENDED · {tests[0]?.homePrice ?? "£49.99"}
                  </div>
                  <div className={cls(s.ctaTitle, t ? s.ctaTitleTrt : s.ctaTitleHrt)}>
                    Book your {t ? "testosterone" : "hormone"} test
                  </div>
                  <div className={cls(s.ctaSub, t ? s.ctaSubTrt : s.ctaSubHrt)}>
                    Get a definitive answer in 5 days
                  </div>
                </button>

                <button
                  className={cls(s.ctaCard, s.ctaOutlined, t ? s.ctaTrt : s.ctaHrt)}
                  onClick={() => alert("Account creation coming in next stage")}
                >
                  <div className={cls(s.ctaEyebrow, t ? s.ctaEyebrowTrt : s.ctaEyebrowHrt)}>FREE</div>
                  <div className={cls(s.ctaTitle, t ? s.ctaTitleTrt : s.ctaTitleHrt)}>
                    Speak to a consultation specialist
                  </div>
                  <div className={cls(s.ctaSub, t ? s.ctaSubTrt : s.ctaSubHrt)}>
                    15 mins, no commitment, no payment details
                  </div>
                </button>

                <button
                  className={cls(s.ctaCard, s.ctaOutlined, t ? s.ctaTrt : s.ctaHrt)}
                  onClick={() => alert("Account creation coming in next stage")}
                >
                  <div className={cls(s.ctaEyebrow, t ? s.ctaEyebrowTrt : s.ctaEyebrowHrt)}>SAVE FOR LATER</div>
                  <div className={cls(s.ctaTitle, t ? s.ctaTitleTrt : s.ctaTitleHrt)}>
                    Email me my full report
                  </div>
                  <div className={cls(s.ctaSub, t ? s.ctaSubTrt : s.ctaSubHrt)}>
                    Create account · unlocks complete analysis
                  </div>
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
