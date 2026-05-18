import FAQ from '../models/faq.model.js'; // Assuming you have an FAQ model

// Helper function to normalize category from frontend
const normalizeCategory = (category) => {
    // Ensure category is lowercase and handle common variations if needed
    return category ? category.toLowerCase() : 'general';
};

// Add a new FAQ
export const addFAQ = async (req, res) => {
    try {
        const { question, answer, category, keywords, alternateQuestions } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ success: false, message: "Question and Answer are required." });
        }

        const newFAQ = new FAQ({
            question,
            answer,
            category: normalizeCategory(category),
            keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
            alternateQuestions: alternateQuestions ? alternateQuestions.split('|').map(q => q.trim()) : [],
        });

        await newFAQ.save();
        res.status(201).json({ success: true, message: "FAQ added successfully.", faq: newFAQ });
    } catch (error) {
        console.error("Error adding FAQ:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Get all FAQs
export const getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.status(200).json({ success: true, faqs });
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Update an existing FAQ
export const updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, category, keywords, alternateQuestions } = req.body;

        const updatedFAQ = await FAQ.findByIdAndUpdate(
            id,
            {
                question,
                answer,
                category: normalizeCategory(category),
                keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
                alternateQuestions: alternateQuestions ? alternateQuestions.split('|').map(q => q.trim()) : [],
            },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        if (!updatedFAQ) {
            return res.status(404).json({ success: false, message: "FAQ not found." });
        }

        res.status(200).json({ success: true, message: "FAQ updated successfully.", faq: updatedFAQ });
    } catch (error) {
        console.error("Error updating FAQ:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Delete an FAQ
export const deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFAQ = await FAQ.findByIdAndDelete(id);

        if (!deletedFAQ) {
            return res.status(404).json({ success: false, message: "FAQ not found." });
        }

        res.status(200).json({ success: true, message: "FAQ deleted successfully." });
    } catch (error) {
        console.error("Error deleting FAQ:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

export const searchFAQ = async (query) => {
    try {
        const q = query.toLowerCase().trim();

        // 1. Check for Exact Match in Question or Alternate Questions
        // This ensures we find the specific answer if the user asks exactly what is stored.
        const exactMatch = await FAQ.findOne({
            $or: [
                { question: { $regex: new RegExp(`^${q}$`, 'i') } },
                { alternateQuestions: { $regex: new RegExp(`^${q}$`, 'i') } }
            ]
        });
        if (exactMatch) return exactMatch;

        // 2. Check for Exact Keyword Match
        // We split the user's input into words and see if any word matches your "keywords" array exactly.
        const words = q.split(/\s+/);
        const keywordMatch = await FAQ.findOne({
            $or: [
                { keywords: q },            // Match full query as a keyword
                { keywords: { $in: words } } // Match any single word from query as a keyword
            ]
        });
        if (keywordMatch) return keywordMatch;

        // If no strict match is found, return null to let the AI (Gemini) handle it.
        return null;
    } catch (error) {
        console.error("FAQ search error:", error);
        return null;
    }
};


export default { addFAQ, getFAQs, updateFAQ, deleteFAQ };