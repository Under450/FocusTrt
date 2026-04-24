import Link from "next/link";
import Image from "next/image";
import styles from "./landing.module.css";

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* ─── Top nav ─── */}
      <nav className={styles.topNav}>
        <span className={styles.navWordmark}>ELEVATE</span>
        <Link href="/login" className={styles.navAdmin} aria-label="Admin sign in">
          Admin Login →
        </Link>
      </nav>

      {/* ─── Split halves ─── */}
      <div className={styles.split}>
        <Link href="/trt/login" className={`${styles.half} ${styles.trtHalf}`}>
          <p className={`${styles.halfEyebrow} ${styles.trtEyebrow}`}>FOR MEN</p>
          <h1 className={`${styles.halfTitle} ${styles.trtTitle}`}>TRT</h1>
          <p className={`${styles.halfCta} ${styles.trtCta}`}>ENTER →</p>
        </Link>

        {/* Centre logo bridging both halves */}
        <div className={styles.logoContainer}>
          <Image
            src="/brand/logo-male-cream.png"
            alt="ELEVATE brand mark"
            width={180}
            height={116}
            className={styles.logoMark}
            priority
          />
        </div>

        <Link href="/hrt/login" className={`${styles.half} ${styles.hrtHalf}`}>
          <p className={`${styles.halfEyebrow} ${styles.hrtEyebrow}`}>FOR WOMEN</p>
          <h1 className={`${styles.halfTitle} ${styles.hrtTitle}`}>HRT</h1>
          <p className={`${styles.halfCta} ${styles.hrtCta}`}>← ENTER</p>
        </Link>
      </div>

      {/* ─── Bottom strip ─── */}
      <div className={styles.bottomStrip}>
        <div className={styles.bottomWordmark}>ELEVATE</div>
        <div className={styles.bottomTagline}>OPTIMISE · RESTORE · REBALANCE</div>
      </div>
    </div>
  );
}
