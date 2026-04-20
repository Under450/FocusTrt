import Link from "next/link";
import styles from "../home.module.css";

const DISCLAIMER =
  "FocusTRT provides educational information only and is not a substitute for medical advice. All TRT decisions should be made in consultation with a GMC-registered clinician.";

export default function AboutPage() {
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

      <section className={styles.section} style={{ paddingTop: "120px" }}>
        <p className={styles.sectionEyebrow}>About</p>
        <h1 className={styles.sectionTitle}>About FocusTRT</h1>
        <p className={styles.sectionBody}>
          FocusTRT is a UK-based platform dedicated to evidence-based testosterone
          replacement therapy education. We turn peer-reviewed research into
          accessible audio content, maintain a vetted clinic directory, and host
          a moderated members community — all to help men make informed decisions
          about their health.
        </p>
        <p className={styles.sectionBody} style={{ marginTop: "16px" }}>
          More content coming soon. We&apos;re building this in public and
          shipping fast.
        </p>
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
