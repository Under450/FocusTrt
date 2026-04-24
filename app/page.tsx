"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./landing.module.css";

export default function LandingPage() {
  const [hover, setHover] = useState<"none" | "trt" | "hrt">("none");

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
        <div
          className={`${styles.half} ${styles.trtHalf} ${hover === "trt" ? styles.expanded : ""} ${hover === "hrt" ? styles.collapsed : ""}`}
          onMouseEnter={() => setHover("trt")}
          onMouseLeave={() => setHover("none")}
        >
          <p className={`${styles.halfEyebrow} ${styles.trtEyebrow}`}>FOR MEN</p>
          <h1 className={`${styles.halfTitle} ${styles.trtTitle}`}>TRT</h1>
          <Link href="/trt/login" className={`${styles.enterBtn} ${styles.trtEnter}`}>
            ENTER →
          </Link>
        </div>

        <div
          className={`${styles.half} ${styles.hrtHalf} ${hover === "hrt" ? styles.expanded : ""} ${hover === "trt" ? styles.collapsed : ""}`}
          onMouseEnter={() => setHover("hrt")}
          onMouseLeave={() => setHover("none")}
        >
          <p className={`${styles.halfEyebrow} ${styles.hrtEyebrow}`}>FOR WOMEN</p>
          <h1 className={`${styles.halfTitle} ${styles.hrtTitle}`}>HRT</h1>
          <Link href="/hrt/login" className={`${styles.enterBtn} ${styles.hrtEnter}`}>
            ← ENTER
          </Link>
        </div>
      </div>

      {/* ─── Bottom strip ─── */}
      <div className={styles.bottomStrip}>
        <div className={styles.bottomWordmark}>ELEVATE</div>
        <div className={styles.bottomTagline}>OPTIMISE · RESTORE · REBALANCE</div>
      </div>
    </div>
  );
}
