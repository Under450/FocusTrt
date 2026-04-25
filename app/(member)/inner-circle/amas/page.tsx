import dashStyles from "../../dashboard/dashboard.module.css";
import styles from "../inner-circle.module.css";
import MemberSidebar from "../../_components/MemberSidebar";

export default function AmasPage() {
  return (
    <div className={dashStyles.app}>
      <MemberSidebar active="inner-circle" />
      <main className={dashStyles.main}>
        <div className={styles.placeholder}>
          <p className={styles.eyebrow}>COMING SOON</p>
          <h1 className={styles.title}>Clinician AMAs</h1>
          <p className={styles.placeholderBody}>
            Coming soon — clinician AMAs launching with first members.
          </p>
        </div>
      </main>
    </div>
  );
}
