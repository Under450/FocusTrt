import Link from "next/link";
import styles from "./home.module.css";

const DISCLAIMER =
  "FocusTRT provides educational information only and is not a substitute for medical advice. All TRT decisions should be made in consultation with a GMC-registered clinician.";

export default function Home() {
  return (
    <div className={styles.pageShell}>
      {/* ─── Nav ─── */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>
          FOCUSTRT
        </Link>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/about" className={styles.navLink}>
              About
            </Link>
          </li>
          <li>
            <Link href="/podcasts" className={styles.navLink}>
              Podcasts
            </Link>
          </li>
          <li>
            <Link href="/clinics" className={styles.navLink}>
              Clinics
            </Link>
          </li>
        </ul>
        <div className={styles.navCtas}>
          <Link href="/login" className={styles.navSignIn}>
            Member Sign In
          </Link>
          <Link href="/login" className={styles.navAdmin}>
            Admin
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>Men&apos;s Optimisation</p>
        <h1 className={styles.heroTitle}>FOCUSTRT</h1>
        <p className={styles.heroSub}>
          Evidence-based TRT education, curated research podcasts, and a
          nationwide clinic directory — built for men who want to understand
          their options before making a decision.
        </p>
        <div className={styles.heroCtas}>
          <Link href="/podcasts" className="btn-copper">
            Listen to Podcasts
          </Link>
          <Link href="/clinics" className="btn-outline">
            Find a Clinic
          </Link>
        </div>
      </section>

      {/* ─── What is TRT ─── */}
      <section className={`${styles.section} ${styles.whatTrt}`}>
        <p className={styles.sectionEyebrow}>Understanding TRT</p>
        <h2 className={styles.sectionTitle}>What is Testosterone Replacement Therapy?</h2>
        <p className={styles.sectionBody}>
          Testosterone Replacement Therapy (TRT) is a medically supervised
          treatment for men with clinically low testosterone. Symptoms can
          include chronic fatigue, low mood, reduced muscle mass, poor
          concentration, and diminished libido. TRT aims to restore
          testosterone to optimal levels under the guidance of a qualified
          clinician, improving quality of life when lifestyle changes alone
          aren&apos;t enough.
        </p>
      </section>

      {/* ─── Why FocusTRT ─── */}
      <section className={`${styles.section} ${styles.whySection}`}>
        <p className={styles.sectionEyebrow}>Why FocusTRT</p>
        <h2 className={styles.sectionTitle}>Built Different</h2>
        <div className={styles.cardGrid}>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon} aria-hidden="true">📄</div>
            <h3 className={styles.valueTitle}>Research-First</h3>
            <p className={styles.valueDesc}>
              Every podcast episode is generated from peer-reviewed studies.
              No bro-science, no sponsored opinions — just the evidence.
            </p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon} aria-hidden="true">🎧</div>
            <h3 className={styles.valueTitle}>Audio Summaries</h3>
            <p className={styles.valueDesc}>
              Complex research distilled into clear, listenable episodes.
              Stay informed on your commute, at the gym, or before a
              clinic appointment.
            </p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon} aria-hidden="true">🏥</div>
            <h3 className={styles.valueTitle}>UK Clinic Directory</h3>
            <p className={styles.valueDesc}>
              Vetted TRT clinics across the UK. Find a GMC-registered provider
              near you with transparent pricing and real patient reviews.
            </p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon} aria-hidden="true">💬</div>
            <h3 className={styles.valueTitle}>Members Forum</h3>
            <p className={styles.valueDesc}>
              Connect with other men on the same journey. Share experiences,
              ask questions, and get support in a moderated private community.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Featured Podcast ─── */}
      <section className={`${styles.section} ${styles.podcastSection}`}>
        <p className={styles.sectionEyebrow}>Latest Episode</p>
        <h2 className={styles.sectionTitle}>Featured Podcast</h2>
        <div className={styles.podcastCard}>
          <div className={styles.podcastArt} aria-hidden="true">FT</div>
          <div className={styles.podcastMeta}>
            <p className={styles.podcastTag}>Coming Soon</p>
            <h3 className={styles.podcastTitle}>
              Podcast Episodes Launching Soon
            </h3>
            <p className={styles.podcastDesc}>
              Our first research-backed episodes are in production. Sign up to
              be notified when they go live.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Find a Clinic CTA ─── */}
      <section className={`${styles.section} ${styles.clinicCta}`}>
        <p className={styles.sectionEyebrow}>Get Started</p>
        <h2 className={styles.sectionTitle}>Find a Clinic Near You</h2>
        <p className={styles.sectionBody}>
          We&apos;re building a directory of vetted, GMC-registered TRT clinics
          across the UK. Browse locations, compare pricing, and book your
          first consultation with confidence.
        </p>
        <Link href="/clinics" className="btn-copper">
          View Clinics
        </Link>
      </section>

      {/* ─── Footer ─── */}
      <footer className={styles.footer}>
        <p className={styles.disclaimer}>{DISCLAIMER}</p>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} FocusTRT. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
