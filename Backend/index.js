import express  from 'express';
import dotenv from 'dotenv';
import connectdb from './config/db.js';
import userRouter from './routes/userroute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/authuser.route.js';
import geminiResponse from './gemini.js';
dotenv.config();
    connectdb();

const app = express();
app.use(cors({
  origin: [ "https://college-ai-assistant.netlify.app", "http://localhost:5173"], // Allow requests from this origin
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

 app.get("/" ,(req,res)=>{
    res.send("Hello to Major Project AI Backend");
  })
app.use('/api/auth', userRouter);
app.use('/api/user', authRouter); 

app.get('/api/test', async (req, res) => {
  try {
    const prompt = req.query.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt query parameter is required" });
    }
    const result = await geminiResponse(prompt);
    
    if (result.error) return res.status(500).json(result);
    res.json({ response: result });
  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
});