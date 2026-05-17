import Admin from '../models/admin.model.js';
import User from '../models/usermodel.js';
import FAQ from '../models/faq.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Admin Login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 3600000 // 1 hour
        }).status(200).json({
            success: true,
            message: "Admin logged in successfully",
            admin: {
                _id: admin._id,
                username: admin.username,
                email: admin.email,
                isProfileUpdated: admin.isProfileUpdated
            }
        });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.userId).select('-password');
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        res.status(200).json({ success: true, admin });
    } catch (error) {
        console.error("Get admin profile error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const admin = await Admin.findById(req.userId);

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        admin.username = username || admin.username;
        admin.email = email || admin.email;
        if (password) {
            admin.password = await bcrypt.hash(password, 10);
        }
        admin.isProfileUpdated = true; // Mark as updated after first login/change

        await admin.save();
        res.status(200).json({ success: true, message: "Profile updated successfully", admin: admin.toObject({ getters: true, virtuals: false, minimize: false }) });
    } catch (error) {
        console.error("Update admin profile error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get All Users (for admin dashboard)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Admin Logout (can reuse user logout logic or create a specific one)
export const adminLogout = (req, res) => {
    res.cookie('token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', expires: new Date(0) })
        .status(200)
        .json({ success: true, message: "Admin logged out successfully" });
};