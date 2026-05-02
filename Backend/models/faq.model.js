import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        unique: true
    },
    answer: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['admissions', 'academics' ,'fees', 'courses', 'departments', 'faculty', 'placements', 'facilities', 'address', 'general'],
        default: 'general'
    },
    keywords: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const FAQ = mongoose.model("knowledgedata", faqSchema);
export default FAQ