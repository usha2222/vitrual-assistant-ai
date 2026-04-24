import User from '../models/usermodel.js'
import uploadToCloudinary from '../middlewares/cloudinary.js';
import geminiResponse from '../gemini.js';
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
export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body;
        let assistantImage;
        if (req.file) {
            assistantImage = await uploadToCloudinary(req.file.path);
        }
        else {
            assistantImage = imageUrl;
        }
        const user = await User.findByIdAndUpdate(req.userId, { assistantName, assistantImage }, { new: true }).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        return res.status(200).json({ success: true, message: "Assistant updated successfully", user })

    } catch (error) {
        console.error("Update Assistant Error:", error);
        return res.status(500).json({ success: false, message: "Update Assistant Error", error: error.message });

    }
}

export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body;

        if (!req.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: No User ID found" });
        }
        
        const user = await User.findById(req.userId).select("-password");
        user.history.push();
        user.save();
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        const userName = user.name;
        const assistantName = user.assistantName || "Assistant";
        const assistantImage = user.assistantImage;

        const result = await geminiResponse(command, assistantName, userName);
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
            case 'general':
            case 'google_search':
            case 'wikipedia_search':
            case 'youtube_search':
            case 'calculator_open':
            case 'weather_show':
            case 'news':
            case 'instagram_search':
            case 'twitter_search':
            case 'facebook_search':
            case 'email_check':
            case 'calendar_check':
            case 'map_search':
            case 'music_play':
            case 'video_play':

                return res.json({
                    success: true,
                    type: type,
                    userInput: gemResult.userInput,
                    response: gemResult.response,
                })
            default:
                // Fallback to general response
                return res.json({
                    success: true,
                    type: type || "general",
                    userInput: gemResult.userInput,
                    response: gemResult.response || "I processed your request, but I'm not sure what to say.",
                });
        }
        return res.json({ success: true, type: gemResult.type, userInput: gemResult.userInput, response: gemResult.response, assistantImage })
    }
    catch (error) {
        console.error("Ask Assistant Error:", error);
        return res.status(500).json({ success: false, message: "Ask to Assistant Error", error: error.message });
    }

}
export default { getCurrentUser, updateAssistant, askToAssistant }