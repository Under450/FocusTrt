"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import s from "./landing.module.css";

/* ── Scroll-reveal wrapper ── */
function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Counting number ── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
    >
      {inView ? (
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <CountAnimator target={target} />{suffix}
        </motion.span>
      ) : "0" + suffix}
    </motion.span>
  );
}

function CountAnimator({ target }: { target: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  if (typeof window !== "undefined" && nodeRef.current && !hasRun.current) {
    hasRun.current = true;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * target);
      if (nodeRef.current) nodeRef.current.textContent = String(start);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  return <span ref={nodeRef}>0</span>;
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.96]);

  return (
    <div className={s.page}>
      {/* ─── Nav ─── */}
      <nav className={s.nav}>
        <span className={s.navMark}>ELEVATE</span>
        <div className={s.navLinks}>
          <Link href="#pillars" className={s.navLink}>Method</Link>
          <Link href="#process" className={s.navLink}>Process</Link>
          <Link href="#choose" className={s.navLink}>Begin</Link>
          <Link href="/login" className={s.navLink}>Admin</Link>
          <Link href="/assessment" className={s.navCta}>Take Assessment</Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <motion.section ref={heroRef} className={s.hero} style={{ opacity: heroOpacity, scale: heroScale }}>
        <Reveal>
          <p className={s.heroEyebrow}>Hormone Optimisation · UK Clinics</p>
        </Reveal>
        <Reveal delay={0.15}>
          <h1 className={s.heroTitle}>
            Something changed.<br />
            Let&apos;s find out <span className={s.heroTitleEm}>what.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.3}>
          <p className={s.heroBody}>
            Clinician-led TRT and HRT programmes built on bloodwork,
            validated screening, and a protocol designed around you.
            Not a wellness trend. Medicine.
          </p>
        </Reveal>
        <Reveal delay={0.45}>
          <div className={s.heroCtas}>
            <Link href="/assessment" className={`${s.heroBtn} ${s.heroBtnPrimary}`}>
              Take the Assessment
            </Link>
            <Link href="#choose" className={`${s.heroBtn} ${s.heroBtnSecondary}`}>
              Learn More
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.6}>
          <div className={s.scrollLine} />
        </Reveal>
      </motion.section>

      {/* ─── Trust strip ─── */}
      <Reveal>
        <div className={s.trustStrip}>
          <span className={s.trustItem}><span className={s.trustDot} />GMC-Registered Clinicians</span>
          <span className={s.trustItem}><span className={s.trustDot} />15 UK Clinics</span>
          <span className={s.trustItem}><span className={s.trustDot} />Bloodwork-Led Protocols</span>
          <span className={s.trustItem}><span className={s.trustDot} />Free 3-Minute Assessment</span>
          <span className={s.trustItem}><span className={s.trustDot} />Validated Clinical Screening</span>
        </div>
      </Reveal>

      {/* ─── Pillars ─── */}
      <section className={s.section} id="pillars">
        <Reveal>
          <p className={`${s.sectionEyebrow} ${s.sectionEyebrowGold}`}>The ELEVATE Method</p>
          <h2 className={s.sectionTitle}>Three principles. One protocol.</h2>
          <p className={`${s.sectionBody} ${s.sectionBodyMuted}`}>
            Every ELEVATE programme is built on the same clinical foundation —
            whether you&apos;re a man exploring testosterone replacement or a woman
            navigating perimenopause.
          </p>
        </Reveal>
        <div className={s.pillars}>
          {[
            { num: "01", title: "Optimise", body: "We don't guess. Comprehensive bloodwork panels identify exactly what's low, what's imbalanced, and what's driving your symptoms. Every protocol starts with evidence." },
            { num: "02", title: "Restore", body: "Clinician-designed replacement therapy — testosterone, oestrogen, progesterone — titrated to your labs, your symptoms, and your body. Monitored. Adjusted. Never static." },
            { num: "03", title: "Rebalance", body: "Hormones don't exist in isolation. Sleep, cortisol, metabolic markers, mental health — we track the full picture and adjust the protocol as your body responds." },
          ].map((p, i) => (
            <Reveal key={p.num} delay={i * 0.12}>
              <div className={s.pillar}>
                <span className={s.pillarNum}>{p.num}</span>
                <h3 className={s.pillarTitle}>{p.title}</h3>
                <p className={s.pillarBody}>{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Stats ─── */}
      <div className={s.stats}>
        {[
          { val: 15, suffix: "", label: "UK clinics" },
          { val: 3, suffix: " min", label: "Assessment time" },
          { val: 4, suffix: "", label: "Validated screeners" },
          { val: 5, suffix: " days", label: "Results turnaround" },
        ].map((st, i) => (
          <Reveal key={st.label} delay={i * 0.1}>
            <div>
              <div className={s.statVal}><CountUp target={st.val} suffix={st.suffix} /></div>
              <div className={s.statLabel}>{st.label}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ─── Clinician ─── */}
      <section className={s.section}>
        <Reveal>
          <p className={`${s.sectionEyebrow} ${s.sectionEyebrowGold}`}>Your Clinician</p>
          <h2 className={s.sectionTitle}>Dr Daniel Marsh</h2>
          <p className={`${s.sectionBody} ${s.sectionBodyMuted}`}>
            GMC-registered endocrinologist. Over a decade specialising in hormone
            optimisation for men and women. Every ELEVATE protocol is designed or
            reviewed by Dr Marsh&apos;s clinical team before it reaches you.
          </p>
          <p className={`${s.sectionBody} ${s.sectionBodyMuted}`} style={{ marginTop: 12, fontStyle: "italic", opacity: 0.3, fontSize: 11 }}>
            PHOTO TBD — Dr Marsh clinical portrait
          </p>
        </Reveal>
      </section>

      {/* ─── Process ─── */}
      <section className={s.section} id="process">
        <Reveal>
          <p className={`${s.sectionEyebrow} ${s.sectionEyebrowGold}`}>How It Works</p>
          <h2 className={s.sectionTitle}>From symptoms to protocol.<br />Four steps.</h2>
        </Reveal>
        <div className={s.process}>
          {[
            { num: "01", title: "Take the assessment", body: "Three minutes. Validated clinical screening tools (ADAM, IIEF-5, PHQ-9, Greene Climacteric Scale) alongside your symptom profile. No account required." },
            { num: "02", title: "Get your bloodwork", body: "Home finger-prick kits or in-clinic draws at 15 UK locations. Results in five working days. We test what matters — not a generic wellness panel." },
            { num: "03", title: "Receive your protocol", body: "Dr Marsh's team designs a personalised programme: medication type, dosage, injection schedule, monitoring cadence. Everything explained, nothing assumed." },
            { num: "04", title: "Ongoing optimisation", body: "Regular blood checks. Protocol adjustments based on your response. Secure messaging with your clinician. Your dashboard tracks everything." },
          ].map((step, i) => (
            <Reveal key={step.num} delay={i * 0.08}>
              <div className={s.processStep}>
                <span className={s.processNum}>{step.num}</span>
                <div>
                  <h3 className={s.processTitle}>{step.title}</h3>
                  <p className={s.processBody}>{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Testimonial ─── */}
      <Reveal>
        <div className={s.testimonial}>
          <p className={s.quoteText}>
            &ldquo;I spent two years thinking I was just getting older. Fourteen weeks on
            protocol and I feel like I did at thirty. The difference is night and day.&rdquo;
          </p>
          <p className={s.quoteAttr}>Male, 46 · TRT programme · Week 14</p>
          <p className={s.quoteDisclaim}>Representative of typical patient experience. Individual results vary. PLACEHOLDER.</p>
        </div>
      </Reveal>

      {/* ─── Chooser ─── */}
      <section id="choose">
        <div className={s.chooser}>
          <motion.div
            className={`${s.chooserHalf} ${s.chooserNavy}`}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <Reveal>
              <p className={`${s.chooserLabel} ${s.chooserLabelGold}`}>For Men</p>
              <h2 className={`${s.chooserTitle} ${s.chooserTitleCream}`}>TRT</h2>
              <p className={`${s.chooserSub} ${s.chooserSubCream}`}>
                Testosterone replacement therapy. Clinician-led, bloodwork-first,
                protocol-driven.
              </p>
              <Link href="/assessment?path=trt" className={`${s.chooserBtn} ${s.chooserBtnGold}`}>
                Start Assessment →
              </Link>
            </Reveal>
          </motion.div>

          <motion.div
            className={`${s.chooserHalf} ${s.chooserCream}`}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <Reveal>
              <p className={`${s.chooserLabel} ${s.chooserLabelNavy}`}>For Women</p>
              <h2 className={`${s.chooserTitle} ${s.chooserTitleNavy}`}>HRT</h2>
              <p className={`${s.chooserSub} ${s.chooserSubNavy}`}>
                Hormone replacement therapy. Perimenopause, menopause, post-menopause.
                Symptom-matched, monitored, adjusted.
              </p>
              <Link href="/assessment?path=hrt" className={`${s.chooserBtn} ${s.chooserBtnNavy}`}>
                Start Assessment →
              </Link>
            </Reveal>
          </motion.div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className={s.section} style={{ textAlign: "center" }}>
        <Reveal>
          <p className={`${s.sectionEyebrow} ${s.sectionEyebrowGold}`}>Ready?</p>
          <h2 className={s.sectionTitle}>Three minutes. Twelve questions.<br />One honest answer.</h2>
          <p className={`${s.sectionBody} ${s.sectionBodyMuted}`} style={{ margin: "0 auto 32px" }}>
            No account. No payment. No commitment. Just a clinically validated
            assessment that tells you whether hormone optimisation is worth exploring.
          </p>
          <Link href="/assessment" className={`${s.heroBtn} ${s.heroBtnPrimary}`}>
            Take the Assessment
          </Link>
        </Reveal>
      </section>

      {/* ─── Footer ─── */}
      <footer className={s.footer}>
        <span className={s.footerMark}>ELEVATE</span>
        <div className={s.footerLinks}>
          <Link href="/login" className={s.footerLink}>Admin</Link>
          <Link href="/assessment" className={s.footerLink}>Assessment</Link>
        </div>
        <p className={s.footerCopy}>
          © {new Date().getFullYear()} ELEVATE. All rights reserved. ELEVATE provides clinical hormone
          optimisation under GMC-registered medical supervision. Not a substitute for emergency medical advice.
        </p>
      </footer>
    </div>
  );
}
