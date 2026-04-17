const { GoogleGenAI } = require("@google/genai");

async function checkModels() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
        model: "gemini-pro",
        contents: "test",
    });
    console.log("gemini-pro works");
  } catch(e) {
    console.error("gemini-pro:", e.message || e);
  }
}
checkModels();
