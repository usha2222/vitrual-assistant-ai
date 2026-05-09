import User from '../models/usermodel.js'
import uploadToCloudinary from '../middlewares/cloudinary.js';
import geminiResponse from '../gemini.js';
import { searchFAQ } from './faq.controller.js';
import moment from 'moment';
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");
        if (!user) {

            return res.status(400).json({ success: false, message: "User not found" })
        }
        console.log(user);
        return res.status(200).json({ success: true, user })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body;

        if (!req.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: No User ID found" });
        }
        
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        user.history.push(command);
        await user.save();
        const userName = user.name;
        const assistantName = user.assistantName || "Assistant";
        const lowerCommand = command.toLowerCase();
        const lowerName = (user.assistantName || "Assistant").toLowerCase();

        // Flexible name check: works if the name is mentioned in the first few words
        const wordsInCommand = lowerCommand.trim().split(/\s+/);
        const isAddressed = wordsInCommand.slice(0, 3).some(word => word.includes(lowerName));

        if (assistantName && !isAddressed) {
            return res.json({
                success: true,
                type: "general",
                userInput: command,
                response: `Hello ${userName}, please address me by my name (${assistantName}) so I know you are talking to me.`
            });
        }

        // Robustly remove the assistant's name using Regex
        const nameRegex = new RegExp(`\\b${lowerName}\\b`, 'i');
        let cleanedCommand = command.replace(nameRegex, '').replace(/^[^\w\s]+/, '').trim();

        // If the command is empty after removing the assistant's name, respond with a listening prompt
        if (!cleanedCommand) {
            return res.json({
                success: true,
                type: "general",
                userInput: command,
                response: `Yes ${userName}, I am listening. How can I help you with SDITS today?`
            });
        }

        // First, search in MongoDB FAQ
        const faqResult = await searchFAQ(cleanedCommand);
        if (faqResult) {
            return res.json({
                success: true,
                type: "general",
                userInput: cleanedCommand,
                response: faqResult.answer
            });
        }

        // If not found in FAQ, use Gemini
        const result = await geminiResponse(cleanedCommand, assistantName, userName);
        if (result.error) {
            return res.status(500).json({ success: false, message: result.error });
        }
        
        const jsonMatch = result.response?.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            return res.status(400).json({ success: false, message: "Sorry ,I couldn't understand that. Please try again." })
        }

        //COnvert the string into JSON format
        let gemResult;
        try {
            gemResult = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
            console.error("JSON Parse Error:", jsonMatch[0]);
            return res.status(400).json({ success: false, message: "Assistant returned an invalid format." });
        }

        const type = gemResult.type; 
        switch (type) {
            case 'get_date':
                return res.json({
                    success: true,
                    type: type,
                    userInput: gemResult.userInput,
                    response: `Current date is ${moment().format('YYYY-MM-DD')}`,
                });
            case 'get_time':
                return res.json({
                    success: true,
                    type: type,
                    userInput: gemResult.userInput,
                    response: `Current time is ${moment().format('hh:mm:A')}`,
                });
            case 'get_month':
                return res.json({
                    success: true,
                    type: type,
                    userInput: gemResult.userInput,
                    response: `Current month is ${moment().format('MMMM')}`,
                });
            case 'get_day':
                return res.json({
                    success: true,
                    type: type,
                    userInput: gemResult.userInput,
                    response: `Current day is ${moment().format('dddd')}`,
                });
            
            default:
                return res.json({
                    success: true,
                    type: gemResult.type || "general",
                    userInput: gemResult.userInput,
                    response: gemResult.response || "I processed your request, but I'm not sure what to say.",
                });
        }
       
    }
    catch (error) {
        console.error("Ask Assistant Error:", error);
        return res.status(500).json({ success: false, message: "Ask to Assistant Error", error: error.message });
    }
    

}
export const deleteHistory = async (req, res) => {
    try {
        const { index } = req.body;
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (index !== undefined && index >= 0 && index < user.history.length) {
            user.history.splice(index, 1);
            await user.save();
            return res.status(200).json({ success: true, message: "History item deleted", user });
        }
        return res.status(400).json({ success: false, message: "Invalid index" });
    } catch (error) {
        console.error("Delete History Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export default { getCurrentUser, askToAssistant, deleteHistory } 