const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function analyzeResume(fileBuffer) {
  const { text } = await pdfParse(fileBuffer);

  const prompt = `
    You are a recruiter. Analyze the following resume and return JSON:
    Resume Text:
    """${text}"""

    JSON Structure:
    {
      "name": "string|null",
      "email": "string|null",
      "phone": "string|null",
      "linkedin_url": "string|null",
      "portfolio_url": "string|null",
      "summary": "string|null",
      "work_experience": [{ "role": "string", "company": "string", "duration": "string", "description": ["string"] }],
      "education": [{ "degree": "string", "institution": "string", "graduation_year": "string" }],
      "technical_skills": ["string"],
      "soft_skills": ["string"],
      "resume_rating": "number",
      "improvement_areas": "string",
      "upskill_suggestions": ["string"]
    }
  `;

  const model = client.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

module.exports = { analyzeResume };
