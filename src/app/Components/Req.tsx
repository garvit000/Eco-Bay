"use client";
import { KeyboardEvent, useState, useRef, useEffect } from "react";
import { Leaf, X, Send, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

/** Calls EcoBay's AI brain. */
async function callEcoBayAI(
  prompt: string,
  history: Message[]
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  // Build context from the last 4 exchanges so the AI has conversational memory
  const context =
    history.length > 1
      ? history
          .slice(-8)
          .map((m) => `${m.role === "user" ? "User" : "EcoBot"}: ${m.text}`)
          .join("\n")
      : undefined;

  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, mode: "chat", context }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      throw new Error(errorData.error ?? "AI request failed");
    }

    const data = (await response.json()) as { text?: string };
    return data.text?.trim() || "I didn't quite catch that. Could you rephrase?";
  } finally {
    clearTimeout(timeoutId);
  }
}

const SUGGESTIONS = [
  "What makes a product eco-friendly?",
  "Best sustainable alternatives to plastic?",
  "How does your Eco Rating work?",
  "Tips for a zero-waste kitchen",
];

export default function Req() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! I'm EcoBot 🌿 — your EcoBay sustainability assistant. Ask me anything about eco-friendly products, certifications, or green living!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  const handleSubmit = async (text?: string) => {
    const userMessage = (text ?? prompt).trim();
    if (!userMessage || isLoading) return;

    setPrompt("");
    const newMessages: Message[] = [
      ...messages,
      { role: "user", text: userMessage },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const result = await callEcoBayAI(userMessage, newMessages);
      setMessages((prev) => [...prev, { role: "assistant", text: result }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            err instanceof Error
              ? err.message
              : "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSubmit();
  };

  const isFirstMessage = messages.length === 1;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-600 hover:bg-emerald-700 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 relative"
        aria-label="Toggle EcoBot"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <>
            <Leaf className="h-6 w-6 text-white" />
            {/* Unread indicator for first open */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
          </>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
          style={{ maxHeight: "560px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-4 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">EcoBot</h2>
              <p className="text-xs text-emerald-100">
                Powered by EcoBay AI · Gemini
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-100">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
            style={{ minHeight: "260px", maxHeight: "360px" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <Leaf className="w-3 h-3 text-emerald-600" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-br-sm"
                      : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2 mt-1 shrink-0">
                  <Leaf className="w-3 h-3 text-emerald-600" />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1 items-center">
                    <span
                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestion chips (shown only when conversation is fresh) */}
          {isFirstMessage && !isLoading && (
            <div className="px-4 pb-2 bg-gray-50 flex flex-wrap gap-1.5 shrink-0">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSubmit(s)}
                  className="text-xs px-3 py-1.5 bg-white border border-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-50 hover:border-emerald-300 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about sustainability…"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSubmit()}
                disabled={isLoading || !prompt.trim()}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-40 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}