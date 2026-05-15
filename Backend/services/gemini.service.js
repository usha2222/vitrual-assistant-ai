import axios from "axios";

export const getGeminiResponse = async (prompt) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response from Gemini API");
    
    return text;
  } catch (error) {
    const apiError = error.response?.data?.error?.message || error.message;
    console.error("Gemini Service Error:", apiError);
    throw new Error(apiError);
  }
};
