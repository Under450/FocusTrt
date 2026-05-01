import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://under450.github.io",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500, headers: corsHeaders });
    }

    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // ── INSIGHT MODE — interpret a single marker ──
    if (body.insight) {
      const { markerName, markerValue, markerUnit, markerStatus, refLow, refHigh } = body;
      const message = await client.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 600,
        messages: [{
          role: "user",
          content: `You are a UK hormone clinic clinician at REVIVE. A patient on TRT/HRT has a ${markerName} result of ${markerValue} ${markerUnit} (status: ${markerStatus}, UK ref: ${refLow ?? "?"}–${refHigh ?? "?"}).

Write three short paragraphs:
1) What this result means clinically (2-3 sentences).
2) What the UK reference range means and how this result compares.
3) Specific implications for someone on TRT or HRT.

Be direct and accessible. No bullet points. No headers.`
        }]
      });
      const text = message.content[0].type === "text" ? message.content[0].text : "";
      return NextResponse.json({ text }, { headers: corsHeaders });
    }

    // ── EXTRACTION MODE — parse blood test PDF/image ──
    const { base64, mediaType } = body;
    if (!base64 || !mediaType) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400, headers: corsHeaders });
    }

    const prompt = `You are a clinical data extraction system for REVIVE, a UK hormone optimisation clinic.

Extract ALL biomarker values from this blood test report. Return ONLY a JSON object — no markdown, no preamble:

{
  "patient_name": "string or null",
  "test_date": "string or null",
  "lab_name": "string or null",
  "groups": [
    {
      "group_name": "string (e.g. Hormones, Full Blood Count, Liver Function, Kidney Function, Lipids, Thyroid, Vitamins & Minerals, Inflammation)",
      "markers": [
        {
          "name": "string",
          "value": number,
          "unit": "string",
          "reference_low": number or null,
          "reference_high": number or null,
          "status": "normal" | "high" | "low" | "unknown"
        }
      ]
    }
  ]
}

Group markers logically by clinical category. Include every value visible. Use report reference ranges to determine status. Apply UK clinical ranges where none are provided.`;

    const contentBlock: any = mediaType === "application/pdf"
      ? { type: "document", source: { type: "base64", media_type: mediaType, data: base64 } }
      : { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } };

    const message = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: [contentBlock, { type: "text", text: prompt }]
      }]
    });

    const rawText = message.content[0].type === "text" ? message.content[0].text : "";
    const cleaned = rawText.replace(/```json\n?/g, "").replace(/\n?```/g, "").trim();
    const data = JSON.parse(cleaned);

    return NextResponse.json(data, { headers: corsHeaders });
  } catch (err: any) {
    console.error("[analyze] Error:", err);
    return NextResponse.json({ error: err.message || "Extraction failed" }, { status: 500, headers: corsHeaders });
  }
}
