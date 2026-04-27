"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import s from "./elevate.module.css";

function cls(...c: (string | false | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

/* ── Character-by-character reveal ── */
function CharReveal({ text, show, delay = 0, className }: {
  text: string; show: boolean; delay?: number; className?: string;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: delay + i * 0.03,
          }}
          style={{ display: "inline-block", whiteSpace: ch === " " ? "pre" : undefined }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function ElevateLanding() {
  const router = useRouter();
  const [hovered, setHovered] = useState<"none" | "him" | "her">("none");
  const [transitioning, setTransitioning] = useState<"him" | "her" | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [tapped, setTapped] = useState<"him" | "her" | null>(null);

  // Cursor parallax
  const himX = useMotionValue(0);
  const himY = useMotionValue(0);
  const herX = useMotionValue(0);
  const herY = useMotionValue(0);
  const himSX = useSpring(himX, { stiffness: 150, damping: 20 });
  const himSY = useSpring(himY, { stiffness: 150, damping: 20 });
  const herSX = useSpring(herX, { stiffness: 150, damping: 20 });
  const herSY = useSpring(herY, { stiffness: 150, damping: 20 });

  const himRef = useRef<HTMLDivElement>(null);
  const herRef = useRef<HTMLDivElement>(null);

  // Check mobile on mount
  const splitRef = useRef<HTMLDivElement>(null);
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  // Lazy init mobile check
  if (typeof window !== "undefined" && splitRef.current === null) {
    // Will run on first render client-side
    setTimeout(checkMobile, 0);
  }

  function handleMouseMove(side: "him" | "her", e: React.MouseEvent) {
    const rect = (side === "him" ? himRef : herRef).current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 5;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 5;
    if (side === "him") { himX.set(x); himY.set(y); }
    else { herX.set(x); herY.set(y); }
  }

  function handleEnter(side: "him" | "her") {
    if (isMobile) {
      if (tapped === side) {
        // Second tap — navigate
        doTransition(side);
      } else {
        setTapped(side);
        setHovered(side);
      }
      return;
    }
    doTransition(side);
  }

  function doTransition(side: "him" | "her") {
    setTransitioning(side);
    setTimeout(() => {
      router.push(side === "him" ? "/assessment?path=trt" : "/assessment?path=hrt");
    }, 700);
  }

  // Flex proportions based on hover
  const himFlex = hovered === "him" ? 1.8 : hovered === "her" ? 0.6 : 1;
  const herFlex = hovered === "her" ? 1.8 : hovered === "him" ? 0.6 : 1;

  const spring = { type: "spring" as const, stiffness: 120, damping: 22 };

  return (
    <div className={s.page}>
      {/* Wordmark */}
      <div className={s.wordmark}>
        <span className={cls(s.wordmarkText, hovered !== "none" && s.wordmarkTextHidden)}>
          ELEVATE
        </span>
      </div>

      {/* Admin */}
      <Link href="/login" className={s.adminLink}>Admin</Link>

      {/* Split */}
      <div className={s.split} ref={splitRef}>

        {/* ─── HIM (navy) ─── */}
        <motion.div
          ref={himRef}
          className={cls(s.half, s.halfNavy, hovered === "him" && s.halfHovered)}
          animate={{ flex: himFlex }}
          transition={spring}
          onMouseEnter={() => { if (!isMobile) setHovered("him"); }}
          onMouseLeave={() => { if (!isMobile) { setHovered("none"); himX.set(0); himY.set(0); } }}
          onMouseMove={(e) => handleMouseMove("him", e)}
          onClick={() => handleEnter("him")}
        >
          <motion.div
            className={s.halfInner}
            style={{ x: himSX, y: himSY }}
          >
            <Image
              src="/brand/logo-navy.png"
              alt="ELEVATE"
              width={100}
              height={107}
              className={s.logo}
              priority
            />

            <div className={s.label}>
              <CharReveal text="FOR HIM" show={true} className={s.labelNavy} />
            </div>

            <motion.h1
              className={cls(s.title, s.titleNavy)}
              animate={{ scale: hovered === "him" ? 1.04 : 1 }}
              transition={spring}
            >
              TRT
            </motion.h1>

            <AnimatePresence>
              {hovered === "him" && (
                <motion.p
                  className={cls(s.tagline, s.taglineNavy)}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                  Testosterone replacement, led by endocrinologists. Not a wellness trend. Medicine.
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {hovered === "him" && (
                <motion.div
                  className={cls(s.enter, s.enterNavy)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.1 }}
                >
                  Enter <span className={s.enterArrow}>→</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* ─── HER (cream) ─── */}
        <motion.div
          ref={herRef}
          className={cls(s.half, s.halfCream, hovered === "her" && s.halfHovered)}
          animate={{ flex: herFlex }}
          transition={spring}
          onMouseEnter={() => { if (!isMobile) setHovered("her"); }}
          onMouseLeave={() => { if (!isMobile) { setHovered("none"); herX.set(0); herY.set(0); } }}
          onMouseMove={(e) => handleMouseMove("her", e)}
          onClick={() => handleEnter("her")}
        >
          <motion.div
            className={s.halfInner}
            style={{ x: herSX, y: herSY }}
          >
            <Image
              src="/brand/logo-cream.png"
              alt="ELEVATE"
              width={100}
              height={74}
              className={s.logo}
              priority
            />

            <div className={s.label}>
              <CharReveal text="FOR HER" show={true} className={s.labelCream} />
            </div>

            <motion.h1
              className={cls(s.title, s.titleCream)}
              animate={{ scale: hovered === "her" ? 1.04 : 1 }}
              transition={spring}
            >
              HRT
            </motion.h1>

            <AnimatePresence>
              {hovered === "her" && (
                <motion.p
                  className={cls(s.tagline, s.taglineCream)}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                  Hormone therapy for perimenopause and beyond. Symptom-matched. Clinician-monitored.
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {hovered === "her" && (
                <motion.div
                  className={cls(s.enter, s.enterCream)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.1 }}
                >
                  Enter <span className={s.enterArrow}>→</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          className={s.divider}
          animate={{
            left: hovered === "him" ? "64%" : hovered === "her" ? "36%" : "50%",
          }}
          transition={spring}
        />
      </div>

      {/* Bottom tagline */}
      <div className={s.bottomTag}>OPTIMISE · RESTORE · REBALANCE</div>

      {/* Transition overlay — sweeps to full screen before nav */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className={s.transitionOverlay}
            initial={{
              clipPath: transitioning === "him"
                ? "inset(0 50% 0 0)"
                : "inset(0 0 0 50%)",
            }}
            animate={{ clipPath: "inset(0 0 0 0)" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            style={{
              background: transitioning === "him" ? "#0d1520" : "#f4ede2",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
