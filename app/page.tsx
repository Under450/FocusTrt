"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./landing.module.css";

export default function LandingPage() {
  const [scene, setScene] = useState<1 | 2>(1);
  const [hover, setHover] = useState<"none" | "trt" | "hrt">("none");

  useEffect(() => {
    // Respect reduced motion — skip Scene 1 entirely
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setScene(2);
      return;
    }

    // Scene 1 holds for ~4s, then dissolves into Scene 2
    const timer = setTimeout(() => setScene(2), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.page}>
      {/* ─── Persistent nav ─── */}
      <nav className={styles.topNav}>
        <span className={styles.navWordmark}>ELEVATE</span>
        <Link href="/login" className={styles.navAdmin} aria-label="Admin sign in">
          Admin Login →
        </Link>
      </nav>

      {/* ─── Scene 1: Hero arrival ─── */}
      <div className={`${styles.scene1} ${scene === 2 ? styles.scene1Hidden : ""}`}>
        <Image
          src="/brand/logo-navy.png"
          alt="ELEVATE brand mark"
          width={260}
          height={167}
          className={styles.heroLogo}
          priority
        />
        <div className={styles.heroWordmark}>ELEVATE</div>
        <div className={styles.heroTagline}>OPTIMISE · RESTORE · REBALANCE</div>
      </div>

      {/* ─── Scene 2: Split-screen chooser ─── */}
      <div className={styles.scene2}>
        <div className={styles.split}>
          <div
            className={`${styles.half} ${styles.trtHalf} ${hover === "trt" ? styles.expanded : ""} ${hover === "hrt" ? styles.collapsed : ""}`}
            onMouseEnter={() => setHover("trt")}
            onMouseLeave={() => setHover("none")}
          >
            <p className={`${styles.halfEyebrow} ${styles.trtEyebrow}`}>FOR MEN</p>
            <h2 className={`${styles.halfTitle} ${styles.trtTitle}`}>TRT</h2>
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
            <h2 className={`${styles.halfTitle} ${styles.hrtTitle}`}>HRT</h2>
            <Link href="/hrt/login" className={`${styles.enterBtn} ${styles.hrtEnter}`}>
              ← ENTER
            </Link>
          </div>
        </div>

        <div className={styles.bottomStrip}>
          <div className={styles.bottomWordmark}>ELEVATE</div>
          <div className={styles.bottomTagline}>OPTIMISE · RESTORE · REBALANCE</div>
        </div>
      </div>
    </div>
  );
}
