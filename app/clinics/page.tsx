import Link from "next/link";
import styles from "../home.module.css";

const DISCLAIMER =
  "FocusTRT provides educational information only and is not a substitute for medical advice. All TRT decisions should be made in consultation with a GMC-registered clinician.";

export default function ClinicsPage() {
  return (
    <div className={styles.pageShell}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>FOCUSTRT</Link>
        <ul className={styles.navLinks}>
          <li><Link href="/about" className={styles.navLink}>About</Link></li>
          <li><Link href="/podcasts" className={styles.navLink}>Podcasts</Link></li>
          <li><Link href="/clinics" className={styles.navLink}>Clinics</Link></li>
        </ul>
        <Link href="/login" className={styles.navSignIn}>Sign In</Link>
      </nav>

      <section className={styles.section} style={{ paddingTop: "120px", textAlign: "center" }}>
        <p className={styles.sectionEyebrow}>Find a Clinic</p>
        <h1 className={styles.sectionTitle}>UK TRT Clinics</h1>
        <p className={styles.sectionBody} style={{ margin: "0 auto 40px" }}>
          We&apos;re building a directory of 15+ vetted, GMC-registered TRT
          clinics across the UK. Browse locations, compare pricing, and book
          your first consultation with confidence.
        </p>

        <div className={styles.valueCard} style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center", padding: "48px 32px" }}>
          <div className={styles.valueIcon} aria-hidden="true">🏥</div>
          <h2 className={styles.valueTitle}>Clinic Listings Coming Soon</h2>
          <p className={styles.valueDesc}>
            15 UK clinics verified and ready to list. Directory launching shortly.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p className={styles.disclaimer}>{DISCLAIMER}</p>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} FocusTRT. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
