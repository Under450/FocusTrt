import Link from "next/link";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.app}>
      {/* ─── Sidebar ─── */}
      <aside className={styles.sidebar}>
        <div className={styles.sbBrand}>
          <div className={styles.sbLogo}>FOCUSTRT</div>
          <div className={styles.sbTag}>MEN&apos;S OPTIMISATION</div>
        </div>
        <nav className={styles.sbNav}>
          <button className={styles.sbItemActive}>DASHBOARD</button>
          <button className={styles.sbItem}>MY PROTOCOL</button>
          <button className={styles.sbItem}>LABS &amp; BIOMARKERS</button>
          <button className={styles.sbItem}>MESSAGES</button>
          <button className={styles.sbItem}>APPOINTMENTS</button>
          <button className={styles.sbItem}>PHARMACY</button>
          <button className={styles.sbItem}>PROGRESS</button>
          <div className={styles.sbSection}>Treatments</div>
          <button className={styles.sbTreat}>Testosterone</button>
          <button className={styles.sbTreat}>Weight loss</button>
          <button className={styles.sbTreat}>Sexual health</button>
          <button className={styles.sbTreat}>Peptides</button>
          <button className={styles.sbTreat}>Longevity</button>
          <button className={styles.sbTreat}>Hair &amp; skin</button>
        </nav>
        <div className={styles.sbUser}>
          <div className={styles.sbAvatar}>CJ</div>
          <div>
            <div className={styles.sbName}>Craig J.</div>
            <div className={styles.sbTier}>Platinum member</div>
          </div>
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.hdr}>
          <div>
            <div className={styles.hdrGreeting}>Good afternoon, Craig</div>
            <div className={styles.hdrSub}>WEEK 14 · PROTOCOL ON TRACK</div>
          </div>
          <button className={styles.btnCopper}>BOOK CONSULTATION</button>
        </div>
        <div className={styles.divider} />

        {/* Injection + Clinician */}
        <div className={styles.row2}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Next injection</div>
            <div className={styles.injTop}>
              <span className={styles.injTag}>CYPIONATE · 100MG</span>
            </div>
            <div className={styles.injBody}>
              <div className={styles.injCircle}>
                <span className={styles.injDay}>Mon</span>
                <span className={styles.injSub}>IN 3 DAYS</span>
              </div>
              <div className={styles.injDetails}>
                <div className={styles.injRow}>
                  <span className={styles.injLabel}>SITE</span>
                  <span className={styles.injVal}>Left quad</span>
                </div>
                <div className={styles.injRow}>
                  <span className={styles.injLabel}>FREQUENCY</span>
                  <span className={styles.injVal}>Twice weekly</span>
                </div>
                <div className={styles.injRow}>
                  <span className={styles.injLabel}>VIAL</span>
                  <span className={styles.injVal}>14 doses left</span>
                </div>
              </div>
            </div>
            <button className={styles.btnCopperSm}>LOG INJECTION</button>
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

        {/* KPIs */}
        <div className={styles.kpiRow}>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>TOTAL T</div>
            <div className={styles.kpiVal}>782</div>
            <div className={styles.kpiNote}>▲ 34%</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>FREE T</div>
            <div className={styles.kpiVal}>18.2</div>
            <div className={styles.kpiNote}>Optimal</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>ESTRADIOL</div>
            <div className={styles.kpiVal}>28</div>
            <div className={styles.kpiNote}>Balanced</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>HAEMATOCRIT</div>
            <div className={styles.kpiVal}>48.1</div>
            <div className={styles.kpiNote}>In range</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>SHBG</div>
            <div className={styles.kpiVal}>32</div>
            <div className={styles.kpiNote}>Healthy</div>
          </div>
        </div>

        {/* Treatments */}
        <div className={styles.secHdr}>
          <div className={styles.secTitle}>Explore treatments</div>
          <span className={styles.treatCta}>VIEW ALL →</span>
        </div>
        <div className={styles.treatGrid}>
          <div className={`${styles.treatTile} ${styles.treatTileActive}`}>
            <div className={styles.treatTag}>ACTIVE · CORE</div>
            <div className={styles.treatName}>Testosterone</div>
            <div className={styles.treatDesc}>
              Cypionate, enanthate, cream or pellets. Clinician-led protocols built around your labs.
            </div>
            <span className={styles.treatCta}>ON PROTOCOL →</span>
          </div>
          <div className={styles.treatTile}>
            <div className={styles.treatTag}>AVAILABLE</div>
            <div className={styles.treatName}>Weight loss</div>
            <div className={styles.treatDesc}>
              Semaglutide and tirzepatide. Medically supervised, titrated to your metabolism.
            </div>
            <span className={styles.treatCta}>TAKE ASSESSMENT →</span>
          </div>
          <div className={styles.treatTile}>
            <div className={styles.treatTag}>AVAILABLE</div>
            <div className={styles.treatName}>Sexual health</div>
            <div className={styles.treatDesc}>
              ED treatment, PT-141, Trimix and shockwave therapy. Discreet delivery.
            </div>
            <span className={styles.treatCta}>TAKE ASSESSMENT →</span>
          </div>
          <div className={styles.treatTile}>
            <div className={styles.treatTag}>AVAILABLE</div>
            <div className={styles.treatName}>Peptides</div>
            <div className={styles.treatDesc}>
              Sermorelin, ipamorelin, BPC-157. Recovery, sleep and growth hormone support.
            </div>
            <span className={styles.treatCta}>EXPLORE →</span>
          </div>
          <div className={styles.treatTile}>
            <div className={styles.treatTag}>AVAILABLE</div>
            <div className={styles.treatName}>Longevity</div>
            <div className={styles.treatDesc}>
              NAD+ infusions, glutathione, advanced biomarker panels and healthspan coaching.
            </div>
            <span className={styles.treatCta}>EXPLORE →</span>
          </div>
          <div className={styles.treatTile}>
            <div className={styles.treatTag}>AVAILABLE</div>
            <div className={styles.treatName}>Hair &amp; skin</div>
            <div className={styles.treatDesc}>
              Finasteride, minoxidil, topical treatments. Because how you look matters too.
            </div>
            <span className={styles.treatCta}>EXPLORE →</span>
          </div>
        </div>

        {/* Daily check-in + Chart */}
        <div className={styles.row2eq}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Daily check-in</div>
            <div className={styles.scoreGrid}>
              <div className={styles.score}>
                <div className={styles.scoreLabel}>ENERGY</div>
                <div className={styles.scoreVal}>8</div>
              </div>
              <div className={styles.score}>
                <div className={styles.scoreLabel}>MOOD</div>
                <div className={styles.scoreVal}>9</div>
              </div>
              <div className={styles.score}>
                <div className={styles.scoreLabel}>LIBIDO</div>
                <div className={styles.scoreVal}>8</div>
              </div>
              <div className={styles.score}>
                <div className={styles.scoreLabel}>SLEEP</div>
                <div className={styles.scoreVal}>7</div>
              </div>
            </div>
            <button className={styles.btnOutline}>UPDATE TODAY</button>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Testosterone · 6 months</div>
            <div className={styles.chartWrap}>
              <svg viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="20" x2="320" y2="20" stroke="#b87333" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
                <line x1="0" y1="100" x2="320" y2="100" stroke="#b87333" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
                <text x="16" y="116" fill="#bd9468" fontFamily="Didact Gothic,sans-serif" fontSize="9" opacity="0.5">Nov</text>
                <text x="75" y="116" fill="#bd9468" fontFamily="Didact Gothic,sans-serif" fontSize="9" opacity="0.5">Dec</text>
                <text x="135" y="116" fill="#bd9468" fontFamily="Didact Gothic,sans-serif" fontSize="9" opacity="0.5">Jan</text>
                <text x="195" y="116" fill="#bd9468" fontFamily="Didact Gothic,sans-serif" fontSize="9" opacity="0.5">Feb</text>
                <text x="250" y="116" fill="#bd9468" fontFamily="Didact Gothic,sans-serif" fontSize="9" opacity="0.5">Mar</text>
                <text x="300" y="116" fill="#bd9468" fontFamily="Didact Gothic,sans-serif" fontSize="9" opacity="0.5">Apr</text>
                <polyline points="16,92 64,85 112,68 160,52 208,38 256,30 304,24" stroke="#b87333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="16,92 64,85 112,68 160,52 208,38 256,30 304,24" stroke="#b87333" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.15" />
                <polygon points="16,92 64,85 112,68 160,52 208,38 256,30 304,24 304,100 16,100" fill="url(#chartFill)" />
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b87333" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#b87333" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <circle cx="304" cy="24" r="4" fill="#fbf3da" stroke="#b87333" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Programmes */}
        <div className={styles.card} style={{ marginBottom: "20px" }}>
          <div className={styles.cardTitle}>Your programmes</div>
          <div className={styles.progSub}>COACHING · NUTRITION · TRAINING</div>
          <div className={styles.progGrid}>
            <div className={`${styles.prog} ${styles.progActive}`}>
              <div className={styles.progName}>Strength foundations</div>
              <div className={styles.progDetail}>
                Week 6 of 12<br />4 sessions this week
              </div>
            </div>
            <div className={styles.prog}>
              <div className={styles.progName}>High-protein meal plan</div>
              <div className={styles.progDetail}>
                180g protein daily<br />Chef-curated
              </div>
            </div>
            <div className={styles.prog}>
              <div className={styles.progName}>Sleep &amp; recovery</div>
              <div className={styles.progDetail}>Evening wind-down protocol</div>
            </div>
          </div>
        </div>

        {/* Pharmacy + Library */}
        <div className={styles.row2eq}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Pharmacy</div>
            <div className={styles.pharmItem}>
              <div>
                <div className={styles.pharmName}>Testosterone cypionate 200mg/mL</div>
                <div className={styles.pharmSub}>Next refill 12 May</div>
              </div>
              <span className={styles.pharmLink}>REORDER →</span>
            </div>
            <div className={styles.pharmItem}>
              <div>
                <div className={styles.pharmName}>Anastrozole 0.5mg</div>
                <div className={styles.pharmSub}>28 tablets remaining</div>
              </div>
              <span className={styles.pharmLink}>IN STOCK</span>
            </div>
            <div className={styles.pharmItem}>
              <div>
                <div className={styles.pharmName}>Syringes &amp; sharps bin</div>
                <div className={styles.pharmSub}>Ships with next order</div>
              </div>
              <span className={styles.pharmLink}>BUNDLED</span>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>The library</span>
              <span className={styles.libTag}>JOURNAL</span>
            </div>
            <div className={styles.libItem}>
              <div className={styles.libTitle}>
                The honest TRT timeline: what changes at week 2, 6 and 12
              </div>
              <div className={styles.libMeta}>Dr Marsh · 6 min read</div>
            </div>
            <div className={styles.libItem}>
              <div className={styles.libTitle}>
                Why haematocrit matters more than you think
              </div>
              <div className={styles.libMeta}>Clinical team · 4 min read</div>
            </div>
            <div className={styles.libItem}>
              <div className={styles.libTitle}>
                Stacking peptides with TRT: what&apos;s worth it
              </div>
              <div className={styles.libMeta}>Podcast · 32 min</div>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className={styles.banner}>
          <div>
            <div className={styles.bannerOver}>THE INNER CIRCLE</div>
            <div className={styles.bannerTitle}>
              Members-only community, events and expert Q&amp;As
            </div>
            <div className={styles.bannerSub}>
              Private forum · monthly clinician AMAs · quarterly retreats
            </div>
          </div>
          <Link href="/inner-circle" className={styles.btnCopper}>ENTER →</Link>
        </div>
      </main>
    </div>
  );
}
