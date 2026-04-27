"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
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

/* ─────────────────────────────────────────────────────────────────────
   CharReveal — staggered per-character spring reveal (Emil: 30-80ms
   stagger, spring physics for decorative motion)
   ───────────────────────────────────────────────────────────────────── */
function CharReveal({
  text,
  visible,
  className,
  delay = 0,
}: {
  text: string;
  visible: boolean;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{text}</span>;

  return (
    <span className={className} aria-label={text} role="text">
      {text.split("").map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          style={{ display: "inline-block", whiteSpace: ch === " " ? "pre" : undefined }}
          initial={{ opacity: 0, y: 6 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 24,
            delay: delay + i * 0.04,
          }}
        />
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   HalfPanel — one side of the split. Isolated client component
   per taste-skill rule: interactive leaf components must be isolated.
   Uses useMotionValue for cursor tracking (NOT useState — Emil rule).
   ───────────────────────────────────────────────────────────────────── */
function HalfPanel({
  side,
  hovered,
  onHover,
  onLeave,
  onClick,
  flex,
}: {
  side: "him" | "her";
  hovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  flex: number;
}) {
  const isNavy = side === "him";
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Cursor parallax via useMotionValue (taste-skill: NEVER useState for continuous anim)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 120, damping: 18 });
  const py = useSpring(rawY, { stiffness: 120, damping: 18 });

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 6);
      rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 4);
    },
    [rawX, rawY, reduced]
  );

  const handleLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    onLeave();
  }, [rawX, rawY, onLeave]);

  // Display font size — use CSS clamp, no window access during SSR
  const displaySize = "clamp(56px, 10vw, 120px)";

  // Spring config (Emil: type spring, duration 0.5, bounce 0.15 for UI)
  const uiSpring = { type: "spring" as const, stiffness: 140, damping: 20 };

  return (
    <motion.div
      ref={ref}
      className={cls(s.half, isNavy ? s.halfNavy : s.halfCream)}
      animate={{ flex }}
      transition={{ type: "spring", stiffness: 100, damping: 22 }}
      onMouseEnter={onHover}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={isNavy ? "Testosterone replacement therapy for men" : "Hormone replacement therapy for women"}
      onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}
    >
      <motion.div className={s.inner} style={{ x: px, y: py }}>
        {/* Logo */}
        <Image
          src={isNavy ? "/brand/logo-navy.png" : "/brand/logo-cream.png"}
          alt=""
          width={72}
          height={isNavy ? 77 : 53}
          className={s.logo}
          priority
          aria-hidden="true"
        />

        {/* Label — character reveal on mount */}
        <div className={s.label}>
          <CharReveal
            text={isNavy ? "FOR HIM" : "FOR HER"}
            visible={true}
            className={isNavy ? s.labelNavy : s.labelCream}
            delay={isNavy ? 0.2 : 0.35}
          />
        </div>

        {/* Display text — scale on hover via spring */}
        <motion.h1
          className={cls(s.display, isNavy ? s.displayNavy : s.displayCream)}
          style={{ fontSize: displaySize }}
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={uiSpring}
        >
          {isNavy ? "TRT" : "HRT"}
        </motion.h1>

        {/* Tagline — spring height reveal on hover (Emil: ease-out, never ease-in) */}
        <AnimatePresence>
          {hovered && (
            <motion.p
              className={cls(s.tagline, isNavy ? s.taglineNavy : s.taglineCream)}
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 20 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
            >
              {isNavy
                ? "Clinician-led testosterone replacement. Bloodwork-first. Protocol-driven."
                : "Hormone therapy for perimenopause and beyond. Symptom-matched. Monitored."}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Enter — spring reveal (Emil: stagger 30-80ms after tagline) */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className={cls(s.enter, isNavy ? s.enterNavy : s.enterCream)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.08 }}
            >
              Enter <span className={s.arrow}>→</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Main page
   ───────────────────────────────────────────────────────────────────── */
export default function ElevateLanding() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<"none" | "him" | "her">("none");
  const [wipe, setWipe] = useState<"him" | "her" | null>(null);
  const [mobile, setMobile] = useState(false);
  const [tapped, setTapped] = useState<"him" | "her" | null>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Seam position driven by hover
  const seamX = useMotionValue(50);
  const seamSpring = useSpring(seamX, { stiffness: 100, damping: 22 });
  const seamLeft = useTransform(seamSpring, (v) => `${v}%`);

  useEffect(() => {
    seamX.set(hovered === "him" ? 64 : hovered === "her" ? 36 : 50);
  }, [hovered, seamX]);

  function handleClick(side: "him" | "her") {
    if (mobile) {
      if (tapped === side) {
        doWipe(side);
      } else {
        setTapped(side);
        setHovered(side);
      }
      return;
    }
    doWipe(side);
  }

  function doWipe(side: "him" | "her") {
    if (reduced) {
      router.push(side === "him" ? "/assessment?path=trt" : "/assessment?path=hrt");
      return;
    }
    setWipe(side);
    // Navigate after wipe animation completes (Emil: exit fast, 200-500ms for modals/transitions)
    setTimeout(() => {
      router.push(side === "him" ? "/assessment?path=trt" : "/assessment?path=hrt");
    }, 600);
  }

  const himFlex = hovered === "him" ? 1.7 : hovered === "her" ? 0.5 : 1;
  const herFlex = hovered === "her" ? 1.7 : hovered === "him" ? 0.5 : 1;

  return (
    <div className={s.page}>
      {/* Top wordmark */}
      <motion.div
        className={s.mark}
        animate={{ opacity: hovered !== "none" ? 0 : 0.3 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        ELEVATE
      </motion.div>

      {/* Admin */}
      <Link href="/login" className={s.admin}>Admin</Link>

      {/* HIM */}
      <HalfPanel
        side="him"
        hovered={hovered === "him"}
        onHover={() => { if (!mobile) setHovered("him"); }}
        onLeave={() => { if (!mobile) setHovered("none"); }}
        onClick={() => handleClick("him")}
        flex={himFlex}
      />

      {/* Seam */}
      {!mobile && (
        <motion.div className={s.seam} style={{ left: seamLeft }} />
      )}

      {/* HER */}
      <HalfPanel
        side="her"
        hovered={hovered === "her"}
        onHover={() => { if (!mobile) setHovered("her"); }}
        onLeave={() => { if (!mobile) setHovered("none"); }}
        onClick={() => handleClick("her")}
        flex={herFlex}
      />

      {/* Bottom pillars */}
      <div className={s.pillars}>OPTIMISE · RESTORE · REBALANCE</div>

      {/* Transition wipe — clip-path animation (Emil: clip-path for powerful transitions) */}
      <AnimatePresence>
        {wipe && (
          <motion.div
            className={s.wipe}
            style={{ background: wipe === "him" ? "#0d1520" : "#f4ede2" }}
            initial={{
              clipPath: wipe === "him"
                ? "inset(0 100% 0 0)"
                : "inset(0 0 0 100%)",
            }}
            animate={{ clipPath: "inset(0 0 0 0)" }}
            transition={{
              duration: 0.5,
              ease: [0.77, 0, 0.175, 1], // Emil: strong ease-in-out for on-screen movement
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
