import { getGeminiResponse } from "../services/gemini.service.js";
import { getGroqResponse } from "../services/groq.service.js";
import { getMistralResponse } from "../services/mistralService.js"; // Ensure this path is correct

export const getAssistantResponse = async (prompt, preferredModel = null) => {
    const providers = [
        { name: "Gemini", fn: getGeminiResponse, key: "GEMINI_API_KEY" },
        { name: "Groq", fn: getGroqResponse, key: "GROQ_API_KEY" },
        { name: "Mistral", fn: getMistralResponse, key: "MISTRAL_API_KEY" },
    ];

    //by default gemini model is preferredmodel
    let selectedProvider = providers[0];

    if (preferredModel) {
        const requested = providers.find(p => p.name.toLowerCase() === preferredModel.toLowerCase());
        if (requested) {
            selectedProvider = requested;
            console.log(`[Assistant] Using user preferred model: ${selectedProvider.name}`);
        }
    }

    const apiKey = process.env[selectedProvider.key];
    if (!apiKey || apiKey.trim() === "") {
        throw new Error(`API key for ${selectedProvider.name} is missing in .env file.`);
    }

    try {
        console.log(`[Assistant] Attempting ${selectedProvider.name}...`);
        const response = await selectedProvider.fn(prompt);
        
        if (response) return response;
        throw new Error(`${selectedProvider.name} returned an empty response.`);
    } catch (error) {
        const apiError = error.response?.data?.error?.message || error.message || "Unknown error";
        console.error(`[Assistant] ${selectedProvider.name} failed:`, apiError);
        throw new Error(`AI Service (${selectedProvider.name}) failed: ${apiError}`);
    }
};

export default getAssistantResponse;