import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import connectdb from './config/db.js';
import assistantRoutes from './routes/authuser.route.js';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/userroute.js';
import paymentRoutes from './routes/payment.route.js';
import faqRoutes from './routes/faq.route.js';
import getAssistantResponse from './config/aiFallback.js';
import isAuth from './middlewares/isAuth.js';
import isAdmin from './middlewares/isAdmin.js'; // Import the new isAdmin middleware
import adminRoutes from './routes/admin.route.js'; // Import admin routes
import Admin from './models/admin.model.js';

const app = express();
  
// Middleware
app.use(cors({
      origin: ["https://college-ai-assistant.netlify.app", "http://localhost:5173"],
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
app.use('/api/admin', adminRoutes); // Mount admin routes

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


const seedAdmin = async () => {
    try {
        const admin = await Admin.findOne({ email: 'admin@sdits.com' });
        if (!admin) {
            const hashedPassword = await bcrypt.hash('adminPassword123', 10); // Hash the password
            const defaultAdmin = new Admin({
                username: 'admin',
                email: 'admin@sdits.com',
                password: hashedPassword, // Use the hashed password
                isAdmin: true, // Set isAdmin to true for the default admin
                isProfileUpdated: false
            });
            await defaultAdmin.save();
            console.log('✅ Default admin created. Username: admin, Password: adminPassword123');
        } else if (admin.isAdmin === false || admin.isAdmin === undefined) {
            // एटलस पर मौजूद पुराने एडमिन को अपडेट करें
            admin.isAdmin = true;
            await admin.save();
            console.log('✅ Existing admin updated with isAdmin flag.');
        }
    } catch (error) {
        console.error('❌ Error seeding admin data:', error);
    }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(` Server is running on port ${PORT}`);
    await connectdb();
    await seedAdmin();
});