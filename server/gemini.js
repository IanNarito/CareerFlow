const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize with your API Key securely from the .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Force Gemini to return strict JSON using gemini-1.5-flash
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
});

async function extractResumeInfo(transcript, step) {
    let prompt = "";

    if (step === 0) {
        prompt = `
            You are an expert HR resume writer. The user is a blue-collar worker in the Philippines.
            Extract the job title and company name from the text (which may be in Tagalog or Taglish). 
            Translate the job title to a professional English equivalent.
            Return ONLY a JSON object with this exact structure:
            { "role": "Professional Job Title", "company": "Company Name" }
            
            Transcript: "${transcript}"
        `;
    } 
    else if (step === 1) {
        prompt = `
            You are an expert HR resume writer. 
            The user is describing their daily tasks in Tagalog/Taglish. 
            Convert this into 2 to 3 professional, ATS-friendly bullet points in English. 
            Start each bullet point with a strong action verb (e.g., Operated, Maintained).
            Return ONLY a JSON object with this exact structure:
            { "responsibilities": ["bullet point 1", "bullet point 2"] }
            
            Transcript: "${transcript}"
        `;
    } 
    else if (step === 2) {
        prompt = `
            You are an expert HR resume writer. 
            Extract the specific tools, heavy equipment, skills, or licenses mentioned in the text.
            Translate them to professional English industry terms.
            Return ONLY a JSON object with this exact structure:
            { "skills": ["Skill 1", "Skill 2", "Skill 3"] }
            
            Transcript: "${transcript}"
        `;
    }

    try {
        const result = await model.generateContent(prompt);
        // Clean the markdown if Gemini returns it with ```json blocks, just in case
        let text = result.response.text();
        const cleanedJson = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanedJson);
    } catch (error) {
        console.error("Gemini Parsing Error:", error);
        throw error;
    }
}

module.exports = { extractResumeInfo };