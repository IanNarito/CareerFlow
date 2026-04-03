const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with your API Key
const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function extractResumeInfo(transcript) {
    const prompt = `
        You are an expert resume builder. Take the following voice interview transcript 
        and extract the professional details. 
        
        Transcript: "${transcript}"

        Return ONLY a JSON object with this exact structure:
        {
            "role": "extracted job title",
            "company": "extracted company name",
            "responsibilities": ["bullet point 1", "bullet point 2"],
            "skills": ["skill 1", "skill 2"]
        }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
}

module.exports = { extractResumeInfo };