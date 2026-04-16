/**
 * /api/chat — legacy compatibility shim.
 * Forwards all requests to the main EcoBay AI endpoint at /api/ai.
 */
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const aiResponse = await fetch(
      new URL("/api/ai", request.url).toString(),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    const data = await aiResponse.json();
    return NextResponse.json(data, { status: aiResponse.status });
  } catch {
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
