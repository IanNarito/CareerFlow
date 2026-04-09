const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
});

// Helper function to pause execution
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Added 'retries = 3' to attempt the call up to 3 times before failing
async function extractResumeInfo(transcript, step, retries = 3) {
    let promptSuffix = "";
    
    if (step === 0) promptSuffix = "Extract job title as 'role' (make it professional) and workplace as 'company'.";
    else if (step === 1) promptSuffix = "Enhance the raw tasks into 2-3 professional ATS bullet points. Return in 'responsibilities' array.";
    else if (step === 2) promptSuffix = "Extract tools/equipment/vehicles. Return as an array of strings in 'skills'.";
    else if (step === 3) promptSuffix = "Enhance proud moments or problems solved into professional bullet points. Return in 'achievements' array.";
    else if (step === 4) promptSuffix = "Extract safety training, licenses, NC II, or TESDA certs. Return in 'certifications' array.";
    else if (step === 5) promptSuffix = "Extract teamwork, interpersonal, or work-ethic skills. Return in 'softSkills' array.";

    const prompt = `
        You are an expert Resume Writer for blue-collar workers.
        User transcript (Taglish): "${transcript}"
        
        Task: ${promptSuffix}
        
        Respond ONLY with a valid JSON object using these keys (use empty string or array if not relevant): 
        {
          "role": "string",
          "company": "string",
          "responsibilities": ["string"],
          "skills": ["string"],
          "achievements": ["string"],
          "certifications": ["string"],
          "softSkills": ["string"]
        }
    `;

    // Try catching the 503 error and retrying
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const result = await model.generateContent(prompt);
            let rawText = result.response.text();
            
            // Safety: Strip markdown code blocks if Gemini accidentally adds them
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(rawText);
            
        } catch (error) {
            // If the server is busy (503) and we have retries left...
            if (error.status === 503 && attempt < retries) {
                const waitTime = attempt * 2000; // Wait 2s, then 4s, etc.
                console.warn(`[503 Server Busy] Retrying Gemini AI in ${waitTime/1000} seconds... (Attempt ${attempt}/${retries})`);
                await delay(waitTime);
                continue; // Loop loops around and tries again!
            }
            
            // If it's a different error or we ran out of retries, throw the error
            console.error(`Gemini AI Error on attempt ${attempt}:`, error);
            throw error;
        }
    }
}

module.exports = { extractResumeInfo };