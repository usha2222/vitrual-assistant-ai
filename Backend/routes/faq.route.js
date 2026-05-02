import express from "express";
import { addFAQ, getFAQs } from "../controllers/faq.controller.js";
import isAuth from "../middlewares/isAuth.js";

const faqRouter = express.Router();

faqRouter.post("/add", isAuth, addFAQ); // For admin to add FAQs
faqRouter.get("/", getFAQs); // Public or authenticated

export default faqRouter;