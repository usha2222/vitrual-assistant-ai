import FAQ from "../models/faq.model.js";

export const addFAQ = async (req, res) => {
    try {
        const { question, answer, category, keywords, alternateQuestions } = req.body;
        const normalizedKeywords = Array.isArray(keywords)
            ? keywords.map((kw) => String(kw).trim()).filter(Boolean)
            : typeof keywords === 'string'
                ? keywords.split(',').map((kw) => kw.trim()).filter(Boolean)
                : [];

        const normalizedAltQuestions = Array.isArray(alternateQuestions)
            ? alternateQuestions.map((q) => String(q).trim()).filter(Boolean)
            : typeof alternateQuestions === 'string'
                ? alternateQuestions.split('|').map((q) => q.trim()).filter(Boolean)
                : [];

        const faq = new FAQ({ 
            question, 
            answer, 
            category, 
            keywords: normalizedKeywords,
            alternateQuestions: normalizedAltQuestions 
        });
        await faq.save();
        res.status(201).json({ success: true, message: "FAQ added successfully", faq });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.status(200).json({ success: true, faqs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const searchFAQ = async (query) => {
    try {
        const words = query.toLowerCase().trim().split(/\s+/).filter(w => w.length > 1);
        if (words.length === 0) return null;

        // Find potential matches
        const matches = await FAQ.find({
            $or: [
                { keywords: { $in: words } },
                { question: { $regex: words.join('|'), $options: 'i' } },
                { alternateQuestions: { $regex: words.join('|'), $options: 'i' } },
                { category: { $in: words } }
            ]
        });

        if (!matches || matches.length === 0) return null;

        // Scoring logic to find the best match
        const scoredMatches = matches.map(faq => {
            let score = 0;
            const faqQuestion = faq.question.toLowerCase();
            const faqKeywords = faq.keywords.map(k => k.toLowerCase());
            
            // Higher score for exact question match
            if (faqQuestion.includes(query.toLowerCase())) score += 10;
            
            // Score based on how many query words match keywords or the question
            words.forEach(word => {
                if (faqKeywords.includes(word)) score += 5;
                if (faqQuestion.includes(word)) score += 3;
                if (faq.category.toLowerCase() === word) score += 2;
            });

            return { faq, score };
        });

        // Sort by score descending and return the best one
        scoredMatches.sort((a, b) => b.score - a.score);
        return scoredMatches[0].score > 0 ? scoredMatches[0].faq : null;
    } catch (error) {
        console.error("FAQ search error:", error);
        return null;
    }
};