const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // This loads the hidden .env file!

// Initialize using the secure environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// We use flash for speed, and force it to return clean JSON
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
});

async function extractResumeInfo(transcript, step) {
    let promptSuffix = "";
    
    // Dynamically change what we ask the AI based on the interview step
    if (step === 0) promptSuffix = "Extract the 'role' and the 'company'.";
    if (step === 1) promptSuffix = "Extract 2-3 professional 'responsibilities' as bullet points.";
    if (step === 2) promptSuffix = "Extract a list of 3-5 technical 'skills' or tools mentioned.";

    const prompt = `
        Context: The user is a blue-collar worker in the Philippines providing voice answers for a resume. 
        The answer might be in Taglish (Tagalog-English).
        
        Transcript: "${transcript}"
        
        Task: ${promptSuffix} Translate to professional English if needed. 
        Return ONLY a raw JSON object with these keys: "role", "company", "responsibilities" (array), "skills" (array).
    `;

    try {
        const result = await model.generateContent(prompt);
        // Because we set responseMimeType to application/json, we can safely parse it
        return JSON.parse(result.response.text());
    } catch (error) {
        console.error("Gemini AI Error:", error);
        throw error;
    }
}

module.exports = { extractResumeInfo };