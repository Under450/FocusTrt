"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../dashboard/dashboard.module.css";
import MemberSidebar from "./MemberSidebar";
import BiomarkerRing from "./BiomarkerRing";

interface AssessmentData {
  answers: Record<string, unknown>;
  findings: { headline: string; detail: string }[];
  tests: { name: string; measures: string; homePrice: string; clinicPrice: string }[];
  completedAt: string;
  firstName: string;
  theme: "trt" | "hrt";
}

export default function MemberDashboard() {
  const router = useRouter();
  const [patientName, setPatientName] = useState("there");
  const [firstName, setFirstName] = useState("there");
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [hasPackage, setHasPackage] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("focus_patient_name") || "";
    const fn = name.split(" ")[0] || "there";
    setPatientName(name || "there");
    setFirstName(fn);

    const raw = localStorage.getItem("focus_assessment");
    if (raw) {
      try { setAssessment(JSON.parse(raw)); } catch { /* ignore */ }
    }

    const pkg = localStorage.getItem("focus_package");
    if (pkg) setHasPackage(true);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const topSymptoms = assessment
    ? ((assessment.answers.symptoms as string[]) || []).slice(0, 3)
    : [];

  const assessmentDate = assessment
    ? new Date(assessment.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div className={styles.app}>
      <MemberSidebar active="dashboard" />

      <main className={styles.main}>
        {/* Header */}
        <div className={styles.hdr}>
          <div>
            <div className={styles.hdrGreeting}>{greeting}, {firstName}</div>
            <div className={styles.hdrSub}>BLOOD RESULTS READY · ASSESSMENT COMPLETE</div>
          </div>
          <button className={styles.btnCopper} onClick={() => router.push("/elevate")}>VIEW PACKAGES</button>
        </div>
        <div className={styles.divider} />

        {/* Assessment synopsis tile — shown when no package purchased */}
        {assessment && !hasPackage && (
          <div className={styles.card} style={{ marginBottom: 20, borderColor: "#b87333", background: "rgba(184,115,51,0.06)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <div className={styles.cardTitle} style={{ color: "#b87333" }}>Your Assessment · {assessmentDate}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: "1.5px", color: "#bd9468", marginBottom: 12 }}>
                  {assessment.theme === "trt" ? "TESTOSTERONE OPTIMISATION" : "HORMONE BALANCING"} · ELEVATE REPORT
                </div>
              </div>
            </div>
            {/* Key finding */}
            {assessment.findings[0] && (
              <div style={{ marginBottom: 10, padding: "12px 14px", background: "rgba(184,115,51,0.08)", borderLeft: "3px solid #b87333", borderRadius: "0 6px 6px 0" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: "1.5px", color: "#b87333", marginBottom: 4 }}>KEY FINDING</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 15, color: "#fbf3da", lineHeight: 1.5 }}>{assessment.findings[0].headline}</div>
              </div>
            )}
            {/* Symptoms */}
            {topSymptoms.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {topSymptoms.map((sym) => (
                  <span key={sym} style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "1px", color: "#bd9468", background: "rgba(184,115,51,0.1)", padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(184,115,51,0.2)" }}>
                    {sym.toUpperCase()}
                  </span>
                ))}
              </div>
            )}
            <Link href="/assessment-results" style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--sans)", fontSize: 11, letterSpacing: "1.5px", color: "#b87333", textDecoration: "none" }}>
              VIEW FULL ASSESSMENT
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="#b87333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        )}

        {/* Injection + Clinician */}
        <div className={styles.row2}>
          {/* Injection tile — shows package prompt pre-purchase */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>Next injection</div>
            {hasPackage ? (
              <>
                <div className={styles.injTop}>
                  <span className={styles.injTag}>CYPIONATE · 100MG</span>
                </div>
                <div className={styles.injBody}>
                  <div className={styles.injCircle}>
                    <span className={styles.injDay}>Mon</span>
                    <span className={styles.injSub}>IN 3 DAYS</span>
                  </div>
                  <div className={styles.injDetails}>
                    <div className={styles.injRow}><span className={styles.injLabel}>SITE</span><span className={styles.injVal}>Left quad</span></div>
                    <div className={styles.injRow}><span className={styles.injLabel}>FREQUENCY</span><span className={styles.injVal}>Twice weekly</span></div>
                    <div className={styles.injRow}><span className={styles.injLabel}>VIAL</span><span className={styles.injVal}>14 doses left</span></div>
                  </div>
                </div>
                <button className={styles.btnCopperSm}>LOG INJECTION</button>
              </>
            ) : (
              <>
                <div style={{ padding: "24px 0 8px", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "2px", color: "#b87333", marginBottom: 12 }}>CHOOSE YOUR VITALITY PACKAGE</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 15, color: "#fbf3da", lineHeight: 1.6, marginBottom: 20, opacity: 0.7 }}>
                    Your protocol will be set once you select a package and complete your clinical onboarding.
                  </div>
                </div>
                <button className={styles.btnCopperSm} onClick={() => router.push("/elevate")}>
                  VIEW PACKAGES →
                </button>
              </>
            )}
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Your clinician</span>
              <div className={styles.clinDot} />
            </div>
            <div className={styles.clinRow}>
              <div className={styles.clinAvatar}>DM</div>
              <div>
                <div className={styles.clinName}>Dr Daniel Marsh</div>
                <div className={styles.clinRole}>Endocrinologist</div>
              </div>
            </div>
            <button className={styles.btnOutline}>SEND SECURE MESSAGE</button>
          </div>
        </div>

        {/* KPIs — zeroed pre-protocol */}
        <div className={styles.kpiRow}>
          <BiomarkerRing label="Total T" value={0} unit="ng/dL" min={300} max={1000} />
          <BiomarkerRing label="Free T" value={0} unit="pg/mL" min={9} max={30} />
          <BiomarkerRing label="Estradiol" value={0} unit="pg/mL" min={10} max={40} />
          <BiomarkerRing label="Haematocrit" value={0} unit="%" min={38} max={50} />
          <BiomarkerRing label="SHBG" value={0} unit="nmol/L" min={18} max={54} />
        </div>

        {/* Treatments */}
        <div className={styles.secHdr}>
          <div className={styles.secTitle}>Explore treatments</div>
          <span className={styles.treatCta}>VIEW ALL →</span>
        </div>
        <div className={styles.treatGrid}>
          <div className={`${styles.treatTile} ${styles.treatTileActive}`}>
            <div className={styles.treatTag}>PENDING · CORE</div>
            <div className={styles.treatName}>Testosterone</div>
            <div className={styles.treatDesc}>Cypionate, enanthate, cream or pellets. Clinician-led protocols built around your labs.</div>
            <span className={styles.treatCta} style={{ cursor: "pointer" }} onClick={() => router.push("/elevate")}>CHOOSE PACKAGE →</span>
          </div>
          <div className={styles.treatTile}>
            <div className={styles.treatTag}>AVAILABLE</div>
            <div className={styles.treatName}>Weight loss</div>
            <div className={styles.treatDesc}>Semaglutide and tirzepatide. Medically supervised, titrated to your metabolism.</div>
            <span className={styles.treatCta}>TAKE ASSESSMENT →</span>
          </div>
          <div className={styles.treatTile}>
            <div className={styles.treatTag}>AVAILABLE</div>
            <div className={styles.treatName}>Sexual health</div>
            <div className={styles.treatDesc}>ED treatment, PT-141, Trimix and shockwave therapy. Discreet delivery.</div>
            <span className={styles.treatCta}>TAKE ASSESSMENT →</span>
          </div>
          <div className={styles.treatTile}>
            <div className={styles.treatTag}>AVAILABLE</div>
            <div className={styles.treatName}>Peptides</div>
            <div className={styles.treatDesc}>Sermorelin, ipamorelin, BPC-157. Recovery, sleep and growth hormone support.</div>
            <span className={styles.treatCta}>EXPLORE →</span>
          </div>
          <div className={styles.treatTile}>
            <div className={styles.treatTag}>AVAILABLE</div>
            <div className={styles.treatName}>Longevity</div>
            <div className={styles.treatDesc}>NAD+ infusions, glutathione, advanced biomarker panels and healthspan coaching.</div>
            <span className={styles.treatCta}>EXPLORE →</span>
          </div>
          <div className={styles.treatTile}>
            <div className={styles.treatTag}>AVAILABLE</div>
            <div className={styles.treatName}>Hair &amp; skin</div>
            <div className={styles.treatDesc}>Finasteride, minoxidil, topical treatments. Because how you look matters too.</div>
            <span className={styles.treatCta}>EXPLORE →</span>
          </div>
        </div>

        {/* Daily check-in + Chart */}
        <div className={styles.row2eq}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Daily check-in</div>
            <div className={styles.scoreGrid}>
              <div className={styles.score}><div className={styles.scoreLabel}>ENERGY</div><div className={styles.scoreVal}>—</div></div>
              <div className={styles.score}><div className={styles.scoreLabel}>MOOD</div><div className={styles.scoreVal}>—</div></div>
              <div className={styles.score}><div className={styles.scoreLabel}>LIBIDO</div><div className={styles.scoreVal}>—</div></div>
              <div className={styles.score}><div className={styles.scoreLabel}>SLEEP</div><div className={styles.scoreVal}>—</div></div>
            </div>
            <button className={styles.btnOutline}>LOG TODAY</button>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Testosterone · trend</div>
            <div className={styles.chartWrap}>
              {/* Flat zero line — no data yet */}
              <svg viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="20" x2="320" y2="20" stroke="#b87333" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2" />
                <line x1="0" y1="100" x2="320" y2="100" stroke="#b87333" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2" />
                {/* Flat baseline */}
                <line x1="16" y1="100" x2="304" y2="100" stroke="#b87333" strokeWidth="2" strokeLinecap="round" opacity="0.25" strokeDasharray="6 4" />
                <text x="50%" y="58" textAnchor="middle" fill="#bd9468" fontFamily="Didact Gothic,sans-serif" fontSize="11" opacity="0.5">No data yet</text>
                <text x="50%" y="74" textAnchor="middle" fill="#bd9468" fontFamily="Didact Gothic,sans-serif" fontSize="9" opacity="0.4">Results populate after your first blood panel</text>
              </svg>
            </div>
          </div>
        </div>

        {/* ─── PACKAGES SECTION ─── */}
        <div className={styles.secHdr} style={{ marginTop: 8 }}>
          <div className={styles.secTitle}>Choose your Vitality package</div>
          <Link href="/elevate" style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: "1.5px", color: "#b87333", textDecoration: "none" }}>SEE ALL →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
          {/* Essential */}
          <div className={styles.card} style={{ borderColor: "rgba(184,115,51,0.3)", display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "2px", color: "#b87333", marginBottom: 8 }}>ESSENTIAL</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, color: "#fbf3da", marginBottom: 4 }}>Vitality Start</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#bd9468", marginBottom: 16, flex: 1 }}>
              Entry-level TRT protocol. Blood panel, clinician consultation and monthly medication.
            </div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "#b87333", marginBottom: 4 }}>£129<span style={{ fontSize: 14, color: "#bd9468" }}>/mo</span></div>
            <Link href="/elevate" className={styles.btnCopperSm} style={{ textAlign: "center", textDecoration: "none", display: "block" }}>GET STARTED →</Link>
          </div>
          {/* Core */}
          <div className={styles.card} style={{ borderColor: "#b87333", background: "rgba(184,115,51,0.06)", display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "2px", color: "#b87333", marginBottom: 8 }}>MOST POPULAR</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, color: "#fbf3da", marginBottom: 4 }}>Vitality Core</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#bd9468", marginBottom: 16, flex: 1 }}>
              Full TRT management. Quarterly bloods, optimised protocol, AI check-ins and clinician access.
            </div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "#b87333", marginBottom: 4 }}>£199<span style={{ fontSize: 14, color: "#bd9468" }}>/mo</span></div>
            <Link href="/elevate" className={styles.btnCopperSm} style={{ textAlign: "center", textDecoration: "none", display: "block" }}>GET STARTED →</Link>
          </div>
          {/* Elite */}
          <div className={styles.card} style={{ borderColor: "rgba(184,115,51,0.3)", display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "2px", color: "#b87333", marginBottom: 8 }}>ELITE</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, color: "#fbf3da", marginBottom: 4 }}>Vitality Elite</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#bd9468", marginBottom: 16, flex: 1 }}>
              Comprehensive optimisation. Full panel, peptides, longevity add-ons and concierge clinician.
            </div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "#b87333", marginBottom: 4 }}>£349<span style={{ fontSize: 14, color: "#bd9468" }}>/mo</span></div>
            <Link href="/elevate" className={styles.btnCopperSm} style={{ textAlign: "center", textDecoration: "none", display: "block" }}>GET STARTED →</Link>
          </div>
        </div>

        {/* Banner */}
        <div className={styles.banner}>
          <div>
            <div className={styles.bannerOver}>THE INNER CIRCLE</div>
            <div className={styles.bannerTitle}>Members-only community, events and expert Q&amp;As</div>
            <div className={styles.bannerSub}>Private forum · monthly clinician AMAs · quarterly retreats</div>
          </div>
          <Link href="/inner-circle" className={styles.btnCopper}>ENTER →</Link>
        </div>
      </main>
    </div>
  );
}
