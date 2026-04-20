import Link from "next/link";
import styles from "../home.module.css";

const DISCLAIMER =
  "FocusTRT provides educational information only and is not a substitute for medical advice. All TRT decisions should be made in consultation with a GMC-registered clinician.";

export default function PodcastsPage() {
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
        <p className={styles.sectionEyebrow}>Podcasts</p>
        <h1 className={styles.sectionTitle}>Research Podcasts</h1>
        <div className={styles.cardGrid} style={{ marginTop: "36px" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.valueCard} style={{ textAlign: "center", padding: "40px 24px" }}>
              <div className={styles.podcastArt} style={{ width: "80px", height: "80px", fontSize: "22px", margin: "0 auto 16px" }} aria-hidden="true">FT</div>
              <p className={styles.podcastTag}>Coming Soon</p>
              <h3 className={styles.valueTitle} style={{ marginTop: "8px" }}>Episode {i}</h3>
              <p className={styles.valueDesc}>Launching soon — research-backed audio summaries.</p>
            </div>
          ))}
        </div>
        <p className={styles.sectionBody} style={{ margin: "40px auto 0", textAlign: "center" }}>
          Podcasts launching soon. Each episode is generated from peer-reviewed
          studies and reviewed by qualified clinicians before publication.
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
