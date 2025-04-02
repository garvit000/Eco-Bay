"use client";
import { GoogleGenAI } from "@google/genai";
import Result_ from "postcss/lib/result";
import { useState } from "react";

const key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: key });

async function generateContent(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

export default function Req() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const result = await generateContent(prompt);
      if(result) setPrompt("");
      setResponse(result || "No response generated");
    } catch (err) {
      setError("Failed to generate response. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">AI Assistant</h2>
        
        <div className="mb-4">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="How can I assist you today?" 
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        
        <button 
          onClick={handleSubmit} 
          className={`w-full p-3 rounded-md text-white font-medium ${
            isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } transition-colors`}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? "Generating..." : "Submit"}
        </button>
        
        {error && <p className="mt-4 text-red-500">{error}</p>}
        
        {response && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="font-semibold mb-2">Response:</h3>
            <p className="whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}