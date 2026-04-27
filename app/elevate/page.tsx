"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import s from "./elevate.module.css";

function cls(...c: (string | false | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

/* ── Character-by-character stagger reveal (Emil: 30-80ms stagger) ── */
function CharReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{text}</>;
  return (
    <span aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={`${i}-${ch}`}
          style={{ display: "inline-block", whiteSpace: ch === " " ? "pre" : undefined }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 22,
            delay: delay + i * 0.045,
          }}
        />
      ))}
    </span>
  );
}

export default function ElevateLanding() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<"none" | "him" | "her">("none");
  const [wipe, setWipe] = useState<"him" | "her" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isHer = hover === "her";
  const isHim = hover === "him";

  function enter(side: "him" | "her") {
    if (reduced) {
      router.push(side === "him" ? "/assessment?path=trt" : "/assessment?path=hrt");
      return;
    }
    setWipe(side);
    setTimeout(() => {
      router.push(side === "him" ? "/assessment?path=trt" : "/assessment?path=hrt");
    }, 550);
  }

  return (
    <div className={cls(
      s.page,
      isHer ? s.pageHer : s.pageDefault,
    )}>
      {/* Admin */}
      <Link
        href="/login"
        className={cls(s.admin, isHer ? s.adminHer : s.adminDefault)}
      >
        Admin
      </Link>

      {/* Main content — centred, minimal */}
      <div className={s.content}>
        {/* Logo */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, scale: 0.96 }}
          animate={mounted ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.1 }}
        >
          <Image
            src={isHer ? "/brand/logo-cream.png" : "/brand/logo-navy.png"}
            alt=""
            aria-hidden="true"
            width={120}
            height={isHer ? 88 : 128}
            className={s.logo}
            priority
          />
        </motion.div>

        {/* ELEVATE wordmark */}
        <h1 className={cls(s.wordmark, isHer ? s.wordmarkHer : s.wordmarkDefault)}>
          {mounted ? <CharReveal text="ELEVATE" delay={0.3} /> : "ELEVATE"}
        </h1>

        {/* Tagline */}
        <motion.p
          className={cls(s.tagline, isHer ? s.taglineHer : s.taglineDefault)}
          initial={reduced ? {} : { opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.9, ease: [0.23, 1, 0.32, 1] }}
        >
          OPTIMISE · RESTORE · REBALANCE
        </motion.p>

        {/* Two paths */}
        <motion.div
          className={s.paths}
          initial={reduced ? {} : { opacity: 0, y: 12 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 180, damping: 22, delay: 1.2 }}
        >
          {/* FOR HIM */}
          <button
            className={cls(s.path, isHer ? s.pathHer : s.pathDefault)}
            onMouseEnter={() => setHover("him")}
            onMouseLeave={() => setHover("none")}
            onClick={() => enter("him")}
            aria-label="Start TRT assessment for men"
          >
            <span className={cls(
              s.pathLabel,
              isHim ? s.pathLabelHimHover : isHer ? s.pathLabelHer : s.pathLabelDefault,
            )}>
              For Him
            </span>
            <motion.span
              className={cls(s.pathTitle, isHer ? s.pathTitleHer : s.pathTitleDefault)}
              animate={{ scale: isHim ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              TRT
            </motion.span>
            <AnimatePresence>
              {isHim && (
                <motion.span
                  className={cls(s.pathSub, s.pathSubDefault)}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 24 }}
                >
                  Testosterone replacement.<br />Clinician-led. Bloodwork-first.
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Dot separator */}
          <div className={cls(s.dot, isHer ? s.dotHer : s.dotDefault)} />

          {/* FOR HER */}
          <button
            className={cls(s.path, isHer ? s.pathHer : s.pathDefault)}
            onMouseEnter={() => setHover("her")}
            onMouseLeave={() => setHover("none")}
            onClick={() => enter("her")}
            aria-label="Start HRT assessment for women"
          >
            <span className={cls(
              s.pathLabel,
              isHer && hover === "her" ? s.pathLabelHerHover : isHer ? s.pathLabelHer : s.pathLabelDefault,
            )}>
              For Her
            </span>
            <motion.span
              className={cls(s.pathTitle, isHer ? s.pathTitleHer : s.pathTitleDefault)}
              animate={{ scale: hover === "her" ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              HRT
            </motion.span>
            <AnimatePresence>
              {hover === "her" && (
                <motion.span
                  className={cls(s.pathSub, s.pathSubHer)}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 24 }}
                >
                  Hormone therapy for perimenopause.<br />Symptom-matched. Monitored.
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </div>

      {/* Bottom credit */}
      <div className={cls(s.credit, isHer ? s.creditHer : s.creditDefault)}>
        Dr Daniel Marsh · GMC-Registered · 15 UK Clinics
      </div>

      {/* Transition wipe — Emil: clip-path inset for page transitions */}
      <AnimatePresence>
        {wipe && (
          <motion.div
            className={s.wipe}
            style={{ background: wipe === "him" ? "#0a1220" : "#f4ede2" }}
            initial={{
              clipPath: "circle(0% at 50% 50%)",
            }}
            animate={{
              clipPath: "circle(150% at 50% 50%)",
            }}
            transition={{
              duration: 0.5,
              ease: [0.77, 0, 0.175, 1],
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
