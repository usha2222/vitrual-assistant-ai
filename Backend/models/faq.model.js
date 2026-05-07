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
    alternateQuestions: {
        type: [String],
        default: []
    },
    category: {
        type: String,
        enum: ['admissions', 'academics' ,'fees', 'courses', 'department_location', 'assistant_professor', 'hod', 'placements', 'facilities', 'address', 'general'],
        default: 'general'
    },
    keywords: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const FAQ = mongoose.model("faqquestionsdata", faqSchema);
export default FAQ