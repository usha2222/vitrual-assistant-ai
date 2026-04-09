import express, { json } from 'express';
import dotenv from 'dotenv';
import connectdb from './config/db.js';
import userRouter from './routes/userroute.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",userRouter);
app.listen(PORT, ()=>{
    connectdb();
  console.log(`Server is running on port ${PORT}`);
});