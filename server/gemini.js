const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
});

async function extractResumeInfo(transcript, step) {
    let promptSuffix = "";
    
    // We now handle 6 distinct steps of the interview
    if (step === 0) {
        promptSuffix = "Extract the job title as 'role' (make it sound highly professional) and the workplace as 'company'.";
    } else if (step === 1) {
        promptSuffix = "ENHANCE the user's raw tasks into 2-3 highly professional, ATS-friendly bullet points using strong action verbs. Return in 'responsibilities'.";
    } else if (step === 2) {
        promptSuffix = "Extract tools, vehicles, or technical skills mentioned. Return as a professional array of strings in 'skills'.";
    } else if (step === 3) {
        promptSuffix = "ENHANCE the user's proudest moment or solved problem into 1-2 professional, results-oriented bullet points. Return in 'achievements'.";
    } else if (step === 4) {
        promptSuffix = "Extract any mentioned safety training, NC II certificates, licenses (e.g., Professional Driver's License), or formal training. Return in 'certifications'.";
    } else if (step === 5) {
        promptSuffix = "Extract the interpersonal or teamwork skills mentioned (e.g., 'Team Player', 'Conflict Resolution', 'Time Management'). Return in 'softSkills'.";
    }

    const prompt = `
        You are an expert Resume Writer for blue-collar workers.
        The user is speaking in raw Taglish (Tagalog-English).
        Transcript: "${transcript}"
        
        Task: ${promptSuffix}
        
        Respond ONLY with a valid JSON object using exactly these keys (if a field is not relevant to this step, return an empty array or string): 
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

    try {
        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text());
    } catch (error) {
        console.error("Gemini AI Error:", error);
        throw error;
    }
}

module.exports = { extractResumeInfo };