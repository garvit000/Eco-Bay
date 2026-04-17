const apiKey = process.env.GEMINI_API_KEY;

async function checkRest() {
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-flash"];
  
  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "test" }] }]
      })
    });
    const data = await res.json();
    if (res.ok) {
      console.log(`${model} works REST!`);
    } else {
      console.log(`${model} failed REST:`, data.error.message);
    }
  }
}
checkRest();
