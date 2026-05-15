import express from 'express';
import { createOrder, verifyPayment } from '../controllers/payment.controller.js';
import isAuth from '../middlewares/isAuth.js';

const router = express.Router();

// POST: Create a new Razorpay order
router.post('/create-order', isAuth, createOrder);

// POST: Verify the payment signature and upgrade user to premium
router.post('/verify-payment', isAuth, verifyPayment);

export default router;