import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  prompt: z.string().trim().min(1).max(1000),
});

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not configured.");
}

const ai = new GoogleGenAI({ apiKey: apiKey ?? "" });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server missing GEMINI_API_KEY" },
        { status: 500 },
      );
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: parsed.data.prompt,
      config: {
        maxOutputTokens: 220,
        temperature: 0.3,
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

    return NextResponse.json(
      { error: message },
      { status },
    );
  }
}
