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


const STOP_WORDS = new Set(['what', 'who', 'is', 'are', 'the', 'how', 'where', 'when', 'you', 'your', 'me', 'tell', 'about', 'can', 'please', 'was', 'were', 'which', 'from', 'this', 'that', 'with', 'for', 'and', 'my', 'do', 'does']);

export const searchFAQ = async (query) => {
    try {
        const queryLower = query.toLowerCase().trim();
        const allWords = queryLower.split(/\s+/).filter(w => w.length > 1);
        
        // Filter out stop words to find the "meaningful" part of the query
        const searchWords = allWords.filter(w => !STOP_WORDS.has(w));
        
        // If the query only has stop words (e.g. "Who are you?"), use all words, otherwise use meaningful words
        const effectiveWords = searchWords.length > 0 ? searchWords : allWords;
        if (effectiveWords.length === 0) return null;

        // Escape special characters and use word boundaries to avoid partial matches (like 'is' in 'mission')
        const escapedWords = effectiveWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const searchRegex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'i');

        // Find potential matches
        const matches = await FAQ.find({
            $or: [
                { keywords: { $regex: searchRegex } },
                { question: { $regex: searchRegex } },
                { alternateQuestions: { $regex: searchRegex } },
                { category: { $regex: searchRegex } }
            ]
        });

        if (!matches || matches.length === 0) return null;

        // Scoring logic to find the best match
        const scoredMatches = matches.map(faq => {
            let score = 0;
            const faqQuestion = faq.question.toLowerCase();
            const faqKeywords = faq.keywords.map(k => k.toLowerCase());
            
            // Higher score for exact question match or strong inclusion
            if (faqQuestion.includes(queryLower) || queryLower.includes(faqQuestion)) score += 10;
            
            // Score based on how many query words match keywords or the question
            allWords.forEach(word => {
                const isStopWord = STOP_WORDS.has(word);
                const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
                
                // Stop words give much lower scores to prevent false positives
                if (faqKeywords.some(kw => wordRegex.test(kw))) score += isStopWord ? 1 : 5;
                if (wordRegex.test(faqQuestion)) score += isStopWord ? 1 : 3;
                if (faq.alternateQuestions.some(aq => wordRegex.test(aq))) score += isStopWord ? 1 : 3;
                if (faq.category.toLowerCase() === word) score += 2;
            });

            return { faq, score };
        });

        // Sort by score descending and return the best one
        scoredMatches.sort((a, b) => b.score - a.score);

        // Thresholding: Increased to 7 to ensure at least one meaningful word matches
        const MIN_SCORE_THRESHOLD = 7;
        const bestMatch = scoredMatches[0];
        return bestMatch && bestMatch.score >= MIN_SCORE_THRESHOLD ? bestMatch.faq : null;
    } catch (error) {
        console.error("FAQ search error:", error);
        return null;
    }
};