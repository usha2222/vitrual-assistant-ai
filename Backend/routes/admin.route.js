import express from 'express';
import { adminLogin, getAdminProfile, updateAdminProfile, getAllUsers, adminLogout } from '../controllers/admin.controller.js';
import { addFAQ, getFAQs, updateFAQ, deleteFAQ } from '../controllers/faq.controller.js';
import isAuth from '../middlewares/isAuth.js'; // Assuming isAuth checks for a valid token
import isAdmin from '../middlewares/isAdmin.js'; // Custom middleware to check if the user is an admin

const adminRouter = express.Router();

// Public Admin Routes
adminRouter.post('/login', adminLogin);

// Protected Admin Routes (require authentication and admin role)
adminRouter.get('/profile', isAuth, isAdmin, getAdminProfile);
adminRouter.put('/profile', isAuth, isAdmin, updateAdminProfile);
adminRouter.get('/users', isAuth, isAdmin, getAllUsers);
adminRouter.get('/logout', isAuth, isAdmin, adminLogout); // Using GET for logout, consider POST for better practice

// FAQ Management
//Get all FAQ
adminRouter.get('/get-faqs', isAuth, isAdmin, getFAQs);
adminRouter.post('/add-faq', isAuth, isAdmin, addFAQ);
adminRouter.put('/update-faq/:id', isAuth, isAdmin, updateFAQ);
adminRouter.delete('/delete-faq/:id', isAuth, isAdmin, deleteFAQ);

export default adminRouter;