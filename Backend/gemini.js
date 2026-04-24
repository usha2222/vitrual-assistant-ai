import axios from 'axios';

const geminiResponse = async (command, assistantName, userName) => {

    try {
        const url = process.env.GEMINI_API_KEY
        const prompt = `You are a virtual assistant named ${assistantName}, created by ${userName}.
        You are not a Google. You will now behave like a voice-enabled virtual assistant.
        Your task is to understand the user's natural language input and respond with a JSON object like this:
        {
          "type": "general" | "google_search" | "wikipedia_search" | "youtube_search" | "calculator_open" | "weather_show" | "get_time" | "get_date" | "get_month" | "get_day" | "news" | "instagram_search" | "twitter_search" | "facebook_search" | "email_check" | "calendar_check" | "map_search" | "music_play" | "video_play",
          "userInput": "the original user input, with assistant's name removed if present. If the user asks to search on Google or YouTube, extract only the search query.",
          "response": "a short spoken response to read out loud to the user"
        }
        Instructions:
        - "type": Determine the user's intent.
        - "userInput": The original sentence the user spoke.
        - "response": A short, voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.

        Type meanings:
        - "general": For factual or informational questions.
        - "google_search": If the user wants to search something on Google.
        - "youtube_search": If the user wants to search something on YouTube.
        - "music_play": If the user wants to directly play a video or song.
        - "calculator_open": If the user wants to open a calculator.
        - "get_date": If the user asks for today's date.
        - "get_month": If the user asks for the current month.
        - "get_time": If the user asks for the current time.

Important:
-Use  ${userName} agar koi puche tumhe kisne banaya
-Only respond with the JSON object ,nothing else

now your userInput-${command},
        `;
        
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
        return { error: "Failed to get response from Gemini API" };
    }
};

export default geminiResponse