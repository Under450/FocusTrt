"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../dashboard/dashboard.module.css";

type ActivePage =
  | "dashboard"
  | "assessment"
  | "protocol"
  | "labs"
  | "appointments"
  | "injection-tracker"
  | "messages"
  | "inner-circle";

function Icon({ name }: { name: string }) {
  const s = "currentColor";
  switch (name) {
    case "grid": return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case "clipboard": return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>;
    case "clock": return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
    case "flask": return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.5"><path d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m14 0h2M3 15h2m14 0h2M7 7h10v10H7z"/></svg>;
    case "calendar": return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
    case "syringe": return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.5"><path d="M12 2L12 8M8 6l4-4 4 4M5 12l-2 8h18l-2-8"/></svg>;
    case "message": return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
    case "trt": return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>;
    case "weight": return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.5"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>;
    case "longevity": return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.5"><path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2"/><path d="M22 2L12 12"/></svg>;
    case "heart": return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>;
    default: return null;
  }
}

export default function MemberSidebar({ active }: { active: ActivePage }) {
  const router = useRouter();
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");

  useEffect(() => {
    setPatientName(localStorage.getItem("focus_patient_name") || "");
    setPatientEmail(localStorage.getItem("focus_patient_email") || "");
  }, []);

  function handleLogout() {
    localStorage.removeItem("focus_assessment");
    localStorage.removeItem("focus_patient_name");
    localStorage.removeItem("focus_patient_email");
    localStorage.removeItem("focus_package");
    router.push("/login");
  }

  const displayName = patientName?.split(" ")[0] || "Patient";
  const initials = patientName
    ? patientName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "P";

  const item = (label: string, icon: string, page: ActivePage, href: string) => (
    <Link
      href={href}
      className={active === page ? styles.sbItemActive : styles.sbItem}
    >
      <Icon name={icon} />
      {label}
    </Link>
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sbBrand}>
        <div className={styles.sbLogo}>REVIVE</div>
        <div className={styles.sbTag}>HORMONE OPTIMISATION</div>
      </div>
      <nav className={styles.sbNav}>
        <div className={styles.sbSection}>Patient</div>
        {item("Dashboard", "grid", "dashboard", "/dashboard")}
        {item("My Assessment", "clipboard", "assessment", "/assessment-results")}
        {item("My Protocol", "clock", "protocol", "/dashboard")}
        {item("Labs & Biomarkers", "flask", "labs", "/dashboard")}
        {item("Appointments", "calendar", "appointments", "/dashboard")}
        {item("Injection Tracker", "syringe", "injection-tracker", "/dashboard")}
        {item("Messages", "message", "messages", "/dashboard")}

        <div className={styles.sbSection}>Treatments</div>
        <button className={styles.sbTreat}><Icon name="trt" /> TRT / HRT</button>
        <button className={styles.sbTreat}><Icon name="weight" /> Weight Loss</button>
        <button className={styles.sbTreat}><Icon name="longevity" /> Longevity</button>
        <button className={styles.sbTreat}><Icon name="heart" /> Sexual Health</button>
      </nav>
      <div className={styles.sbUser}>
        <div className={styles.sbAvatar}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className={styles.sbName}>{displayName}</div>
          <div className={styles.sbTier}>PATIENT</div>
          {patientEmail && (
            <div className={styles.sbEmail}>{patientEmail}</div>
          )}
        </div>
      </div>
      <button className={styles.sbLogout} onClick={handleLogout}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
        Log out
      </button>
    </aside>
  );
}
