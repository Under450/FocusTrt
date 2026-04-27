"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import s from "./elevate.module.css";

function cls(...c: (string | false | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

export default function ElevateLanding() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<"none" | "him" | "her">("none");
  const [wipe, setWipe] = useState<"him" | "her" | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  function enter(side: "him" | "her") {
    if (reduced) {
      router.push(side === "him" ? "/assessment?path=trt" : "/assessment?path=hrt");
      return;
    }
    setWipe(side);
    setTimeout(() => {
      router.push(side === "him" ? "/assessment?path=trt" : "/assessment?path=hrt");
    }, 600);
  }

  const stagger = (i: number) => ({
    initial: reduced ? {} : { opacity: 0, y: 16 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { type: "spring" as const, stiffness: 200, damping: 24, delay: 0.15 * i },
  });

  return (
    <div className={s.page}>
      {/* Rich gradient backdrop */}
      <div className={s.backdrop} />

      {/* Image overlays — fade in on hover */}
      <div className={cls(s.imageOverlay, s.imageHim, hover === "him" && s.imageOverlayVisible)} />
      <div className={cls(s.imageOverlay, s.imageHer, hover === "her" && s.imageOverlayVisible)} />

      {/* Grain */}
      <div className={s.grain} />

      {/* Admin */}
      <Link href="/login" className={s.admin}>Admin</Link>

      {/* Main content — left-aligned editorial */}
      <div className={s.content}>
        {/* Logo */}
        <motion.div {...stagger(0)}>
          <Image
            src="/brand/logo-navy.png"
            alt=""
            aria-hidden="true"
            width={72}
            height={77}
            className={s.logo}
            priority
          />
        </motion.div>

        {/* Headline */}
        <motion.h1 className={s.headline} {...stagger(1)}>
          ELEVATE<span className={s.headlineDot}>.</span>
        </motion.h1>

        {/* Subline */}
        <motion.p className={s.subline} {...stagger(2)}>
          Clinician-led hormone optimisation for men and women. Bloodwork-first.
          Protocol-driven. Fourteen UK clinics under one endocrinologist.
        </motion.p>

        {/* Rule */}
        <motion.hr className={s.rule} {...stagger(3)} />

        {/* Paths */}
        <motion.div className={s.paths} {...stagger(4)}>
          {/* HIM */}
          <button
            className={cls(s.pathBtn, hover === "him" && s.pathBtnHovered)}
            onMouseEnter={() => setHover("him")}
            onMouseLeave={() => setHover("none")}
            onClick={() => enter("him")}
            aria-label="Start testosterone assessment"
          >
            <div className={s.pathEyebrow}>For Him</div>
            <motion.div
              className={s.pathName}
              animate={{ scale: hover === "him" ? 1.04 : 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              TRT
            </motion.div>
            <span className={s.pathLine} />
            <AnimatePresence>
              {hover === "him" && (
                <motion.p
                  className={s.pathDesc}
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 22 }}
                >
                  Testosterone replacement therapy. Restore what time and stress have taken.
                </motion.p>
              )}
            </AnimatePresence>
          </button>

          {/* Separator */}
          <span className={s.pathSep}>/</span>

          {/* HER */}
          <button
            className={cls(s.pathBtn, hover === "her" && s.pathBtnHovered)}
            onMouseEnter={() => setHover("her")}
            onMouseLeave={() => setHover("none")}
            onClick={() => enter("her")}
            aria-label="Start hormone therapy assessment"
          >
            <div className={s.pathEyebrow}>For Her</div>
            <motion.div
              className={s.pathName}
              animate={{ scale: hover === "her" ? 1.04 : 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              HRT
            </motion.div>
            <span className={s.pathLine} />
            <AnimatePresence>
              {hover === "her" && (
                <motion.p
                  className={s.pathDesc}
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 22 }}
                >
                  Hormone therapy for perimenopause and beyond. Because you were never told this was treatable.
                </motion.p>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </div>

      {/* Bottom left — pillars */}
      <div className={s.pillars}>Optimise · Restore · Rebalance</div>

      {/* Bottom right — clinician */}
      <div className={s.clinician}>Dr Daniel Marsh · GMC Registered</div>

      {/* Transition wipe — circular reveal */}
      <AnimatePresence>
        {wipe && (
          <motion.div
            className={s.wipe}
            style={{ background: wipe === "him" ? "#141210" : "#ede6d8" }}
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(150% at 50% 50%)" }}
            transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
