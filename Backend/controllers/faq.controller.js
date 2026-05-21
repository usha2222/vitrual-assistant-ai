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
        if (!query) return null;
        const q = query.toLowerCase().trim();

        // Fetch all FAQs for smart comparison
        const allFAQs = await FAQ.find();
        
        let bestMatch = null;
        let maxMatchLength = 0;

        for (const faq of allFAQs) {
            // Create a list of all potential match targets for this FAQ
            const targets = [
                faq.question.toLowerCase(),
                ...faq.alternateQuestions.map(alt => alt.toLowerCase()),
                ...faq.keywords.map(kw => kw.toLowerCase().trim())
            ];

            for (const target of targets) {
                // If the user's query contains this specific phrase/target
                if (q.includes(target)) {
                    // Priority goes to the longest (most specific) string match
                    if (target.length > maxMatchLength) {
                        maxMatchLength = target.length;
                        bestMatch = faq;
                    }
                }
            }
        }

        return bestMatch;
    } catch (error) {
        console.error("FAQ Search Error:", error);
        return null;
    }
};


export default { addFAQ, getFAQs, updateFAQ, deleteFAQ };