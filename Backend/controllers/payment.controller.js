import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/usermodel.js';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("❌ ERROR: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not defined in environment variables.");
    throw new Error("Razorpay API keys are missing. Please check your .env file.");
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount provided." });
        }

        const options = {
            amount: req.body.amount * 100, // amount in smallest currency unit
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        if (!order) return res.status(500).send("Error creating order");

        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing Razorpay payment details." });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment is successful, update user to premium
            // Ensure req.userId is set by your isAuthenticated middleware
            const updatedUser = await User.findByIdAndUpdate(req.userId, { isPremium: true }, { new: true }).select("-password");

            return res.json({
                success: true,
                message: "Payment verified successfully. You are now a premium user!",
                user: updatedUser
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid signature sent!"
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};