import Link from "next/link";
import dashStyles from "../../dashboard/dashboard.module.css";
import styles from "../inner-circle.module.css";

export default function ForumPage() {
  return (
    <div className={dashStyles.app}>
      <aside className={dashStyles.sidebar}>
        <div className={dashStyles.sbBrand}>
          <div className={dashStyles.sbLogo}>FOCUSTRT</div>
          <div className={dashStyles.sbTag}>MEN&apos;S OPTIMISATION</div>
        </div>
        <nav className={dashStyles.sbNav}>
          <Link href="/dashboard" className={dashStyles.sbItem}>DASHBOARD</Link>
          <div className={dashStyles.sbSection}>Inner Circle</div>
          <Link href="/inner-circle" className={dashStyles.sbItem}>THE INNER CIRCLE</Link>
        </nav>
        <div className={dashStyles.sbUser}>
          <div className={dashStyles.sbAvatar}>CJ</div>
          <div>
            <div className={dashStyles.sbName}>Craig J.</div>
            <div className={dashStyles.sbTier}>Platinum member</div>
          </div>
        </div>
      </aside>
      <main className={dashStyles.main}>
        <div className={styles.placeholder}>
          <p className={styles.eyebrow}>COMING SOON</p>
          <h1 className={styles.title}>Community Forum</h1>
          <p className={styles.placeholderBody}>
            Coming soon — private forum launching with first member cohort.
          </p>
        </div>
      </main>
    </div>
  );
}
