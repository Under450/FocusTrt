import { NextResponse } from "next/server";
import { generateFindings, recommendTests } from "@/app/assessment/quiz-logic";
import type { Answers } from "@/app/assessment/quiz-data";

const SYSTEM_PROMPT = `You are a clinical assistant for ELEVATE, a UK premium hormone optimisation clinic. You analyse patient intake responses and produce structured personalisation data for a personal optimisation report.
You write like a calm, professional private physician — never alarmist, always honest about uncertainty, always emphasising that bloodwork is required for definitive diagnosis. You never use marketing language. You never recommend specific dosages or protocols (that's for the clinician). You connect the patient's specific symptom patterns to clinical hypotheses.
Output ONLY valid JSON in this exact structure (no markdown, no preamble, no explanation):
{
  "findings": [
    {"headline": "...", "detail": "...", "locked": false},
    {"headline": "...", "detail": "...", "locked": false},
    {"headline": "...", "detail": "...", "locked": false},
    {"headline": "...", "detail": "...", "locked": true}
  ],
  "tests": [
    {"name": "...", "measures": "...", "homePrice": "£...", "clinicPrice": "£...", "locked": false},
    {"name": "...", "measures": "...", "homePrice": "£...", "clinicPrice": "£...", "locked": true}
  ]
}
Findings rules:
- Exactly 4 findings — first 3 unlocked (visible to user), 4th locked (gated behind account)
- Each headline: 4-8 words, clinical but plain English
- Each detail: 1-2 sentences explaining what the patient's specific symptoms suggest, why this hypothesis fits, and what would need confirming
- Connect THIS patient's actual answer combinations — e.g. if they reported "high stress + 5-6h sleep + weight gain" relate it to cortisol-testosterone interplay specifically
- Never use the word "diagnosis" — use "suggests", "consistent with", "indicators include"
- The 4th locked finding should be a more specific or secondary insight that creates curiosity

Tests rules:
- Exactly 2 tests — first unlocked, second locked
- Match tests to symptom clusters using this catalogue:
  - Testosterone Panel — Total T, Free T, SHBG, Estradiol — £49.99 home, £75 clinic — primary for low T symptoms in men
  - Female Hormone Panel — Oestradiol, Progesterone, FSH, LH — £69.99 home, £95 clinic — primary for HRT symptoms in women
  - Hair Loss Panel — DHT, Ferritin, Vitamin D, Thyroid — £79 home, £110 clinic — for hair thinning concerns
  - Weight + Metabolic Panel — HbA1c, Fasting insulin, Lipids, Cortisol, Thyroid — £99 home, £140 clinic — for weight resistance
  - Sexual Health Panel — Total T, Free T, SHBG, Estradiol, Prolactin — £89 home, £125 clinic — for ED/libido focus
  - Complete Male Optimisation Panel — comprehensive baseline — £179 home, £229 clinic
  - Complete Female Optimisation Panel — comprehensive baseline — £199 home, £249 clinic
- Pick the test that maps best to this patient's primary concern as test #1
- Pick a complementary test as test #2 (locked) — usually the comprehensive panel for that sex`;

function buildUserMessage(answers: Answers): string {
  const symptoms = (answers.symptoms as string[]) || [];
  const tried = (answers.tried as string[]) || [];
  const safety = (answers.safety as string[]) || [];
  const goals = (answers.goals as string[]) || [];
  const outcomes = (answers.outcomes as string[]) || [];

  return `Patient profile:
Sex: ${answers.sex || "Not specified"}
Age: ${answers.age || "Not provided"}
Weight: ${answers.weight ? `${answers.weight} kg` : "Not provided"}
Height: ${answers.height ? `${answers.height} cm` : "Not provided"}
Symptoms: ${symptoms.join(", ") || "None selected"}
Symptom duration: ${answers.duration || "Not specified"}
Previously tried: ${tried.join(", ") || "Nothing"}
Safety check: ${safety.join(", ") || "None flagged"}
Recent bloodwork: ${answers.bloodwork || "Not specified"}
Goals: ${goals.join(", ") || "None selected"}
Activity level: ${answers.activity || "Not specified"}
Sleep hours: ${answers.sleep || "Not specified"}
Stress level: ${answers.stress || "Not specified"}
Alcohol: ${answers.alcohol || "Not specified"}
Specific outcomes: ${outcomes.length > 0 ? outcomes.join(", ") : "Not asked"}

Generate the personalised report JSON for this patient.`;
}

export async function POST(request: Request) {
  const answers: Answers = await request.json();

  // Fall back to local logic if no API key
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      findings: generateFindings(answers),
      tests: recommendTests(answers),
    });
  }

  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const userMsg = buildUserMessage(answers);
    console.log("[generate-report] Sending to Claude:", userMsg.slice(0, 200));

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMsg }],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";
    console.log("[generate-report] Claude raw response:", rawText.slice(0, 200));

    // Strip markdown code fences if present
    const cleaned = rawText.replace(/```json\n?/g, "").replace(/\n?```/g, "").trim();
    const data = JSON.parse(cleaned);

    // Validate structure
    if (
      !Array.isArray(data.findings) ||
      !Array.isArray(data.tests) ||
      data.findings.length < 3 ||
      data.tests.length < 1
    ) {
      console.error("[generate-report] Invalid structure:", JSON.stringify(data).slice(0, 300));
      throw new Error("Invalid response structure");
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[generate-report] Failed, using local fallback:", err);
    // Fall back to local logic on any failure
    return NextResponse.json({
      findings: generateFindings(answers),
      tests: recommendTests(answers),
    });
  }
}
