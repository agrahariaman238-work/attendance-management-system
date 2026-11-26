const Groq = require("groq-sdk");

// Initialize Groq API Client if key is available
const groqApiKey = process.env.GROQ_API_KEY;

if (!groqApiKey) {
  console.warn('WARNING: GROQ_API_KEY is not defined in the environment. Chatbot requests will fail.');
}
const groq = new Groq({ apiKey: groqApiKey });


module.exports = {
    groq,
    groqApiKey
};