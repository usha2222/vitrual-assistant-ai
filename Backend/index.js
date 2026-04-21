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
  origin: [ "https://college-ai-assistant.netlify.app", "http://localhost:5174"], // Allow requests from this origin
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

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
});