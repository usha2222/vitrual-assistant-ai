import express  from 'express';
import dotenv from 'dotenv';
import connectdb from './config/db.js';
import userRouter from './routes/userroute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/authuser.route.js';
import geminiResponse from './gemini.js';
import faqRouter from './routes/faq.route.js';
dotenv.config();

const app = express();
app.use(cors({
  origin: ["https://college-ai-assistant.netlify.app", "http://localhost:5173"], // Allow requests from this origin
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

 app.get("/" ,(req,res)=>{
    res.send("Hello to Major Project AI Backend");
  })
  //for login and register and logout
app.use('/api/auth', userRouter);
//for current user and ask to assistant
app.use('/api/user', authRouter);
//for testing gemini response
app.use('/api/faqs',faqRouter) 

app.post('/api/test-gemini', async (req, res) => {
  const { command, assistantName, userName } = req.body;
  try {
    const result = await geminiResponse(command, assistantName, userName);
    if (result.error) {
      return res.status(500).json({ success: false, message: result.error });
    }
    // Return the result directly as it contains the 'response' string from Gemini
    res.json({ success: true, ...result });
  } catch (error) { 
    console.error("Gemini Test Error:", error);
    res.status(500).json({ error: "Failed to get response from Gemini API" });
  }
});

// Connect to DB then start server

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectdb();
  });
  export default app;