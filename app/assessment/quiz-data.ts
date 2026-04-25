export type CardType = "welcome" | "single" | "multi" | "combined" | "segmented" | "loading";

export type QuizCard = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  type: CardType;
  options?: { trt: string[]; hrt: string[] } | string[];
  conditional?: (answers: Answers) => boolean;
};

export type Answers = Record<string, string | string[] | number | null>;

export const CARDS: QuizCard[] = [
  {
    id: "welcome",
    eyebrow: "YOUR PERSONALISED ASSESSMENT",
    title: "Sounds like\nsomething's off.",
    body: "Let's figure out what's going on and which of our protocols might help. Three minutes, twelve questions, one personalised report.",
    type: "welcome",
  },
  {
    id: "sex",
    eyebrow: "FIRST — A QUICK QUESTION",
    title: "Are you taking this for yourself?",
    body: "Your answer determines which of our protocols we explore — TRT for men, HRT for women.",
    type: "single",
    options: ["I'm a man", "I'm a woman", "I'm asking for someone else"],
  },
  {
    id: "symptoms",
    eyebrow: "PART ONE — YOUR SYMPTOMS",
    title: "Take a moment.\nWhich of these sound like you?",
    body: "Be honest — there's no judgement here. Pick as many as apply.",
    type: "multi",
    options: {
      trt: [
        "Tired all the time", "Brain fog or poor focus", "Lost drive or motivation",
        "Reduced sex drive", "Erection issues", "Gaining belly fat",
        "Losing muscle", "Poor sleep", "Low mood", "Hair thinning or loss",
        "Slow recovery from training",
      ],
      hrt: [
        "Tired all the time", "Brain fog or poor focus", "Hot flushes or night sweats",
        "Mood swings or anxiety", "Reduced sex drive", "Vaginal dryness",
        "Weight gain (especially belly)", "Disrupted sleep", "Hair thinning or loss",
        "Joint aches", "Irregular periods",
      ],
    },
  },
  {
    id: "duration",
    eyebrow: "PART ONE — YOUR SYMPTOMS",
    title: "How long has this been going on?",
    body: "Roughly. Don't overthink it.",
    type: "single",
    options: ["Months", "A year or more", "Several years", "I've always struggled with this"],
  },
  {
    id: "tried",
    eyebrow: "PART ONE — YOUR SYMPTOMS",
    title: "Have you already tried anything?",
    body: "Pick as many as apply, or none if this is your first step.",
    type: "multi",
    options: [
      "Diet changes", "Exercise programmes", "Supplements",
      "TRT or HRT (currently or previously)", "Peptides",
      "Weight loss medication", "Hair loss treatment",
      "None — this is my first step",
    ],
  },
  {
    id: "safety",
    eyebrow: "PART TWO — SAFETY CHECK",
    title: "Anything we should know about?",
    body: "Pick anything that applies. This helps us recommend safely.",
    type: "multi",
    options: {
      trt: [
        "Heart condition or history", "Prostate cancer history",
        "Liver or kidney issues", "Currently taking medication",
        "Sleep apnea", "Blood clot history", "None of the above",
      ],
      hrt: [
        "Heart condition or history", "Breast cancer history",
        "Liver or kidney issues", "Currently taking medication",
        "Sleep apnea", "Blood clot history", "None of the above",
      ],
    },
  },
  {
    id: "bloodwork",
    eyebrow: "PART TWO — SAFETY CHECK",
    title: "Have you had hormone bloodwork in the last 12 months?",
    body: "If yes, you'll be able to upload results to your account later.",
    type: "single",
    options: ["Yes — I have results to hand", "Yes — but no results to hand", "No"],
  },
  {
    id: "biometrics",
    eyebrow: "PART TWO — SAFETY CHECK",
    title: "Quick details so we can recommend the right starting point.",
    body: "All optional. We'll do better recommendations with this info.",
    type: "combined",
  },
  {
    id: "goals",
    eyebrow: "PART THREE — YOUR GOALS",
    title: "What does success look like for you?",
    body: "Pick as many as apply.",
    type: "multi",
    options: {
      trt: [
        "More energy day to day", "Lose body fat", "Build muscle",
        "Sharper focus", "Better sex life", "Better sleep",
        "Better mood", "Hair regrowth", "Healthy ageing",
        "Recovery from training",
      ],
      hrt: [
        "More energy day to day", "Lose body fat", "Sharper focus",
        "Better sex life", "Better sleep", "Better mood",
        "Hair regrowth", "Healthy ageing", "Symptom management",
        "Hot flush relief",
      ],
    },
  },
  {
    id: "lifestyle",
    eyebrow: "PART THREE — YOUR GOALS",
    title: "A few lifestyle details.",
    body: "These help us understand the full picture.",
    type: "segmented",
  },
  {
    id: "outcomes",
    eyebrow: "PART FOUR — YOUR PRIORITIES",
    title: "Any specific outcomes you're hoping for?",
    body: "These help us tailor your recommended tests.",
    type: "multi",
    options: {
      trt: [
        "Stop or reverse hair loss", "Improve erection quality",
        "Lose 10kg+ weight", "Build measurable muscle",
        "Recover from training faster", "None of these specifically",
      ],
      hrt: [
        "Stop or reverse hair loss", "Lose 10kg+ weight",
        "Eliminate hot flushes", "Improve mood stability",
        "None of these specifically",
      ],
    },
    conditional: (answers) => {
      const goals = (answers.goals as string[]) || [];
      return goals.some((g) =>
        ["Hair regrowth", "Lose body fat", "Better sex life", "Build muscle"].includes(g)
      );
    },
  },
  {
    id: "loading",
    eyebrow: "ANALYSING YOUR RESPONSES",
    title: "Building your\npersonalised report.",
    body: "Cross-referencing your symptoms, history and goals with our clinical recommendation framework.",
    type: "loading",
  },
];
