import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { z } from "zod";

// ─── Schema ───────────────────────────────────────────────────────────────────
const requestSchema = z.object({
  prompt: z.string().trim().min(1).max(3000),
  mode: z
    .enum(["chat", "sustainability", "barcode", "recommend"])
    .optional()
    .default("chat"),
  context: z.string().trim().max(500).optional(), // optional extra context
});

// ─── Gemini client ────────────────────────────────────────────────────────────
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) console.warn("[EcoBay AI] GEMINI_API_KEY is not configured.");
const ai = new GoogleGenAI({ apiKey: apiKey ?? "" });

// ─── System instructions per mode ────────────────────────────────────────────

const INSTRUCTIONS = {
  /**
   * EcoBot — conversational sustainability assistant.
   * Deeply aware of EcoBay's product catalogue, values, and eco-scoring system.
   */
  chat: `You are EcoBot, the official AI assistant for EcoBay — a premium eco-friendly marketplace.

About EcoBay:
- We sell rigorously vetted sustainable products across: Clothing, Home, Beauty, Food, Accessories
- Every product carries an Eco Rating (1–5 stars) based on: materials, supply chain, packaging, carbon footprint, certifications
- We accept only brands that meet our sustainability standards: organic certification, fair trade, recycled materials, or verified carbon-neutral operations
- Our mission: make sustainable shopping accessible, transparent, and impactful

Your role:
1. Answer questions about sustainability, eco-certifications, and green living
2. Help users find the right eco-friendly products for their needs
3. Explain our Eco Rating system and what makes products score high or low
4. Give actionable sustainable living tips
5. Compare eco-impact of product choices (e.g. bamboo vs plastic toothbrush)
6. Explain certifications: GOTS, Fair Trade, B-Corp, OEKO-TEX, Rainforest Alliance, etc.

Tone: Warm, knowledgeable, slightly enthusiastic about sustainability. Keep answers to 2–4 sentences unless the question clearly needs more detail. Use 1–2 relevant emojis per response.
Never make up specific product prices or stock availability.
If asked something unrelated to EcoBay or sustainability, gently redirect.`,

  /**
   * Sustainability analyst — structured product eco-rating.
   */
  sustainability: `You are EcoBay's sustainability analyst AI. Your job is to assess the eco-friendliness of any product, URL, or brand given to you.

Scoring guide (1.0–5.0 scale):
- 1.0–1.5: Extremely harmful (fast fashion giants, single-use plastic products, known polluters)
- 1.6–2.5: Poor (conventional brands with no visible sustainability commitments)
- 2.6–3.4: Average (some positive steps but significant room for improvement)
- 3.5–4.2: Good (strong sustainability practices, some certified/verified)
- 4.3–5.0: Excellent (certified organic/fair trade/B-Corp, circular design, minimal footprint)

Consider: materials sourcing, manufacturing ethics, packaging, supply chain transparency, certifications, and end-of-life recyclability.

Respond EXACTLY in this format (no other text):
RATING: [X.X]
REASON: [One clear sentence explaining the primary factor driving this score]
TIP: [One actionable suggestion to find a greener alternative or use the product more sustainably]
CATEGORY: [Clothing | Food | Beauty | Home | Electronics | Accessories | Other]`,

  /**
   * Barcode AI — identify a product from its barcode number.
   * Used as fallback when Open Food Facts has no record.
   */
  barcode: `You are EcoBay's product identification AI. Given a barcode number (EAN-13, EAN-8, UPC-A, UPC-E, Code128, or QR code content), identify the likely product.

Use your knowledge of barcode formats, common brand prefixes, and GS1 country codes to make an educated identification.

GS1 country code hints (first 2-3 digits of EAN-13):
- 00–13: USA/Canada (UPC)
- 30–37: France
- 40–44: Germany
- 45, 49: Japan
- 50: UK
- 54: Belgium/Luxembourg
- 57: Denmark
- 64: Finland
- 70: Norway
- 73: Sweden
- 76: Switzerland
- 80–83: Italy
- 84: Spain
- 87: Netherlands
- 890: India
- 899: Indonesia

Respond EXACTLY in this format (no other text):
PRODUCT: [Best guess at product name, or "Unknown Product" if truly unidentifiable]
BRAND: [Brand name, or "Unknown Brand"]
CATEGORY: [Food | Beverage | Personal Care | Household | Electronics | Clothing | Other]
ORIGIN: [Country/region of likely origin based on barcode prefix, or "Unknown"]
CONFIDENCE: [High | Medium | Low]
NOTE: [One sentence about what you based this identification on, or any caveats]`,

  /**
   * Recommendation engine — suggest better eco alternatives.
   */
  recommend: `You are EcoBay's eco-recommendation engine. Given a product category, item, or user preference, suggest 3 eco-friendly alternatives available on EcoBay or in the market.

EcoBay product categories: Clothing, Home, Beauty, Food, Accessories.

For each recommendation provide:
- Product name and brief description
- Why it's more sustainable
- Approximate eco rating (1–5)

Format EXACTLY as:
REC1_NAME: [name]
REC1_DESC: [one sentence description]
REC1_WHY: [why it's eco-friendly]
REC1_RATING: [X.X]
REC2_NAME: [name]
REC2_DESC: [one sentence description]
REC2_WHY: [why it's eco-friendly]
REC2_RATING: [X.X]
REC3_NAME: [name]
REC3_DESC: [one sentence description]
REC3_WHY: [why it's eco-friendly]
REC3_RATING: [X.X]`,
};

// ─── Token limits per mode ───────────────────────────────────────────────────
const TOKEN_LIMITS: Record<string, number> = {
  chat: 450,
  sustainability: 200,
  barcode: 150,
  recommend: 400,
};

// ─── Temperature per mode ────────────────────────────────────────────────────
const TEMPERATURES: Record<string, number> = {
  chat: 0.55,       // slightly creative for conversation
  sustainability: 0.2, // deterministic for scoring
  barcode: 0.1,     // very deterministic for identification
  recommend: 0.45,  // moderate for recommendations
};

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "EcoBay AI is not configured (missing GEMINI_API_KEY)" },
        { status: 500 }
      );
    }

    const { prompt, mode, context } = parsed.data;
    const fullPrompt = context ? `${context}\n\n${prompt}` : prompt;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: fullPrompt,
      config: {
        systemInstruction: INSTRUCTIONS[mode],
        maxOutputTokens: TOKEN_LIMITS[mode],
        temperature: TEMPERATURES[mode],
      },
    });

    return NextResponse.json({
      text: result.text ?? "",
      mode,
    });
  } catch (error) {
    console.error("[EcoBay AI] Error:", error);

    const httpStatus =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as { status?: number }).status === "number"
        ? (error as { status: number }).status
        : 500;

    const message =
      httpStatus === 429
        ? "EcoBay AI is temporarily busy. Please try again in a few seconds."
        : httpStatus === 403
        ? "API key is invalid or does not have permission."
        : "EcoBay AI encountered an error. Please try again.";

    return NextResponse.json({ error: message }, { status: httpStatus });
  }
}
