import axios from 'axios';

const geminiResponse = async (command, assistantName, userName) => {

    try {
        const url = process.env.GEMINI_API_KEY
        const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
        Your are not a Google.Your will now behave like a voice-enabled virtual assistant .
        Your task is to understand the user's natural language input and respond with a JSON object like this:
        {
        "type" :"general" || "google_search" || "wikipedia_search" || "youtube_search" || "calculator_open" || "weather_show" || "get_time" || "get_date" || "get_month"|| "get_day" ||  "news" || "instagram_search" || "twitter_search" || "facebook_search" || "email_check" || "calendar_check" || "map_search" || "music_play" || "video_play" ,
        "userInput":"<the original user input>"{only remove your name from the userInput if exists} and agar kisi ne google ya youtube pe kuch search karne ko bola hai to userInput me only vo search  bola text jaye.}, 
        "response":"<a short spoken response to read out load to the user" 
        }
        Instructions:
        -"type":determine the intent of the user.
        -"userInput:original sentence the user spoke
        -"response":A short voice-friendly reply ,e.g.,"Sure,play it now" ,"Here's what I found" ,"Today is Tuesday ",etc.

        Type meanings:
        -"general": if it's a facual or informational questions.
        -"google_search":if user wants to search something on Google.
        -"youtube_search":if user wants to search something on Google.
        "music_play":if user wants to directly play or video or song.
        "calculator_open":if user wants to open a calculator.
          "instagram_open":if user wants to open instagram. 
           "facebook_open":if user wants to open a facebook.
            "twitter_open":if user wants to open a twitter.
        "get_date":if user asks for todays date.
           "get_month":if user asks for current month.
         "get_time":if user asks for current time.

Important:
-Use "{author name}" agar koi puche tume kisne banaya
-Only respond with the JSON object ,nothing else

now your userInput-${command},
        `;
        
        // Fix: Use a valid model name like gemini-1.5-flash
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${url}`,
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