import type { Answers } from "./quiz-data";

export type Finding = { headline: string; detail: string; locked?: boolean };
export type TestRec = {
  name: string;
  measures: string;
  homePrice: string;
  clinicPrice: string;
  locked?: boolean;
};

export function generateFindings(answers: Answers): Finding[] {
  const sex = answers.sex as string;
  const symptoms = (answers.symptoms as string[]) || [];
  const goals = (answers.goals as string[]) || [];
  const isMale = sex === "I'm a man" || sex === "I'm asking for someone else";

  const findings: Finding[] = [];

  // Finding 1: hormone deficiency pattern
  const energySymptoms = symptoms.filter((s) =>
    ["Tired all the time", "Brain fog or poor focus", "Lost drive or motivation", "Mood swings or anxiety"].includes(s)
  );
  if (energySymptoms.length >= 2) {
    findings.push({
      headline: isMale
        ? "Likely low testosterone pattern"
        : "Likely oestrogen/progesterone imbalance",
      detail: isMale
        ? "Your combination of fatigue, cognitive symptoms and motivational decline is the classic presentation of testosterone deficiency in men."
        : "Your combination of fatigue and mood symptoms is consistent with perimenopause or hormone imbalance patterns we see frequently.",
    });
  } else {
    findings.push({
      headline: isMale ? "Possible testosterone insufficiency" : "Possible hormone fluctuation",
      detail: "Your symptoms suggest hormonal involvement worth investigating with bloodwork.",
    });
  }

  // Finding 2: physical pattern
  const physicalSymptoms = symptoms.filter((s) =>
    ["Gaining belly fat", "Losing muscle", "Weight gain (especially belly)", "Slow recovery from training", "Joint aches"].includes(s)
  );
  if (physicalSymptoms.length >= 1) {
    findings.push({
      headline: "Body composition changes align with hormonal cause",
      detail: isMale
        ? "Fat gain with muscle loss — especially around the midsection — is a hallmark of declining testosterone. Your body is partitioning energy differently."
        : "Central weight gain and joint discomfort are common indicators of declining oestrogen levels affecting metabolism and inflammation.",
    });
  } else {
    findings.push({
      headline: "Cognitive and mood patterns suggest hormonal involvement",
      detail: "Even without major physical symptoms, the cognitive and emotional picture you describe is consistent with suboptimal hormone levels.",
    });
  }

  // Finding 3: specific concern
  if (symptoms.includes("Reduced sex drive") || symptoms.includes("Erection issues")) {
    findings.push({
      headline: isMale
        ? "Sexual function decline likely testosterone-driven"
        : "Libido changes consistent with hormone levels",
      detail: isMale
        ? "Reduced libido and erectile changes are among the earliest and most responsive symptoms to testosterone optimisation."
        : "Changes in sexual function and comfort are directly linked to oestrogen and testosterone levels, both of which decline during perimenopause.",
    });
  } else if (symptoms.includes("Poor sleep") || symptoms.includes("Disrupted sleep") || symptoms.includes("Hot flushes or night sweats")) {
    findings.push({
      headline: isMale
        ? "Sleep disruption likely compounding hormonal decline"
        : "Sleep and vasomotor symptoms point to oestrogen decline",
      detail: isMale
        ? "Poor sleep quality reduces natural testosterone production, creating a feedback loop. Addressing both simultaneously produces the best outcomes."
        : "Hot flushes, night sweats and disrupted sleep are the most common — and most treatable — symptoms of declining oestrogen.",
    });
  } else {
    findings.push({
      headline: "Multiple symptom clusters warrant comprehensive testing",
      detail: "The combination of symptoms you've described spans several hormonal pathways. A full panel will clarify the picture.",
    });
  }

  // Finding 4: locked
  findings.push({
    headline: "Your personalised protocol recommendation",
    detail: "Based on your full symptom profile, history and goals, we've identified the optimal starting protocol for you.",
    locked: true,
  });

  return findings;
}

export function recommendTests(answers: Answers): TestRec[] {
  const sex = answers.sex as string;
  const symptoms = (answers.symptoms as string[]) || [];
  const goals = (answers.goals as string[]) || [];
  const isMale = sex === "I'm a man" || sex === "I'm asking for someone else";

  const tests: TestRec[] = [];

  // Primary test
  if (isMale) {
    tests.push({
      name: "Male Hormone Panel",
      measures: "Total testosterone, free testosterone, SHBG, oestradiol, LH, FSH, prolactin, haematocrit, PSA",
      homePrice: "£49.99",
      clinicPrice: "£75",
    });
  } else {
    tests.push({
      name: "Female Hormone Panel",
      measures: "Oestradiol, progesterone, testosterone, FSH, LH, SHBG, thyroid (TSH, T3, T4), DHEA-S",
      homePrice: "£69.99",
      clinicPrice: "£95",
    });
  }

  // Secondary tests (locked) based on symptoms/goals
  if (symptoms.includes("Hair thinning or loss") || goals.includes("Hair regrowth")) {
    tests.push({
      name: "Hair Loss Panel",
      measures: "DHT, iron, ferritin, zinc, thyroid, vitamin D",
      homePrice: "£79",
      clinicPrice: "£110",
      locked: true,
    });
  } else if (
    symptoms.includes("Gaining belly fat") ||
    symptoms.includes("Weight gain (especially belly)") ||
    goals.includes("Lose body fat")
  ) {
    tests.push({
      name: "Weight & Metabolic Panel",
      measures: "Insulin, HbA1c, cortisol, thyroid, leptin, lipid profile",
      homePrice: "£99",
      clinicPrice: "£140",
      locked: true,
    });
  } else {
    tests.push({
      name: "Comprehensive Wellness Panel",
      measures: "Full hormone profile, metabolic markers, vitamin panel, inflammatory markers",
      homePrice: "£129",
      clinicPrice: "£175",
      locked: true,
    });
  }

  return tests;
}
