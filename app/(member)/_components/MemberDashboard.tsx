"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import s from "../dashboard/dashboard.module.css";
import MemberSidebar from "./MemberSidebar";
import BiomarkerRing from "./BiomarkerRing";

type Assessment = {
  answers: Record<string, unknown>;
  findings: { headline: string; detail: string; locked?: boolean }[];
  tests: { name: string; measures: string; homePrice: string; clinicPrice: string; locked?: boolean }[];
  completedAt: string;
  firstName: string;
  theme: "trt" | "hrt";
} | null;

function getGreeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function formatDate(d: Date): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function MemberDashboard() {
  const [name, setName] = useState("");
  const [assessment, setAssessment] = useState<Assessment>(null);
  const [hasPackage, setHasPackage] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setName(localStorage.getItem("focus_patient_name") || "");
    const raw = localStorage.getItem("focus_assessment");
    if (raw) {
      try { setAssessment(JSON.parse(raw)); } catch { /* ignore */ }
    }
    setHasPackage(!!localStorage.getItem("focus_package"));
  }, []);

  if (!mounted) return null;

  const firstName = name?.split(" ")[0] || assessment?.firstName || "";
  const greeting = `${getGreeting()}, ${firstName || "\u2014"}`;
  const symptoms = (assessment?.answers?.symptoms as string[]) || [];
  const topSymptoms = symptoms.slice(0, 3);
  const completedDate = assessment?.completedAt
    ? new Date(assessment.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";
  const themeLabel = assessment?.theme === "hrt" ? "HORMONE BALANCING" : "TESTOSTERONE OPTIMISATION";

  const subHeader = assessment
    ? hasPackage ? "PROTOCOL ON TRACK" : "ASSESSMENT COMPLETE \u00B7 BLOOD RESULTS PENDING"
    : "WELCOME TO REVIVE";

  return (
    <div className={s.app}>
      <MemberSidebar active="dashboard" />

      <main className={s.main}>
        {/* Header */}
        <div className={s.hdr}>
          <div>
            <div className={s.hdrEyebrow}>PATIENT PORTAL</div>
            <div className={s.hdrGreeting}>{greeting}</div>
            <div className={s.hdrSub}>{subHeader}</div>
          </div>
          <div className={s.hdrRight}>
            <div className={s.hdrDate}>{formatDate(new Date())}</div>
            <button className={s.btnCopper}>BOOK CONSULTATION</button>
          </div>
        </div>
        <div className={s.divider} />

        {/* Assessment Synopsis — only when assessment exists and no package */}
        {assessment && !hasPackage && (
          <div className={s.synopsis}>
            <div className={s.synopsisHeader}>
              <div className={s.synopsisTitle}>Your Assessment</div>
              <div className={s.synopsisDate}>{completedDate}</div>
            </div>
            <div className={s.synopsisTheme}>{themeLabel}</div>
            {assessment.findings[0] && (
              <div className={s.synopsisFinding}>{assessment.findings[0].headline} &mdash; {assessment.findings[0].detail}</div>
            )}
            {topSymptoms.length > 0 && (
              <div className={s.synopsisPills}>
                {topSymptoms.map((sym) => (
                  <span key={sym} className={s.synopsisPill}>{sym}</span>
                ))}
              </div>
            )}
            <Link href="/assessment-results" className={s.synopsisLink}>VIEW FULL RESULTS &rarr;</Link>
          </div>
        )}

        {/* Protocol + Clinician */}
        <div className={s.row2}>
          <div>
            <div className={s.secHdr}>
              <div className={s.secTitle}>{hasPackage ? "NEXT INJECTION" : "YOUR PROTOCOL"}</div>
              <div className={s.secLine} />
            </div>
            <div className={s.card}>
              {hasPackage ? (
                <>
                  <div className={s.injTop}>
                    <span className={s.injTag}>CYPIONATE &middot; 100MG</span>
                  </div>
                  <div className={s.injBody}>
                    <div className={s.injCircle}>
                      <span className={s.injDay}>Mon</span>
                      <span className={s.injSub}>IN 3 DAYS</span>
                    </div>
                    <div className={s.injDetails}>
                      <div className={s.injRow}><span className={s.injLabel}>SITE</span><span className={s.injVal}>Left quad</span></div>
                      <div className={s.injRow}><span className={s.injLabel}>FREQUENCY</span><span className={s.injVal}>Twice weekly</span></div>
                      <div className={s.injRow}><span className={s.injLabel}>VIAL</span><span className={s.injVal}>14 doses remaining</span></div>
                    </div>
                  </div>
                  <button className={s.btnCopperSm}>LOG INJECTION</button>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 600, color: "var(--cream)", marginBottom: 8 }}>
                    Choose your Vitality package
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 22, lineHeight: 1.5 }}>
                    Select a package to unlock your personalised protocol,<br />clinician assignment, and ongoing monitoring.
                  </div>
                  <a href="#packages" className={s.btnCopper}>VIEW PACKAGES</a>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className={s.secHdr}>
              <div className={s.secTitle}>YOUR CLINICIAN</div>
              <div className={s.secLine} />
            </div>
            <div className={`${s.card} ${s.clinCard}`}>
              <div className={s.clinDot} />
              <div className={s.clinRow}>
                <div className={s.clinAvatar}>DW</div>
                <div>
                  <div className={s.clinName}>Dr. David Williams</div>
                  <div className={s.clinRole}>TRT Specialist &middot; GMC 7654321</div>
                </div>
              </div>
              <div className={s.msgWrap}>
                <input className={s.msgInput} placeholder="Send a secure message..." />
                <button className={s.msgSend}>Send</button>
              </div>
            </div>
          </div>
        </div>

        {/* Biomarkers */}
        <div className={s.secHdr}>
          <div className={s.secTitle}>LATEST BIOMARKERS</div>
          <div className={s.secLine} />
        </div>
        <div className={s.kpiRow}>
          <div className={s.kpiCard}>
            <BiomarkerRing label="Total Testosterone" value={0} unit="nmol/L" min={86} max={290} size={120} />
            <div className={s.kpiRange}>86&ndash;290</div>
            <span className={`${s.kpiBadge} ${s.kpiPending}`}>PENDING</span>
          </div>
          <div className={s.kpiCard}>
            <BiomarkerRing label="Free Testosterone" value={0} unit="pmol/L" min={170} max={670} size={120} />
            <div className={s.kpiRange}>170&ndash;670</div>
            <span className={`${s.kpiBadge} ${s.kpiPending}`}>PENDING</span>
          </div>
          <div className={s.kpiCard}>
            <BiomarkerRing label="Estradiol (E2)" value={0} unit="pmol/L" min={90} max={160} size={120} />
            <div className={s.kpiRange}>90&ndash;160</div>
            <span className={`${s.kpiBadge} ${s.kpiPending}`}>PENDING</span>
          </div>
          <div className={s.kpiCard}>
            <BiomarkerRing label="Haematocrit" value={0} unit="%" min={38} max={52} size={120} />
            <div className={s.kpiRange}>38&ndash;52%</div>
            <span className={`${s.kpiBadge} ${s.kpiPending}`}>PENDING</span>
          </div>
        </div>

        {/* Treatments */}
        <div className={s.secHdr}>
          <div className={s.secTitle}>EXPLORE TREATMENTS</div>
          <div className={s.secLine} />
        </div>
        <div className={s.treatGrid}>
          <div className={`${s.treatTile} ${s.treatTileActive}`}>
            <div className={s.treatTag}>RECOMMENDED</div>
            <div className={s.treatName}>Testosterone</div>
            <div className={s.treatDesc}>Cypionate, enanthate, cream or pellets. Clinician-led protocols built around your labs.</div>
            <a href="#packages" className={s.treatCta}>VIEW PACKAGES &rarr;</a>
          </div>
          <div className={s.treatTile}>
            <div className={s.treatTag}>AVAILABLE</div>
            <div className={s.treatName}>Weight Loss</div>
            <div className={s.treatDesc}>Semaglutide and tirzepatide. Medically supervised, titrated to your metabolism.</div>
            <span className={s.treatCta}>TAKE ASSESSMENT &rarr;</span>
          </div>
          <div className={s.treatTile}>
            <div className={s.treatTag}>AVAILABLE</div>
            <div className={s.treatName}>Sexual Health</div>
            <div className={s.treatDesc}>ED treatment, PT-141, Trimix and shockwave therapy. Discreet delivery.</div>
            <span className={s.treatCta}>TAKE ASSESSMENT &rarr;</span>
          </div>
        </div>

        {/* Chart + Check-in */}
        <div className={s.row2eq}>
          <div className={s.card}>
            <div className={s.cardTitle}>Daily check-in</div>
            <div className={s.scoreGrid}>
              {["ENERGY", "MOOD", "LIBIDO", "SLEEP"].map((label) => (
                <div key={label} className={s.score}>
                  <div className={s.scoreLabel}>{label}</div>
                  <div className={s.scoreVal} style={{ color: "var(--dim)" }}>&mdash;</div>
                </div>
              ))}
            </div>
            <button className={s.btnOutline}>LOG TODAY</button>
          </div>
          <div className={s.card}>
            <div className={s.cardTitle}>Testosterone &middot; 6 months</div>
            <div className={s.chartWrap}>
              <svg viewBox="0 0 320 120" fill="none">
                <line x1="0" y1="20" x2="320" y2="20" stroke="var(--copper)" strokeWidth="0.5" strokeDasharray="4 4" opacity={0.2} />
                <line x1="0" y1="60" x2="320" y2="60" stroke="var(--copper)" strokeWidth="1" strokeDasharray="6 4" opacity={0.2} />
                <line x1="0" y1="100" x2="320" y2="100" stroke="var(--copper)" strokeWidth="0.5" strokeDasharray="4 4" opacity={0.2} />
                <text x="160" y="78" textAnchor="middle" fill="rgba(201,135,58,0.3)" fontFamily="'Didact Gothic',sans-serif" fontSize="10">No data yet</text>
                <text x="160" y="94" textAnchor="middle" fill="rgba(201,135,58,0.2)" fontFamily="'Didact Gothic',sans-serif" fontSize="9">Results populate after your first blood panel</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Packages */}
        <div id="packages">
          <div className={s.secHdr}>
            <div className={s.secTitle}>CHOOSE YOUR VITALITY PACKAGE</div>
            <div className={s.secLine} />
          </div>
          <div className={s.pkgGrid}>
            <div className={s.pkgTile}>
              <div className={s.pkgTag}>ENTRY</div>
              <div className={s.pkgName}>Vitality Start</div>
              <div className={s.pkgPrice}>&pound;129/mo</div>
              <div className={s.pkgDesc}>Entry TRT protocol. Testosterone cypionate, quarterly bloods, clinician messaging, injection guidance.</div>
              <Link href="/elevate" className={s.pkgCta}>SELECT &rarr;</Link>
            </div>
            <div className={`${s.pkgTile} ${s.pkgHighlight}`}>
              <div className={s.pkgTag}>RECOMMENDED</div>
              <div className={s.pkgName}>Vitality Core</div>
              <div className={s.pkgPrice}>&pound;199/mo</div>
              <div className={s.pkgDesc}>Full management. Protocol design, bi-monthly bloods, AI-assisted dosing, estrogen management, unlimited messaging.</div>
              <Link href="/elevate" className={s.pkgCta}>SELECT &rarr;</Link>
            </div>
            <div className={s.pkgTile}>
              <div className={s.pkgTag}>COMPREHENSIVE</div>
              <div className={s.pkgName}>Vitality Elite</div>
              <div className={s.pkgPrice}>&pound;349/mo</div>
              <div className={s.pkgDesc}>Comprehensive + concierge. Monthly bloods, peptide stacking, nutrition coaching, priority appointments, quarterly reviews.</div>
              <Link href="/elevate" className={s.pkgCta}>SELECT &rarr;</Link>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className={s.banner}>
          <div>
            <div className={s.bannerOver}>THE INNER CIRCLE</div>
            <div className={s.bannerTitle}>Members-only community, events and expert Q&amp;As</div>
            <div className={s.bannerSub}>Private forum &middot; monthly clinician AMAs &middot; quarterly retreats</div>
          </div>
          <Link href="/inner-circle" className={s.btnCopper}>ENTER &rarr;</Link>
        </div>
      </main>
    </div>
  );
}
