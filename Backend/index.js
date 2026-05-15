import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import connectdb from './config/db.js';
import assistantRoutes from './routes/authuser.route.js';
import authRoutes from './routes/userroute.js';
import paymentRoutes from './routes/payment.route.js';
import faqRoutes from './routes/faq.route.js';
import getAssistantResponse from './config/aiFallback.js';
import isAuth from './middlewares/isAuth.js';

const app = express();
  
// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API Home / Status Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the SDITS Virtual Assistant API",
        status: "Active"
    });
});

// Route Mounting
app.use('/api/auth', authRoutes);
app.use('/api/user', assistantRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/faq', faqRoutes);

app.post('/api/ai/chat', async (req, res) => {
    try {
        const { prompt, preferredModel } = req.body;
        const response = await getAssistantResponse(prompt, preferredModel || "gemini");
        res.json({ success: true, response });
    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
// Database Connection


const PORT = process.env.PORT || 5000;

connectdb()
app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});