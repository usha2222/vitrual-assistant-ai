import FAQ from "../models/faq.model.js";

export const addFAQ = async (req, res) => {
    try {
        const { question, answer, category, keywords } = req.body;
        const normalizedKeywords = Array.isArray(keywords)
            ? keywords.map((kw) => String(kw).trim()).filter(Boolean)
            : typeof keywords === 'string'
                ? keywords.split(',').map((kw) => kw.trim()).filter(Boolean)
                : [];

        const faq = new FAQ({ question, answer, category, keywords: normalizedKeywords });
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
        // Normalize the query for more flexible matching
        // 1. Convert to lowercase
        // 2. Remove all punctuation (except spaces)
        // 3. Replace multiple spaces with a single space
        // 4. Trim leading/trailing spaces
        const normalizedQuery = query.toLowerCase().replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();
        
        // Escape special regex characters from the normalized query
        const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Stop words are words that don't add much meaning to a search
        const stopWords = ['who', 'what', 'is', 'the', 'tell', 'me', 'about', 'at', 'of', 'in', 'for', 'are', 'you', 'can', 'please', 'give', 'any', 'information', 'how', 'where', 'when', 'why'];
        const words = normalizedQuery.split(/\s+/).filter(w => w.length > 1 && !stopWords.includes(w));

        const faq = await FAQ.findOne({
            $or: [
                // Check if the question field contains the cleaned user query (case-insensitive)
                { question: { $regex: escapedQuery, $options: 'i' } },
                // Check if any important words from the user match our stored keywords
                { keywords: { $in: words.map(w => new RegExp(`^${w}`, 'i')) } }
            ]
        });
        return faq;
    } catch (error) {
        console.error("FAQ search error:", error);
        return null;
    }
};