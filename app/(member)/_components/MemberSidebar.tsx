import Link from "next/link";
import styles from "../dashboard/dashboard.module.css";

type ActivePage =
  | "dashboard"
  | "protocol"
  | "labs"
  | "messages"
  | "appointments"
  | "pharmacy"
  | "progress"
  | "inner-circle";

export default function MemberSidebar({ active }: { active: ActivePage }) {
  const item = (label: string, page: ActivePage, href: string) =>
    active === page ? (
      <Link href={href} className={styles.sbItemActive}>{label}</Link>
    ) : (
      <Link href={href} className={styles.sbItem}>{label}</Link>
    );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sbBrand}>
        <div className={styles.sbLogo}>FOCUSTRT</div>
        <div className={styles.sbTag}>MEN&apos;S OPTIMISATION</div>
      </div>
      <nav className={styles.sbNav}>
        {item("DASHBOARD", "dashboard", "/dashboard")}
        {item("MY PROTOCOL", "protocol", "/dashboard")}
        {item("LABS & BIOMARKERS", "labs", "/dashboard")}
        {item("MESSAGES", "messages", "/dashboard")}
        {item("APPOINTMENTS", "appointments", "/dashboard")}
        {item("PHARMACY", "pharmacy", "/dashboard")}
        {item("PROGRESS", "progress", "/dashboard")}
        {item("INNER CIRCLE", "inner-circle", "/inner-circle")}
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
  );
}
