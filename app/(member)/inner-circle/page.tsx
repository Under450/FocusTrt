import Link from "next/link";
import dashStyles from "../dashboard/dashboard.module.css";
import styles from "./inner-circle.module.css";

export default function InnerCirclePage() {
  return (
    <div className={dashStyles.app}>
      {/* ─── Sidebar ─── */}
      <aside className={dashStyles.sidebar}>
        <div className={dashStyles.sbBrand}>
          <div className={dashStyles.sbLogo}>FOCUSTRT</div>
          <div className={dashStyles.sbTag}>MEN&apos;S OPTIMISATION</div>
        </div>
        <nav className={dashStyles.sbNav}>
          <Link href="/dashboard" className={dashStyles.sbItem}>DASHBOARD</Link>
          <button className={dashStyles.sbItem}>MY PROTOCOL</button>
          <button className={dashStyles.sbItem}>LABS &amp; BIOMARKERS</button>
          <button className={dashStyles.sbItem}>MESSAGES</button>
          <button className={dashStyles.sbItem}>APPOINTMENTS</button>
          <button className={dashStyles.sbItem}>PHARMACY</button>
          <button className={dashStyles.sbItem}>PROGRESS</button>
          <div className={dashStyles.sbSection}>Inner Circle</div>
          <Link href="/inner-circle" className={dashStyles.sbItemActive}>THE INNER CIRCLE</Link>
          <div className={dashStyles.sbSection}>Treatments</div>
          <button className={dashStyles.sbTreat}>Testosterone</button>
          <button className={dashStyles.sbTreat}>Weight loss</button>
          <button className={dashStyles.sbTreat}>Sexual health</button>
          <button className={dashStyles.sbTreat}>Peptides</button>
          <button className={dashStyles.sbTreat}>Longevity</button>
          <button className={dashStyles.sbTreat}>Hair &amp; skin</button>
        </nav>
        <div className={dashStyles.sbUser}>
          <div className={dashStyles.sbAvatar}>CJ</div>
          <div>
            <div className={dashStyles.sbName}>Craig J.</div>
            <div className={dashStyles.sbTier}>Platinum member</div>
          </div>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <main className={dashStyles.main}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>THE INNER CIRCLE</p>
          <h1 className={styles.title}>Welcome to the Inner Circle, Craig</h1>
          <p className={styles.subtitle}>
            Members-only research podcasts, clinician AMAs, and private community.
          </p>
        </div>

        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <div className={styles.cardIcon} aria-hidden="true">🎧</div>
            <h2 className={styles.cardTitle}>Research Podcasts</h2>
            <p className={styles.cardDesc}>
              Doctor-reviewed audio summaries of peer-reviewed TRT studies.
            </p>
            <Link href="/podcasts" className={styles.cardCta}>Browse Library →</Link>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon} aria-hidden="true">🩺</div>
            <h2 className={styles.cardTitle}>Clinician AMAs</h2>
            <p className={styles.cardDesc}>
              Monthly live Q&amp;As with Dr Daniel Marsh and guest specialists.
            </p>
            <Link href="/inner-circle/amas" className={styles.cardCta}>View Upcoming →</Link>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon} aria-hidden="true">💬</div>
            <h2 className={styles.cardTitle}>Community Forum</h2>
            <p className={styles.cardDesc}>
              Private discussions with other men on protocol. Share experiences, ask questions.
            </p>
            <Link href="/inner-circle/forum" className={styles.cardCta}>Enter Forum →</Link>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon} aria-hidden="true">📅</div>
            <h2 className={styles.cardTitle}>Events &amp; Retreats</h2>
            <p className={styles.cardDesc}>
              Quarterly retreats, member meetups, optimisation events.
            </p>
            <Link href="/inner-circle/events" className={styles.cardCta}>See Calendar →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
