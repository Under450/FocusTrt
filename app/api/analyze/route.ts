import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { base64, mediaType } = await request.json();

    if (!base64 || !mediaType) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt = `You are a clinical data extraction system for a UK hormone optimisation clinic called REVIVE.

Extract ALL biomarker values from this blood test report. Return ONLY a JSON object with this exact structure — no other text, no markdown:

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

Group markers logically by clinical category. Include every value visible in the report. Use the reference ranges provided in the report to determine status. Use UK clinical reference ranges where none are provided.`;

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

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[analyze] Error:", err);
    return NextResponse.json({ error: err.message || "Extraction failed" }, { status: 500 });
  }
}
