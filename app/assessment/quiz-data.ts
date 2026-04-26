export type CardType =
  | "welcome" | "single" | "multi" | "combined" | "segmented" | "loading"
  | "medications" | "adam" | "iief5" | "phq9" | "greene";

export type QuizCard = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  type: CardType;
  options?: { trt: string[]; hrt: string[] } | string[];
  conditional?: (answers: Answers) => boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Answers = Record<string, any>;

export const ADAM_QUESTIONS = [
  "Do you have a decrease in libido (sex drive)?",
  "Do you have a lack of energy?",
  "Do you have a decrease in strength and/or endurance?",
  "Have you lost height?",
  "Have you noticed a decreased \"enjoyment of life\"?",
  "Are you sad and/or grumpy?",
  "Are your erections less strong?",
  "Have you noted a recent deterioration in your ability to play sports?",
  "Are you falling asleep after dinner?",
  "Has there been a recent deterioration in your work performance?",
];

export const IIEF5_QUESTIONS = [
  { q: "How do you rate your confidence that you could get and keep an erection?", labels: ["Very low", "Low", "Moderate", "High", "Very high"] },
  { q: "When you had erections with sexual stimulation, how often were your erections hard enough for penetration?", labels: ["Almost never", "A few times", "Sometimes", "Most times", "Almost always"] },
  { q: "During sexual intercourse, how often were you able to maintain your erection after you had penetrated your partner?", labels: ["Almost never", "A few times", "Sometimes", "Most times", "Almost always"] },
  { q: "During sexual intercourse, how difficult was it to maintain your erection to completion of intercourse?", labels: ["Extremely difficult", "Very difficult", "Difficult", "Slightly difficult", "Not difficult"] },
  { q: "When you attempted sexual intercourse, how often was it satisfactory for you?", labels: ["Almost never", "A few times", "Sometimes", "Most times", "Almost always"] },
];

export const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed or hopeless",
  "Trouble falling/staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself, or that you are a failure, or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself in some way",
];

export const PHQ9_OPTIONS = ["Not at all", "Several days", "More than half the days", "Nearly every day"];

export const GREENE_QUESTIONS = [
  { q: "Heart beating quickly or strongly", section: "Psychological" },
  { q: "Feeling tense or nervous", section: "Psychological" },
  { q: "Difficulty in sleeping", section: "Psychological" },
  { q: "Excitable", section: "Psychological" },
  { q: "Attacks of panic", section: "Psychological" },
  { q: "Difficulty in concentrating", section: "Psychological" },
  { q: "Feeling tired or lacking energy", section: "Psychological" },
  { q: "Loss of interest in most things", section: "Psychological" },
  { q: "Feeling unhappy or depressed", section: "Psychological" },
  { q: "Crying spells", section: "Psychological" },
  { q: "Irritability", section: "Psychological" },
  { q: "Feeling dizzy or faint", section: "Somatic" },
  { q: "Pressure or tightness in head or body", section: "Somatic" },
  { q: "Parts of body feel numb or tingling", section: "Somatic" },
  { q: "Headaches", section: "Somatic" },
  { q: "Muscle and joint pains", section: "Somatic" },
  { q: "Loss of feeling in hands or feet", section: "Somatic" },
  { q: "Breathing difficulties", section: "Somatic" },
  { q: "Hot flushes", section: "Vasomotor" },
  { q: "Sweating at night", section: "Vasomotor" },
  { q: "Loss of interest in sex", section: "Sexual" },
];

export const GREENE_OPTIONS = ["None", "Mild", "Moderate", "Severe"];

function isMale(answers: Answers): boolean {
  return answers.sex !== "I'm a woman";
}

export const CARDS: QuizCard[] = [
  // Card 1
  { id: "welcome", eyebrow: "YOUR PERSONALISED ASSESSMENT", title: "Sounds like\nsomething's off.", body: "Let's figure out what's going on and which of our protocols might help. A few minutes, personalised report at the end.", type: "welcome" },
  // Card 2
  { id: "sex", eyebrow: "FIRST — A QUICK QUESTION", title: "Are you taking this for yourself?", body: "Your answer determines which of our protocols we explore — TRT for men, HRT for women.", type: "single", options: ["I'm a man", "I'm a woman", "I'm asking for someone else"] },
  // Card 3
  { id: "symptoms", eyebrow: "PART ONE — YOUR SYMPTOMS", title: "Take a moment.\nWhich of these sound like you?", body: "Be honest — there's no judgement here. Pick as many as apply.", type: "multi", options: { trt: ["Tired all the time", "Brain fog or poor focus", "Lost drive or motivation", "Reduced sex drive", "Erection issues", "Gaining belly fat", "Losing muscle", "Poor sleep", "Low mood", "Hair thinning or loss", "Slow recovery from training"], hrt: ["Tired all the time", "Brain fog or poor focus", "Hot flushes or night sweats", "Mood swings or anxiety", "Reduced sex drive", "Vaginal dryness", "Weight gain (especially belly)", "Disrupted sleep", "Hair thinning or loss", "Joint aches", "Irregular periods"] } },
  // Card 4
  { id: "duration", eyebrow: "PART ONE — YOUR SYMPTOMS", title: "How long has this been going on?", body: "Roughly. Don't overthink it.", type: "single", options: ["Months", "A year or more", "Several years", "I've always struggled with this"] },
  // Card 5
  { id: "tried", eyebrow: "PART ONE — YOUR SYMPTOMS", title: "Have you already tried anything?", body: "Pick as many as apply, or none if this is your first step.", type: "multi", options: ["Diet changes", "Exercise programmes", "Supplements", "TRT or HRT (currently or previously)", "Peptides", "Weight loss medication", "Hair loss treatment", "None — this is my first step"] },
  // Card 6 — NEW
  { id: "smoking", eyebrow: "PART ONE — YOUR LIFESTYLE", title: "Do you smoke?", body: "Smoking affects hormone metabolism and cardiovascular risk. Honest answers help us recommend safely.", type: "single", options: ["Never smoked", "Ex-smoker (quit over 1 year ago)", "Ex-smoker (quit within last year)", "Current smoker (occasional / under 5 a day)", "Current smoker (regular / over 5 a day)"] },
  // Card 7 — NEW
  { id: "medications", eyebrow: "PART ONE — YOUR LIFESTYLE", title: "Are you taking any medications?", body: "Many common medications interact with hormones. Tick any that apply, and add anything else in the text box.", type: "medications" },
  // Card 8 — NEW (HRT only)
  { id: "pregnancy", eyebrow: "PART ONE — IMPORTANT SAFETY CHECK", title: "Are you currently pregnant, breastfeeding, or trying to conceive?", body: "Hormone therapy isn't appropriate during pregnancy or breastfeeding. We need to know before recommending anything.", type: "single", options: ["No, none of these", "Currently pregnant", "Currently breastfeeding", "Actively trying to conceive", "Recently pregnant (last 6 months)"], conditional: (a) => !isMale(a) },
  // Card 9
  { id: "safety", eyebrow: "PART TWO — SAFETY CHECK", title: "Anything we should know about?", body: "Pick anything that applies. This helps us recommend safely.", type: "multi", options: { trt: ["Heart condition or history", "Prostate cancer history", "Liver or kidney issues", "Currently taking medication", "Sleep apnea", "Blood clot history", "None of the above"], hrt: ["Heart condition or history", "Breast cancer history", "Liver or kidney issues", "Currently taking medication", "Sleep apnea", "Blood clot history", "None of the above"] } },
  // Card 10
  { id: "bloodwork", eyebrow: "PART TWO — SAFETY CHECK", title: "Have you had hormone bloodwork in the last 12 months?", body: "If yes, you'll be able to upload results to your account later.", type: "single", options: ["Yes — I have results to hand", "Yes — but no results to hand", "No"] },
  // Card 11
  { id: "biometrics", eyebrow: "PART TWO — SAFETY CHECK", title: "Quick details so we can recommend the right starting point.", body: "All optional. We'll do better recommendations with this info.", type: "combined" },
  // Card 12
  { id: "goals", eyebrow: "PART THREE — YOUR GOALS", title: "What does success look like for you?", body: "Pick as many as apply.", type: "multi", options: { trt: ["More energy day to day", "Lose body fat", "Build muscle", "Sharper focus", "Better sex life", "Better sleep", "Better mood", "Hair regrowth", "Healthy ageing", "Recovery from training"], hrt: ["More energy day to day", "Lose body fat", "Sharper focus", "Better sex life", "Better sleep", "Better mood", "Hair regrowth", "Healthy ageing", "Symptom management", "Hot flush relief"] } },
  // Card 13
  { id: "lifestyle", eyebrow: "PART THREE — YOUR GOALS", title: "A few lifestyle details.", body: "These help us understand the full picture.", type: "segmented" },
  // Card 14 (conditional)
  { id: "outcomes", eyebrow: "PART FOUR — YOUR PRIORITIES", title: "Any specific outcomes you're hoping for?", body: "These help us tailor your recommended tests.", type: "multi", options: { trt: ["Stop or reverse hair loss", "Improve erection quality", "Lose 10kg+ weight", "Build measurable muscle", "Recover from training faster", "None of these specifically"], hrt: ["Stop or reverse hair loss", "Lose 10kg+ weight", "Eliminate hot flushes", "Improve mood stability", "None of these specifically"] }, conditional: (a) => { const goals = (a.goals as string[]) || []; return goals.some((g: string) => ["Hair regrowth", "Lose body fat", "Better sex life", "Build muscle"].includes(g)); } },
  // Card 15a — ADAM (men only)
  { id: "adam", eyebrow: "PART FOUR — CLINICAL SCREENING (1 OF 3)", title: "A few quick yes/no questions.", body: "This is the ADAM questionnaire — a validated screening tool used by endocrinologists worldwide.", type: "adam", conditional: (a) => isMale(a) },
  // Card 15b — IIEF-5 (men only)
  { id: "iief5", eyebrow: "PART FOUR — CLINICAL SCREENING (2 OF 3)", title: "Sexual function over the past 6 months.", body: "Honest answers — this is medical screening, not personal judgement.", type: "iief5", conditional: (a) => isMale(a) },
  // Card 15c — PHQ-9 (men only)
  { id: "phq9", eyebrow: "PART FOUR — CLINICAL SCREENING (3 OF 3)", title: "Mood over the last 2 weeks.", body: "Depression often overlaps with hormone symptoms. We screen for both because they need different treatment.", type: "phq9", conditional: (a) => isMale(a) },
  // Card 15a — Greene (women only)
  { id: "greene", eyebrow: "PART FOUR — CLINICAL SCREENING", title: "Menopausal symptom severity.", body: "This is the Greene Climacteric Scale — used by NHS menopause clinics to assess symptom impact.", type: "greene", conditional: (a) => !isMale(a) },
  // Card 16 — Loading
  { id: "loading", eyebrow: "ANALYSING YOUR RESPONSES", title: "Building your\npersonalised report.", body: "Cross-referencing your symptoms, history and goals with our clinical recommendation framework.", type: "loading" },
];

export const MEDICATION_OPTIONS_COMMON = [
  "Statins (cholesterol)",
  "Antidepressants (SSRIs/SNRIs)",
  "Blood pressure medication",
  "Diabetes medication (metformin, insulin, etc.)",
  "Painkillers (regular use, including opioids)",
  "Finasteride or dutasteride (hair loss / prostate)",
  "Sleeping pills or benzodiazepines",
  "Steroids (oral or inhaled)",
  "Performance enhancement drugs (current or past)",
  "None of the above",
];

export const MEDICATION_OPTIONS_WOMEN = [
  "HRT or birth control",
];
