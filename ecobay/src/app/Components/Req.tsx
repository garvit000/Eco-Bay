"use client";
import { GoogleGenAI } from "@google/genai";
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
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat bubble button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl transition-all duration-300 overflow-hidden">
          <div className="bg-blue-600 p-4">
            <h2 className="text-lg font-bold text-white">AI Assistant</h2>
          </div>
          
          <div className="max-h-96 overflow-y-auto p-4">
            {response && (
              <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                <p className="whitespace-pre-wrap text-sm">{response}</p>
              </div>
            )}
            
            {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask something..." 
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button 
                onClick={handleSubmit} 
                className={`p-2 rounded-r-md text-white ${
                  isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}