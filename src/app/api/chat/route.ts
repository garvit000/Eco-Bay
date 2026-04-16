import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  prompt: z.string().trim().min(1).max(2000),
  mode: z.enum(["chat", "sustainability"]).optional().default("chat"),
});

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not configured.");
}

const ai = new GoogleGenAI({ apiKey: apiKey ?? "" });

const SYSTEM_INSTRUCTION = `You are EcoBot, a friendly sustainability assistant for EcoBay — an eco-friendly marketplace.
Your role is to:
1. Help users understand the environmental impact of products
2. Suggest sustainable alternatives to everyday items
3. Explain eco-certifications (organic, fair trade, carbon-neutral, etc.)
4. Give tips on sustainable living and shopping
5. When given a product URL or name, rate its sustainability from 1-5 and explain why

Keep answers concise (2-4 sentences), friendly, and actionable. Use emojis sparingly for warmth.
If asked about something unrelated to sustainability/eco topics, gently redirect the conversation.`;

const SUSTAINABILITY_INSTRUCTION = `You are a sustainability analyst. Given a product URL or name, provide:
1. An eco-rating from 1.0 to 5.0 (one decimal place)
2. The main reason for that rating (one sentence)
3. One improvement suggestion

Format your response EXACTLY as:
RATING: [number]
REASON: [one sentence]
TIP: [one sentence]

Be consistent and realistic. Brand-name fast fashion = 1.0-2.0. Organic/certified items = 4.0-5.0.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server missing GEMINI_API_KEY" },
        { status: 500 },
      );
    }

    const instruction =
      parsed.data.mode === "sustainability"
        ? SUSTAINABILITY_INSTRUCTION
        : SYSTEM_INSTRUCTION;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: parsed.data.prompt,
      config: {
        systemInstruction: instruction,
        maxOutputTokens: 400,
        temperature: 0.4,
      },
    });

    return NextResponse.json({ text: result.text ?? "" });
  } catch (error) {
    console.error("Chat route error:", error);

    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as { status?: number }).status === "number"
        ? (error as { status: number }).status
        : 500;

    const message =
      status === 429
        ? "Gemini quota reached. Try again in a few seconds."
        : "Failed to generate response";

    return NextResponse.json({ error: message }, { status });
  }
}
