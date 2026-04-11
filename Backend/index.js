import express  from 'express';
import dotenv from 'dotenv';
import connectdb from './config/db.js';
import userRouter from './routes/userroute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
    connectdb();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



const PORT =  5000;
 app.get("/" ,(req,res)=>{
    res.send("heloo  to major project ai  ")
  })
app.use('/api/auth',userRouter);



app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
});