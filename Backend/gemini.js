import axios from 'axios';

const geminiResponse = async (prompt) => {

    try {
        const url=process.env.GEMINI_API_KEY
        console.log("Gemini API URL:", url);
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${url}`,
            {
                "contents": [{
                    "parts": [{ "text": prompt }]
                }]
            }
        );
        
        // Extract the actual text content from the Gemini response structure
        const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini API";
        console.log("Gemini API Response:", textResponse);
        return {
            response: textResponse
        };
    } catch (err) {
        console.error("Gemini API Error:", err);
        return { error: "Failed to get api respnse  response from Gemini API" };
    }
};

export default geminiResponse