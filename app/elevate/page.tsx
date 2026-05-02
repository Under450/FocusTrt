"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ── Reveal on scroll ── */
function R({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? {} : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Animated counter ── */
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const start = performance.now();
    const dur = 1600;
    const step = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ── Diagnostic pulse line SVG ── */
function PulseLine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 60" fill="none" className={className} aria-hidden="true">
      <motion.path
        d="M0 30 L80 30 L100 10 L120 50 L140 20 L160 40 L180 30 L400 30"
        stroke="rgba(184,149,106,0.2)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
      />
    </svg>
  );
}

/* ── Symptom marker component ── */
function SymptomMarker({ label, active }: { label: string; active: boolean }) {
  return (
    <motion.button
      className={`relative px-5 py-2.5 text-xs tracking-widest uppercase font-[family-name:var(--sans)] border transition-all duration-300 cursor-default ${
        active
          ? "border-[#b8956a]/40 text-[#ede6d8] bg-[#b8956a]/8"
          : "border-[#ede6d8]/8 text-[#ede6d8]/30 bg-transparent"
      }`}
      whileHover={{ borderColor: "rgba(184,149,106,0.4)", color: "#ede6d8" }}
    >
      {active && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#b8956a] shadow-[0_0_8px_rgba(184,149,106,0.6)]" />
      )}
      {label}
    </motion.button>
  );
}

export default function ElevateLanding() {
  const router = useRouter();
  const [activePathway, setActivePathway] = useState<"male" | "female">("male");
  const [wipe, setWipe] = useState(false);

  function startAssessment() {
    setWipe(true);
    setTimeout(() => router.push("/assessment"), 600);
  }

  const maleSymptoms = ["Low energy", "Reduced libido", "Poor sleep", "Low mood", "Strength loss", "Brain fog"];
  const femaleSymptoms = ["Fatigue", "Mood changes", "Sleep disruption", "Low libido", "Brain fog", "Perimenopause"];

  return (
    <div className="bg-[#0c0f14] text-[#ede6d8] font-[family-name:var(--sans)] overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════
          NAV
          ══════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 h-16 bg-[#0c0f14]/90 backdrop-blur-md border-b border-[#ede6d8]/[0.04]">
        <span className="font-[family-name:var(--cinzel)] text-sm tracking-[0.35em] font-medium text-[#ede6d8]/60">
          ELEVATE
        </span>
        <div className="flex items-center gap-8">
          <a href="#process" className="hidden md:block text-[10px] tracking-[0.2em] uppercase text-[#ede6d8]/25 hover:text-[#ede6d8]/60 transition-colors duration-200">
            Process
          </a>
          <a href="#pathways" className="hidden md:block text-[10px] tracking-[0.2em] uppercase text-[#ede6d8]/25 hover:text-[#ede6d8]/60 transition-colors duration-200">
            Pathways
          </a>
          <button
            onClick={startAssessment}
            className="text-[10px] tracking-[0.2em] uppercase text-[#b8956a] border border-[#b8956a]/30 px-5 py-2 hover:bg-[#b8956a] hover:text-[#0c0f14] transition-all duration-300 active:scale-[0.97]"
          >
            Start Assessment
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — IMMERSIVE OPENING
          Clinical diagnostic aesthetic, not a hero banner
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex flex-col justify-end pb-20 md:pb-28 px-8 md:px-16 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0f14] via-[#0e1118] to-[#0c0f14]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(rgba(184,149,106,0.3) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* Diagnostic pulse lines */}
        <div className="absolute top-1/3 left-0 right-0 opacity-40">
          <PulseLine className="w-full h-16" />
        </div>
        <div className="absolute top-1/2 left-0 right-0 opacity-20">
          <PulseLine className="w-full h-12" />
        </div>

        {/* Vertical gold accent line */}
        <motion.div
          className="absolute left-8 md:left-16 top-24 w-px bg-gradient-to-b from-[#b8956a]/40 via-[#b8956a]/10 to-transparent"
          initial={{ height: 0 }}
          animate={{ height: "40vh" }}
          transition={{ duration: 1.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-[900px]">
          <R>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#b8956a] shadow-[0_0_12px_rgba(184,149,106,0.5)]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#b8956a]/70 font-medium">
                Hormone Diagnostics · UK Clinical Practice
              </span>
            </div>
          </R>

          <R delay={0.1}>
            <h1 className="font-[family-name:var(--cinzel)] text-[clamp(2.8rem,7vw,5.5rem)] font-normal leading-[0.95] tracking-tight mb-6">
              Your hormones<br />
              tell a story<span className="text-[#b8956a]">.</span>
            </h1>
          </R>

          <R delay={0.2}>
            <p className="text-[15px] leading-relaxed text-[#ede6d8]/35 max-w-[440px] mb-10">
              Fatigue. Brain fog. Lost drive. These aren&apos;t character flaws — they&apos;re signals.
              Elevate reads them through bloodwork, validated screening, and clinical expertise.
            </p>
          </R>

          <R delay={0.3}>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={startAssessment}
                className="font-[family-name:var(--cinzel)] text-[11px] tracking-[0.2em] uppercase bg-[#b8956a] text-[#0c0f14] px-8 py-4 hover:bg-[#c9a97a] transition-colors duration-300 active:scale-[0.97]"
              >
                Start Your Assessment
              </button>
              <a
                href="#process"
                className="font-[family-name:var(--cinzel)] text-[11px] tracking-[0.2em] uppercase text-[#ede6d8]/40 border border-[#ede6d8]/10 px-8 py-4 hover:border-[#ede6d8]/25 hover:text-[#ede6d8]/70 transition-all duration-300"
              >
                View How It Works
              </a>
            </div>
          </R>
        </div>

        {/* Right side — diagnostic panel mockup */}
        <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 w-[320px]">
          <R delay={0.4}>
            <div className="border border-[#ede6d8]/[0.06] bg-[#0c0f14]/80 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#b8956a]/60">Hormone Profile</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#b8956a] animate-pulse" />
              </div>
              {[
                { label: "Total Testosterone", value: "12.4", unit: "nmol/L", bar: 35, status: "low" },
                { label: "Free Testosterone", value: "0.21", unit: "nmol/L", bar: 28, status: "low" },
                { label: "Oestradiol", value: "98", unit: "pmol/L", bar: 55, status: "normal" },
                { label: "SHBG", value: "52", unit: "nmol/L", bar: 70, status: "elevated" },
                { label: "Cortisol", value: "612", unit: "nmol/L", bar: 82, status: "elevated" },
              ].map((m, i) => (
                <div key={m.label} className="mb-4 last:mb-0">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-[10px] tracking-wider text-[#ede6d8]/25 uppercase">{m.label}</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-[family-name:var(--cinzel)] text-sm text-[#ede6d8]/70">{m.value}</span>
                      <span className="text-[9px] text-[#ede6d8]/20">{m.unit}</span>
                    </div>
                  </div>
                  <div className="h-px bg-[#ede6d8]/[0.06] relative">
                    <motion.div
                      className={`absolute left-0 top-0 h-full ${m.status === "low" ? "bg-[#b8956a]/60" : m.status === "elevated" ? "bg-[#6b8cae]/40" : "bg-[#ede6d8]/15"}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.bar}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: [0.23, 1, 0.32, 1] }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-5 pt-4 border-t border-[#ede6d8]/[0.04]">
                <span className="text-[9px] tracking-wider text-[#ede6d8]/15 uppercase">Sample profile · Illustrative only</span>
              </div>
            </div>
          </R>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — TRUST / CLINICAL REASSURANCE
          ══════════════════════════════════════════════════════════════ */}
      <section className="px-8 md:px-16 py-24 md:py-32 border-t border-[#ede6d8]/[0.04]">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-[1fr_1.2fr] gap-16 md:gap-24 items-start">
          <R>
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#b8956a]/50 block mb-4">Clinical Foundation</span>
              <h2 className="font-[family-name:var(--cinzel)] text-[clamp(1.6rem,3.5vw,2.4rem)] font-normal leading-tight mb-6">
                Measured<span className="text-[#b8956a]">.</span> Monitored<span className="text-[#b8956a]">.</span> Personalised<span className="text-[#b8956a]">.</span>
              </h2>
              <p className="text-sm leading-relaxed text-[#ede6d8]/30 max-w-[380px]">
                Hormone optimisation should never be guesswork. Every Elevate protocol begins with
                comprehensive blood testing, validated clinical screening, and a full symptom review
                by a GMC-registered endocrinologist.
              </p>
            </div>
          </R>
          <div className="grid grid-cols-2 gap-px bg-[#ede6d8]/[0.04]">
            {[
              { num: "15", label: "UK clinic locations", sub: "Nationwide coverage" },
              { num: "4", label: "Validated screeners", sub: "ADAM · IIEF-5 · PHQ-9 · Greene" },
              { num: "5", label: "Day turnaround", sub: "Blood results to protocol" },
              { num: "100%", label: "Clinician reviewed", sub: "No AI-only decisions" },
            ].map((s, i) => (
              <R key={s.label} delay={i * 0.08}>
                <div className="bg-[#0c0f14] p-6 md:p-8">
                  <div className="font-[family-name:var(--cinzel)] text-[clamp(1.8rem,3vw,2.4rem)] font-normal text-[#ede6d8]/80 mb-1">
                    {s.num.includes("%") ? s.num : <Counter value={parseInt(s.num)} />}
                  </div>
                  <div className="text-[10px] tracking-wider uppercase text-[#ede6d8]/30 mb-1">{s.label}</div>
                  <div className="text-[10px] text-[#b8956a]/40">{s.sub}</div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — SYMPTOM PATHWAYS
          ══════════════════════════════════════════════════════════════ */}
      <section id="pathways" className="px-8 md:px-16 py-24 md:py-32 border-t border-[#ede6d8]/[0.04] relative">
        <div className="max-w-[1200px] mx-auto">
          <R>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#b8956a]/50 block mb-4">Symptom Recognition</span>
            <h2 className="font-[family-name:var(--cinzel)] text-[clamp(1.6rem,3.5vw,2.4rem)] font-normal leading-tight mb-4">
              Two pathways<span className="text-[#b8956a]">.</span> One clinical standard<span className="text-[#b8956a]">.</span>
            </h2>
            <p className="text-sm text-[#ede6d8]/30 max-w-[440px] mb-12">
              Whether testosterone in men or oestrogen, progesterone, and thyroid balance in women —
              the diagnostic rigour is identical.
            </p>
          </R>

          {/* Pathway toggle */}
          <R delay={0.1}>
            <div className="flex gap-0 mb-12 border border-[#ede6d8]/[0.06] w-fit">
              {(["male", "female"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePathway(p)}
                  className={`px-8 py-3 text-[10px] tracking-[0.25em] uppercase transition-all duration-300 ${
                    activePathway === p
                      ? "bg-[#b8956a]/10 text-[#b8956a] border-b-2 border-[#b8956a]"
                      : "text-[#ede6d8]/25 hover:text-[#ede6d8]/50 border-b-2 border-transparent"
                  }`}
                >
                  {p === "male" ? "For Him · TRT" : "For Her · HRT"}
                </button>
              ))}
            </div>
          </R>

          {/* Symptom grid */}
          <R delay={0.15}>
            <div className="flex flex-wrap gap-3 mb-16">
              {(activePathway === "male" ? maleSymptoms : femaleSymptoms).map((sym, i) => (
                <SymptomMarker key={sym} label={sym} active={i < 4} />
              ))}
            </div>
          </R>

          {/* Clinical context */}
          <R delay={0.2}>
            <div className="grid md:grid-cols-3 gap-px bg-[#ede6d8]/[0.04]">
              {(activePathway === "male" ? [
                { title: "Testosterone decline", body: "After 30, testosterone drops roughly 1-2% per year. By 45, many men sit in the clinical grey zone — technically 'normal' by NHS ranges, functionally suboptimal." },
                { title: "Interconnected systems", body: "Low testosterone affects sleep, which raises cortisol, which further suppresses testosterone. Breaking this cycle requires measurement, not guesswork." },
                { title: "Clinical screening", body: "The ADAM and IIEF-5 questionnaires identify androgen deficiency patterns. PHQ-9 screens for co-occurring depression that may need separate management." },
              ] : [
                { title: "Hormonal transition", body: "Perimenopause can begin years before menopause. Oestrogen, progesterone, and testosterone fluctuations drive symptoms that are often dismissed or misdiagnosed." },
                { title: "Beyond hot flushes", body: "Brain fog, joint pain, anxiety, sleep disruption, loss of confidence — these are hormonal signals, not personality changes. The Greene Climacteric Scale maps them clinically." },
                { title: "Individualised approach", body: "HRT isn't one-size-fits-all. Body-identical hormones, dosing, delivery method, and monitoring cadence are all personalised to your blood results and symptom profile." },
              ]).map((card, i) => (
                <div key={card.title} className="bg-[#0c0f14] p-6 md:p-8">
                  <div className="w-8 h-px bg-[#b8956a]/30 mb-5" />
                  <h3 className="font-[family-name:var(--cinzel)] text-base font-normal mb-3 text-[#ede6d8]/80">{card.title}</h3>
                  <p className="text-xs leading-relaxed text-[#ede6d8]/25">{card.body}</p>
                </div>
              ))}
            </div>
          </R>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4 — PROCESS
          ══════════════════════════════════════════════════════════════ */}
      <section id="process" className="px-8 md:px-16 py-24 md:py-32 border-t border-[#ede6d8]/[0.04]">
        <div className="max-w-[1200px] mx-auto">
          <R>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#b8956a]/50 block mb-4">The Protocol</span>
            <h2 className="font-[family-name:var(--cinzel)] text-[clamp(1.6rem,3.5vw,2.4rem)] font-normal leading-tight mb-16">
              Five stages<span className="text-[#b8956a]">.</span> No shortcuts<span className="text-[#b8956a]">.</span>
            </h2>
          </R>

          <div className="relative">
            {/* Vertical connector */}
            <div className="absolute left-[19px] md:left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-[#b8956a]/20 via-[#b8956a]/10 to-transparent" />

            {[
              { num: "i", title: "Clinical enquiry", body: "A validated assessment covering symptoms, medical history, lifestyle, and goals. Three minutes. No account required. Includes ADAM, IIEF-5, PHQ-9, or Greene screening depending on pathway.", time: "3 min" },
              { num: "ii", title: "Diagnostic bloodwork", body: "Comprehensive hormone panel — not a generic wellness screen. Home finger-prick kits or in-clinic venous draw at 15 UK locations. Results in five working days.", time: "5 days" },
              { num: "iii", title: "Clinician review", body: "Dr Daniel Marsh's team reviews your results alongside your symptom profile. Every protocol is designed by a GMC-registered endocrinologist. No algorithm-only decisions.", time: "48 hrs" },
              { num: "iv", title: "Personalised protocol", body: "Medication type, dosage, delivery method, and monitoring cadence — all explained clearly. Nothing assumed. Nothing prescribed without clinical justification.", time: "Ongoing" },
              { num: "v", title: "Continuous monitoring", body: "Regular blood checks. Protocol adjustments based on your response. Secure messaging with your clinician. Your dashboard tracks every metric over time.", time: "Quarterly" },
            ].map((step, i) => (
              <R key={step.num} delay={i * 0.06}>
                <div className="flex gap-6 md:gap-8 mb-12 last:mb-0 relative">
                  <div className="flex-shrink-0 w-10 md:w-12 h-10 md:h-12 border border-[#b8956a]/20 flex items-center justify-center bg-[#0c0f14] relative z-10">
                    <span className="font-[family-name:var(--cinzel)] text-sm text-[#b8956a]/60">{step.num}</span>
                  </div>
                  <div className="flex-1 pb-8 border-b border-[#ede6d8]/[0.03] last:border-0">
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="font-[family-name:var(--cinzel)] text-lg font-normal text-[#ede6d8]/80">{step.title}</h3>
                      <span className="hidden md:block text-[9px] tracking-wider uppercase text-[#b8956a]/30">{step.time}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#ede6d8]/25 max-w-[520px]">{step.body}</p>
                  </div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 5 — CLINICAL POSITIONING
          ══════════════════════════════════════════════════════════════ */}
      <section className="px-8 md:px-16 py-24 md:py-32 border-t border-[#ede6d8]/[0.04] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(184,149,106,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(184,149,106,0.3) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        <div className="relative max-w-[800px] mx-auto text-center">
          <R>
            <h2 className="font-[family-name:var(--cinzel)] text-[clamp(1.8rem,4vw,3rem)] font-normal leading-tight mb-8">
              Responsible hormone<br />optimisation is not optional<span className="text-[#b8956a]">.</span><br />It is the standard<span className="text-[#b8956a]">.</span>
            </h2>
          </R>
          <R delay={0.1}>
            <p className="text-sm leading-relaxed text-[#ede6d8]/25 max-w-[500px] mx-auto">
              Every protocol at Elevate is grounded in diagnostic testing, clinical symptom review,
              patient suitability assessment, and structured follow-up monitoring. There are no
              shortcuts. There are no assumptions. There is only evidence.
            </p>
          </R>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 6 — PACKAGES
          ══════════════════════════════════════════════════════════════ */}
      <section id="packages" className="px-8 md:px-16 py-24 md:py-32 border-t border-[#ede6d8]/[0.04]">
        <div className="max-w-[1200px] mx-auto">
          <R>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#b8956a]/50 block mb-4">Vitality Packages</span>
            <h2 className="font-[family-name:var(--cinzel)] text-[clamp(1.6rem,3.5vw,2.4rem)] font-normal leading-tight mb-4">
              Choose your protocol<span className="text-[#b8956a]">.</span>
            </h2>
            <p className="text-sm text-[#ede6d8]/25 max-w-[440px] mb-12">
              Three tiers. One clinical standard. Every package includes GMC-registered clinician oversight,
              ongoing monitoring, and direct messaging with your care team.
            </p>
          </R>

          <div className="grid md:grid-cols-3 gap-px bg-[#ede6d8]/[0.04]">
            {[
              { tag: "ENTRY", name: "Vitality Start", price: "129", desc: "Entry TRT protocol. Testosterone cypionate, quarterly bloods, clinician messaging, injection guidance.", key: "vitality_start" },
              { tag: "RECOMMENDED", name: "Vitality Core", price: "199", desc: "Full management. Protocol design, bi-monthly bloods, AI-assisted dosing, estrogen management, unlimited messaging.", key: "vitality_core", highlight: true },
              { tag: "COMPREHENSIVE", name: "Vitality Elite", price: "349", desc: "Comprehensive + concierge. Monthly bloods, peptide stacking, nutrition coaching, priority appointments, quarterly reviews.", key: "vitality_elite" },
            ].map((pkg, i) => (
              <R key={pkg.key} delay={i * 0.08}>
                <div className={`bg-[#0c0f14] p-8 md:p-10 flex flex-col ${pkg.highlight ? "border border-[#b8956a]/30 relative" : ""}`}>
                  {pkg.highlight && <span className="absolute -top-3 left-8 text-[9px] tracking-[0.2em] uppercase bg-[#b8956a] text-[#0c0f14] px-3 py-1 font-semibold">Recommended</span>}
                  <span className="text-[9px] tracking-[0.25em] uppercase text-[#b8956a]/60 mb-3">{pkg.tag}</span>
                  <h3 className="font-[family-name:var(--cinzel)] text-xl font-normal text-[#ede6d8]/80 mb-1">{pkg.name}</h3>
                  <div className="font-[family-name:var(--cinzel)] text-2xl text-[#b8956a] mb-4">&pound;{pkg.price}<span className="text-sm text-[#ede6d8]/20">/mo</span></div>
                  <p className="text-xs leading-relaxed text-[#ede6d8]/25 mb-8 flex-1">{pkg.desc}</p>
                  <button
                    onClick={() => {
                      localStorage.setItem("focus_package", pkg.key);
                      router.push("/dashboard");
                    }}
                    className={`text-[11px] tracking-[0.2em] uppercase px-8 py-3.5 transition-all duration-300 active:scale-[0.97] w-full ${
                      pkg.highlight
                        ? "bg-[#b8956a] text-[#0c0f14] hover:bg-[#c9a97a]"
                        : "border border-[#ede6d8]/10 text-[#ede6d8]/40 hover:border-[#b8956a]/30 hover:text-[#ede6d8]/70"
                    }`}
                  >
                    Select Package
                  </button>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 7 — CTA
          ══════════════════════════════════════════════════════════════ */}
      <section className="px-8 md:px-16 py-24 md:py-32 border-t border-[#ede6d8]/[0.04]">
        <div className="max-w-[600px] mx-auto text-center">
          <R>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#b8956a]/50 block mb-4">Begin</span>
            <h2 className="font-[family-name:var(--cinzel)] text-[clamp(1.6rem,3.5vw,2.2rem)] font-normal leading-tight mb-5">
              Three minutes<span className="text-[#b8956a]">.</span> One honest answer<span className="text-[#b8956a]">.</span>
            </h2>
            <p className="text-sm text-[#ede6d8]/25 mb-10 max-w-[380px] mx-auto">
              No account. No payment. No commitment. A clinically validated assessment that tells
              you whether hormone optimisation is worth investigating.
            </p>
          </R>
          <R delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startAssessment}
                className="font-[family-name:var(--cinzel)] text-[11px] tracking-[0.2em] uppercase bg-[#b8956a] text-[#0c0f14] px-10 py-4 hover:bg-[#c9a97a] transition-colors duration-300 active:scale-[0.97]"
              >
                Start Your Assessment
              </button>
              <a
                href="#packages"
                className="font-[family-name:var(--cinzel)] text-[11px] tracking-[0.2em] uppercase text-[#ede6d8]/30 border border-[#ede6d8]/10 px-10 py-4 hover:border-[#ede6d8]/25 hover:text-[#ede6d8]/60 transition-all duration-300"
              >
                View Packages
              </a>
            </div>
          </R>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════════════ */}
      <footer className="px-8 md:px-16 py-12 border-t border-[#ede6d8]/[0.04]">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-[family-name:var(--cinzel)] text-xs tracking-[0.3em] text-[#ede6d8]/15">ELEVATE</span>
          <div className="flex gap-6">
            <Link href="/login" className="text-[10px] text-[#ede6d8]/10 hover:text-[#ede6d8]/25 transition-colors">Admin</Link>
            <Link href="/assessment" className="text-[10px] text-[#ede6d8]/10 hover:text-[#ede6d8]/25 transition-colors">Assessment</Link>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto mt-8">
          <p className="text-[10px] leading-relaxed text-[#ede6d8]/8 text-center max-w-[600px] mx-auto">
            Information on this page is general and does not replace medical advice. Suitability for
            treatment is subject to clinical assessment and appropriate testing. Elevate operates under
            GMC-registered medical supervision. © {new Date().getFullYear()} Elevate. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Transition wipe */}
      <AnimatePresence>
        {wipe && (
          <motion.div
            className="fixed inset-0 z-[60] bg-[#0c0f14] pointer-events-none"
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(150% at 50% 50%)" }}
            transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
